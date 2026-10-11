import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import ReadinessReport from "./ReadinessReport";

export default function ProjectAssessment({ lesson, isAr, lang, onAdvance }) {
  const [assessment, setAssessment] = useState(lesson.assessment || null);
  const [text, setText] = useState(lesson.assessment?.submission || "");
  const [link, setLink] = useState(lesson.assessment?.link || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setBusy(true); setError("");
    try {
      const res = await base44.functions.invoke("assessProject", { lessonId: lesson.id, submission: text, link, lang });
      setAssessment(res.data.assessment);
      if (res.data.nextLessonId) onAdvance?.(res.data.nextLessonId);
    } catch (e) {
      setError(e?.response?.data?.error || (isAr ? "حصل خطأ، جرّب تاني" : "Something went wrong, try again"));
    }
    setBusy(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="zeus-glass p-5 space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zeus-brightgold">
        <ShieldCheck style={{ width: 14, height: 14 }} /> {isAr ? "التقييم النهائي للمرحلة" : "Final Stage Assessment"}
      </div>
      {assessment && <ReadinessReport a={assessment} isAr={isAr} />}
      <div className="space-y-3">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={5}
          placeholder={isAr ? "اشرح عملت إيه، إزاي نفّذت المتطلبات، والتحديات اللي قابلتك..." : "Describe what you built, how you met each requirement, and challenges you faced..."}
          className="w-full px-4 py-3 rounded-xl bg-background/40 border border-border/60 focus:border-zeus-gold/60 outline-none text-sm resize-none transition" />
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder={isAr ? "لينك المشروع (GitHub / Demo) - اختياري" : "Project link (GitHub / demo) - optional"}
          className="w-full px-4 py-3 rounded-xl bg-background/40 border border-border/60 focus:border-zeus-gold/60 outline-none text-sm transition" />
        {error && <p className="text-xs text-destructive">{error}</p>}
        <button onClick={submit} disabled={busy || text.trim().length < 30}
          className="w-full py-3 rounded-xl bg-zeus-gold text-zeus-midnight font-semibold text-sm shadow-gold-sm hover:bg-zeus-brightgold active:scale-[0.99] transition disabled:opacity-50 inline-flex items-center justify-center gap-2">
          {busy ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Send style={{ width: 16, height: 16 }} />}
          {busy ? (isAr ? "بقيّم مشروعك..." : "Assessing your project...") : assessment ? (isAr ? "إعادة التقييم" : "Re-assess") : (isAr ? "سلّم للتقييم" : "Submit for assessment")}
        </button>
      </div>
    </motion.div>
  );
}