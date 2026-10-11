import React from "react";
import { motion } from "framer-motion";

const DECISIONS = {
  advance: { ar: "جاهز تتقدّم للمرحلة الجاية", en: "Ready to advance", cls: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" },
  strengthen: { ar: "محتاج تقوية قبل التقدّم", en: "Strengthen before advancing", cls: "text-zeus-brightgold bg-zeus-gold/10 border-zeus-gold/30" },
  redo: { ar: "محتاج تعيد المشروع", en: "Rework required", cls: "text-red-400 bg-red-400/10 border-red-400/30" },
};

function List({ title, items }) {
  if (!items?.length) return null;
  return (
    <div>
      <h4 className="text-xs font-bold text-zeus-brightgold mb-1.5">{title}</h4>
      <ul className="text-sm text-muted-foreground space-y-1 list-disc ps-4">{items.map((s, i) => <li key={i}>{s}</li>)}</ul>
    </div>
  );
}

export default function ReadinessReport({ a, isAr }) {
  const d = DECISIONS[a.decision] || DECISIONS.strengthen;
  return (
    <div className="space-y-4 p-4 rounded-2xl bg-background/30 border border-border/50">
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 shrink-0 rounded-full grid place-items-center"
          style={{ background: `conic-gradient(#FFC107 ${a.overall * 3.6}deg, rgba(148,163,184,0.15) 0deg)` }}>
          <div className="absolute inset-1.5 rounded-full bg-card/90 backdrop-blur" />
          <span className="relative font-heading font-bold text-xl">{a.overall}</span>
        </div>
        <div>
          <div className="text-xs text-muted-foreground mb-1">{isAr ? "تقرير الجاهزية" : "Readiness Report"}</div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${d.cls}`}>{isAr ? d.ar : d.en}</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {(a.criteria || []).map((c, i) => (
          <div key={i}>
            <div className="flex justify-between text-xs mb-1"><span className="font-medium">{c.name}</span><span className="text-muted-foreground">{Math.round(c.score)}</span></div>
            <div className="h-1.5 rounded-full bg-secondary/40 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${c.score}%` }} transition={{ duration: 0.8, delay: i * 0.08 }} className="h-full bg-gradient-to-r from-zeus-orange to-zeus-brightgold" />
            </div>
            {c.feedback && <p className="text-xs text-muted-foreground mt-1">{c.feedback}</p>}
          </div>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        <List title={isAr ? "نقاط القوة" : "Strengths"} items={a.strengths} />
        <List title={isAr ? "الفجوات" : "Gaps"} items={a.gaps} />
        <List title={isAr ? "الخطوات الجاية" : "Next steps"} items={a.next_steps} />
      </div>
    </div>
  );
}