import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Map, Rocket, Sparkles } from "lucide-react";

export default function RoadmapReveal({ preview, typing, building, onBuild, isAr, companionName }) {
  const nodes = preview?.nodes || [];
  const phases = [...new Set(nodes.map((n) => n.phase))].sort((a, b) => a - b);
  const skills = [...new Set(nodes.flatMap((n) => n.skills || []))].slice(0, 10);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (!preview) return;
    setStage(1);
    const t1 = setTimeout(() => setStage(2), 2200);
    const t2 = setTimeout(() => setStage(3), 2200 + phases.length * 500 + 800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [preview]);

  if (typing || !preview) {
    return (
      <div className="text-center animate-fade-up">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-zeus-gold to-zeus-brightgold flex items-center justify-center mb-6 shadow-gold animate-float">
          <Map className="text-zeus-midnight" style={{ width: 36, height: 36 }} />
        </div>
        <div className="flex flex-col items-center gap-3 py-6">
          <Loader2 className="text-zeus-gold animate-spin" style={{ width: 30, height: 30 }} />
          <p className="text-muted-foreground text-sm">
            {isAr ? "بحلّل مهاراتك وبصمّم رحلتك خطوة بخطوة..." : "Analyzing your skills and designing your journey step by step..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up" dir={isAr ? "rtl" : "ltr"}>
      {/* Companion narration */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 mb-6">
        <div className="shrink-0 w-10 h-10 rounded-full overflow-hidden border border-zeus-gold/40">
          <img src="https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/d926a568e_image-removebg-preview1.png" alt="Zeus" className="w-full h-full object-cover object-top" />
        </div>
        <div className="zeus-glass p-4 flex-1">
          <p className="text-sm leading-relaxed">
            {isAr
              ? "بناءً على كلامنا، دي المهارات اللي شايفها الأنسب ليك والأكتر طلبًا في السوق — وقسمتهالك مراحل، كل واحدة بتبني على اللي قبلها."
              : "Based on our talk, these are the skills I see as the best fit for you and most in demand — split into phases, each building on the last."}
          </p>
        </div>
      </motion.div>

      {/* Skills reveal */}
      <AnimatePresence>
        {stage >= 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
            <div className="text-xs font-semibold uppercase tracking-wide text-zeus-brightgold flex items-center gap-1.5 mb-2.5">
              <Sparkles style={{ width: 13, height: 13 }} /> {isAr ? "هنبني المهارات دي مع بعض" : "We'll build these skills together"}
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((s, i) => (
                <motion.span key={s} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                  className="px-3 py-1.5 rounded-full bg-zeus-gold/10 border border-zeus-gold/30 text-zeus-brightgold text-xs font-medium">
                  {s}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phases reveal */}
      <AnimatePresence>
        {stage >= 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2.5 max-h-[34vh] overflow-y-auto pe-1">
            {phases.map((p, i) => (
              <motion.div key={p} initial={{ opacity: 0, x: isAr ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.5, duration: 0.4 }}
                className="zeus-glass p-3.5 flex items-start gap-3">
                <div className="shrink-0 w-8 h-8 rounded-full bg-zeus-gold text-zeus-midnight flex items-center justify-center text-sm font-bold">{p}</div>
                <div className="min-w-0">
                  <div className="text-zeus-brightgold text-xs font-semibold mb-1">{isAr ? `المرحلة ${p}` : `Phase ${p}`}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {nodes.filter((n) => n.phase === p).map((n) => (
                      <span key={n.id} className="px-2.5 py-1 rounded-full bg-secondary/40 text-xs">{n.title}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-6">
            <p className="text-sm text-muted-foreground mb-3">
              {isAr ? "جاهز؟ هعملك دلوقتي خريطة تفاعلية — كل محطة فيها مهام ومصادر جاهزة." : "Ready? I'll now build your interactive map — every stop has tasks and ready resources."}
            </p>
            <button onClick={onBuild} disabled={building}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold disabled:opacity-50">
              {building
                ? <><Loader2 className="animate-spin" style={{ width: 18, height: 18 }} /> {isAr ? "ببني رحلتك..." : "Building your journey..."}</>
                : <><Rocket style={{ width: 18, height: 18 }} /> {isAr ? "يلا نبدأ الرحلة" : "Start the journey"}</>}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}