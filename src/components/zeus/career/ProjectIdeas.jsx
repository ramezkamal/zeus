import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, Loader2, Plus, X, Rocket, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ProjectIdeas({ profile, lang, isAr }) {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [added, setAdded] = useState(new Set());

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await base44.functions.invoke("generateProjectIdeas", { profile, lang });
      setIdeas((res.data || res).ideas || []);
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  const addProject = async (idea) => {
    try {
      await base44.entities.Project.create({
        title: idea.title,
        goal: profile?.goal || "",
        description: idea.description,
        requirements: idea.requirements || [],
        technologies: idea.technologies || [],
        milestones: idea.milestones || [],
        difficulty: idea.difficulty || "beginner",
        status: "suggested"
      });
      setAdded(new Set([...added, idea.title]));
    } catch {}
  };

  const diffColor = { beginner: "text-emerald-400", intermediate: "text-zeus-brightgold", advanced: "text-red-400" };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading font-bold text-sm flex items-center gap-2">
          <Lightbulb className="text-zeus-gold" style={{ width: 16, height: 16 }} /> {isAr ? "أفكار مشاريع لمسارك" : "Project Ideas for Your Track"}
        </h2>
        {ideas.length === 0 && !loading && (
          <button onClick={load} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zeus-gold/40 text-zeus-brightgold text-xs font-medium hover:bg-zeus-gold/10 transition">
            <Rocket style={{ width: 14, height: 14 }} /> {isAr ? "ولّد أفكار" : "Generate"}
          </button>
        )}
      </div>

      {loading && (
        <div className="zeus-glass p-8 text-center">
          <Loader2 className="text-zeus-gold animate-spin mx-auto mb-3" style={{ width: 28, height: 28 }} />
          <p className="text-sm text-muted-foreground">{isAr ? "بفكّر في مشاريع مناسبة ليك..." : "Thinking of projects that fit you..."}</p>
        </div>
      )}

      {error && (
        <div className="zeus-glass p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">{isAr ? "حصل خطأ، حاول تاني" : "Something went wrong, try again"}</p>
          <button onClick={load} className="px-4 py-2 rounded-full bg-zeus-gold text-zeus-midnight text-sm font-medium">{isAr ? "إعادة" : "Retry"}</button>
        </div>
      )}

      {!loading && !error && ideas.length > 0 && (
        <div className="space-y-3">
          {ideas.map((idea, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="zeus-glass p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-sm">{idea.title}</h3>
                  <span className={`text-[11px] font-medium ${diffColor[idea.difficulty] || ""}`}>{idea.difficulty}</span>
                </div>
                <button onClick={() => addProject(idea)} disabled={added.has(idea.title)}
                  className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition disabled:opacity-50">
                  {added.has(idea.title) ? (
                    <span className="text-emerald-400 inline-flex items-center gap-1"><Check style={{ width: 14, height: 14 }} /> {isAr ? "اتضاف" : "Added"}</span>
                  ) : (
                    <span className="bg-zeus-gold/15 text-zeus-brightgold hover:bg-zeus-gold/25 inline-flex items-center gap-1 px-3 py-1.5 rounded-full"><Plus style={{ width: 14, height: 14 }} /> {isAr ? "أضف" : "Add"}</span>
                  )}
                </button>
              </div>
              {idea.problem && <p className="text-xs text-muted-foreground mb-2 italic">"{idea.problem}"</p>}
              <p className="text-xs text-foreground/80 leading-relaxed mb-3">{idea.description}</p>
              {idea.technologies?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {idea.technologies.map((t, j) => (
                    <span key={j} className="px-2 py-0.5 rounded-full bg-secondary/40 text-[10px]">{t}</span>
                  ))}
                </div>
              )}
              {idea.portfolio_value && (
                <p className="text-[11px] text-zeus-brightgold mt-2 pt-2 border-t border-border/40">
                  💼 {idea.portfolio_value}
                </p>
              )}
              <button onClick={() => setSelected(idea)} className="text-[11px] text-zeus-gold hover:underline mt-2">
                {isAr ? "تفاصيل أكتر" : "View details"}
              </button>
            </motion.div>
          ))}
          <button onClick={load} className="w-full py-2.5 rounded-xl border border-border/60 text-xs text-muted-foreground hover:text-zeus-brightgold hover:border-zeus-gold/40 transition">
            {isAr ? "ولّد أفكار تانية" : "Generate different ideas"}
          </button>
        </div>
      )}

      {!loading && !error && ideas.length === 0 && (
        <div className="zeus-glass p-6 text-center">
          <Lightbulb className="text-muted-foreground/40 mx-auto mb-3" style={{ width: 28, height: 28 }} />
          <p className="text-sm text-muted-foreground mb-1">{isAr ? "محتاج أفكار مشاريع حقيقية تناسب مسارك؟" : "Need real project ideas for your track?"}</p>
          <p className="text-xs text-muted-foreground mb-4">{isAr ? "هولّدلك مشاريع عملية تبنيناها وتحطها في بورتفوليوك" : "I'll generate practical projects you can build and add to your portfolio"}</p>
          <button onClick={load} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zeus-gold text-zeus-midnight font-semibold text-sm hover:bg-zeus-brightgold transition shadow-gold">
            <Rocket style={{ width: 16, height: 16 }} /> {isAr ? "ابدأ التوليد" : "Start generating"}
          </button>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={() => setSelected(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative zeus-glass p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelected(null)} className="absolute top-4 end-4 text-muted-foreground hover:text-foreground"><X style={{ width: 20, height: 20 }} /></button>
              <h2 className="font-heading font-extrabold text-xl mb-1">{selected.title}</h2>
              <span className={`text-xs font-medium ${diffColor[selected.difficulty] || ""}`}>{selected.difficulty}</span>
              {selected.problem && <p className="text-sm text-muted-foreground mt-3 italic">"{selected.problem}"</p>}
              {selected.description && <p className="text-sm text-foreground/85 mt-3 leading-relaxed">{selected.description}</p>}
              {selected.requirements?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zeus-brightgold mb-2">{isAr ? "المتطلبات" : "Requirements"}</h3>
                  <ul className="list-disc ps-4 text-sm text-muted-foreground space-y-1">
                    {selected.requirements.map((r, j) => <li key={j}>{r}</li>)}
                  </ul>
                </div>
              )}
              {selected.milestones?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zeus-brightgold mb-2">{isAr ? "المراحل" : "Milestones"}</h3>
                  <ol className="list-decimal ps-4 text-sm text-muted-foreground space-y-1">
                    {selected.milestones.map((m, j) => <li key={j}>{m}</li>)}
                  </ol>
                </div>
              )}
              {selected.skills_practiced?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zeus-brightgold mb-2">{isAr ? "مهارات بتتطبّق" : "Skills Practiced"}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.skills_practiced.map((s, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-full bg-zeus-gold/10 text-zeus-brightgold text-xs">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {selected.portfolio_value && (
                <div className="mt-4 p-3 rounded-xl bg-secondary/30 border border-border/60">
                  <p className="text-xs text-zeus-brightgold">💼 {selected.portfolio_value}</p>
                </div>
              )}
              <button onClick={() => { addProject(selected); setSelected(null); }} disabled={added.has(selected.title)}
                className="w-full mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-zeus-gold text-zeus-midnight font-semibold text-sm hover:bg-zeus-brightgold transition shadow-gold disabled:opacity-50">
                {added.has(selected.title) ? <><Check style={{ width: 16, height: 16 }} /> {isAr ? "اتضاف بالفعل" : "Already added"}</> : <><Plus style={{ width: 16, height: 16 }} /> {isAr ? "أضف لمشاريعي" : "Add to my projects"}</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}