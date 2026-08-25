import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Brain, Clock, Gauge, Target } from "lucide-react";

const LEVELS = [
  { v: "beginner", ar: "مبتدئ", en: "Beginner" },
  { v: "intermediate", ar: "متوسط", en: "Intermediate" },
  { v: "advanced", ar: "متقدم", en: "Advanced" }
];
const HOURS = [3, 5, 10, 15];

const CHIP_FIELDS = [
  { key: "learning_style", ar: "أسلوبك", en: "Style", map: { visual: ["بصري", "Visual"], video: ["فيديو", "Video"], reading: ["قراءة", "Reading"], hands_on: ["تطبيقي", "Hands-on"], mixed: ["مختلط", "Mixed"] } },
  { key: "preferred_language", ar: "لغة المحتوى", en: "Content language", map: { ar: ["عربي", "Arabic"], en: ["إنجليزي", "English"], mixed: ["مختلط", "Mixed"] } },
  { key: "depth", ar: "العمق", en: "Depth", map: { overview: ["نظرة عامة", "Overview"], balanced: ["متوازن", "Balanced"], deep: ["تعمّق", "Deep"] } },
  { key: "career_intent", ar: "هدفك المهني", en: "Career intent" },
  { key: "motivation", ar: "اللي بيحركك", en: "Motivation" },
  { key: "background", ar: "خلفيتك", en: "Background" }
];

export default function DnaSummary({ profile, isAr, Arrow, onConfirm }) {
  const [goal, setGoal] = useState(profile?.goal || "");
  const [level, setLevel] = useState(profile?.current_level || "beginner");
  const [hours, setHours] = useState(profile?.weekly_hours || 5);

  const chips = CHIP_FIELDS
    .map((f) => {
      const raw = profile?.[f.key];
      if (!raw) return null;
      const value = f.map ? (f.map[raw] ? f.map[raw][isAr ? 0 : 1] : raw) : raw;
      return { label: isAr ? f.ar : f.en, value: String(value) };
    })
    .filter(Boolean);

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-zeus-gold/15 border border-zeus-gold/30 flex items-center justify-center mb-3">
          <Brain className="text-zeus-gold" style={{ width: 26, height: 26 }} />
        </div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl">{isAr ? "فهمتك كده ✓" : "Got you ✓"}</h2>
        <p className="text-muted-foreground mt-2 text-sm">
          {isAr ? "ده اللي استنتجته من كلامنا — أكّدلي بس على ٣ حاجات." : "Here's what I inferred — just confirm 3 things."}
        </p>
      </div>

      {chips.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="flex flex-wrap gap-2 justify-center mb-6">
          {chips.map((c, i) => (
            <motion.span key={c.label} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.06 }}
              className="px-3 py-1.5 rounded-full bg-secondary/40 border border-border/60 text-xs">
              <span className="text-muted-foreground">{c.label}:</span> <span className="font-medium">{c.value}</span>
            </motion.span>
          ))}
        </motion.div>
      )}

      <div className="space-y-4">
        <div className="zeus-glass p-4">
          <label className="text-xs font-semibold text-zeus-brightgold flex items-center gap-1.5 mb-2">
            <Target style={{ width: 13, height: 13 }} /> {isAr ? "هدفك" : "Your goal"}
          </label>
          <input value={goal} onChange={(e) => setGoal(e.target.value)}
            placeholder={isAr ? "إيه اللي عايز توصله؟" : "What do you want to reach?"}
            className="w-full bg-transparent border border-border/60 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:zeus-gold-border" />
        </div>

        <div className="zeus-glass p-4">
          <label className="text-xs font-semibold text-zeus-brightgold flex items-center gap-1.5 mb-2">
            <Gauge style={{ width: 13, height: 13 }} /> {isAr ? "مستواك الحالي" : "Current level"}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l) => (
              <button key={l.v} onClick={() => setLevel(l.v)}
                className={`py-2.5 rounded-xl text-sm font-medium transition ${level === l.v ? "bg-zeus-gold text-zeus-midnight shadow-gold-sm" : "bg-secondary/30 border border-border/60 hover:border-zeus-gold/40"}`}>
                {isAr ? l.ar : l.en}
              </button>
            ))}
          </div>
        </div>

        <div className="zeus-glass p-4">
          <label className="text-xs font-semibold text-zeus-brightgold flex items-center gap-1.5 mb-2">
            <Clock style={{ width: 13, height: 13 }} /> {isAr ? "وقتك في الأسبوع" : "Weekly time"}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {HOURS.map((h) => (
              <button key={h} onClick={() => setHours(h)}
                className={`py-2.5 rounded-xl text-sm font-medium transition ${hours === h ? "bg-zeus-gold text-zeus-midnight shadow-gold-sm" : "bg-secondary/30 border border-border/60 hover:border-zeus-gold/40"}`}>
                {h}{h === 15 ? "+" : ""} {isAr ? "س" : "h"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <button onClick={() => onConfirm({ goal: goal.trim(), current_level: level, weekly_hours: hours })}
          disabled={!goal.trim()}
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold disabled:opacity-50">
          <Check style={{ width: 18, height: 18 }} /> {isAr ? "تمام، كمّل" : "Confirm & continue"} <Arrow style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );
}