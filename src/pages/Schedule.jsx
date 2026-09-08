import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Loader2, Lock, CheckCircle2, Play, Sparkles, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";

const DAYS = {
  monday: { ar: "الاثنين", en: "Monday" },
  tuesday: { ar: "الثلاثاء", en: "Tuesday" },
  wednesday: { ar: "الأربعاء", en: "Wednesday" },
  thursday: { ar: "الخميس", en: "Thursday" },
  friday: { ar: "الجمعة", en: "Friday" },
  saturday: { ar: "السبت", en: "Saturday" },
  sunday: { ar: "الأحد", en: "Sunday" }
};

export default function Schedule() {
  const { lang, dir } = useI18n();
  const isAr = lang === "ar";
  const nav = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [roadmapId, setRoadmapId] = useState(null);

  const load = async () => {
    const r = await base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1);
    if (!r.length) { setLoading(false); return; }
    setRoadmapId(r[0].id);
    const l = await base44.entities.Lesson.filter({ roadmap_id: r[0].id }, "order", 500);
    setLessons(l);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const generate = async () => {
    setGenerating(true);
    try {
      const p = await base44.entities.LearningProfile.filter({}, "-created_date", 1);
      const res = await base44.functions.invoke("generateSchedule", {
        roadmapId, availableDays: p[0]?.available_days || [], lang
      });
      setLessons(res.data?.lessons || res.lessons || []);
    } catch (e) {}
    setGenerating(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  const completed = lessons.filter(l => l.status === "completed").length;
  const total = lessons.length;
  const progress = total ? Math.round((completed / total) * 100) : 0;
  const weeks = [...new Set(lessons.map(l => l.week))].sort((a, b) => a - b);

  return (
    <div dir={dir} className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl flex items-center gap-2">
          <Calendar className="text-zeus-gold" style={{ width: 26, height: 26 }} /> {isAr ? "جدولك الدراسي" : "Your Study Schedule"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{isAr ? "الدروس موزّعة على أيامك المتاحة" : "Lessons distributed across your available days"}</p>
      </motion.div>

      {!roadmapId ? (
        <div className="zeus-glass p-10 text-center">
          <p className="text-muted-foreground text-sm">{isAr ? "مفيش خطة تعلم لسه. ابدأ من الـ Onboarding." : "No learning plan yet. Start from onboarding."}</p>
        </div>
      ) : !lessons.length ? (
        <div className="zeus-glass p-10 text-center">
          <Sparkles className="text-zeus-gold mx-auto mb-3" style={{ width: 32, height: 32 }} />
          <p className="text-muted-foreground mb-4 text-sm">{isAr ? "مفيش جدول لسه. خلّيني أوزّع دروسك على أيامك." : "No schedule yet. Let me distribute your lessons across your days."}</p>
          <button onClick={generate} disabled={generating} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold disabled:opacity-50 text-sm">
            {generating ? <Loader2 className="animate-spin" style={{ width: 18, height: 18 }} /> : <Plus style={{ width: 18, height: 18 }} />}
            {isAr ? "ابني الجدول" : "Build Schedule"}
          </button>
        </div>
      ) : (
        <>
          <div className="zeus-glass p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{isAr ? "تقدّمك" : "Your progress"}</span>
              <span className="text-sm font-bold text-zeus-brightgold">{completed}/{total}</span>
            </div>
            <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} className="h-full bg-gradient-to-r from-zeus-gold to-zeus-brightgold" />
            </div>
          </div>

          {weeks.map((week, wi) => (
            <motion.div key={week} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * 0.1 }}>
              <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2.5">{isAr ? `الأسبوع ${week}` : `Week ${week}`}</h2>
              <div className="space-y-2">
                {lessons.filter(l => l.week === week).map((lesson) => {
                  const day = DAYS[lesson.day] || { ar: lesson.day, en: lesson.day };
                  const isAvailable = lesson.status === "available";
                  const isCompleted = lesson.status === "completed";
                  const isLocked = lesson.status === "locked";
                  return (
                    <button key={lesson.id} onClick={() => (isAvailable || isCompleted) && nav(`/lesson/${lesson.id}`)}
                      disabled={isLocked}
                      className={`w-full text-start zeus-glass p-4 flex items-center gap-3 transition ${isAvailable ? "zeus-gold-border cursor-pointer" : isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-zeus-gold/30"}`}>
                      <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted ? "bg-zeus-gold text-zeus-midnight" : isAvailable ? "bg-zeus-gold/15 text-zeus-brightgold" : "bg-secondary/40 text-muted-foreground"}`}>
                        {isCompleted ? <CheckCircle2 style={{ width: 18, height: 18 }} /> : isLocked ? <Lock style={{ width: 16, height: 16 }} /> : <Play style={{ width: 16, height: 16 }} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{lesson.node_title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{isAr ? day.ar : day.en} · {isAr ? `المرحلة ${lesson.phase}` : `Phase ${lesson.phase}`}</div>
                      </div>
                      {isAvailable && <span className="text-[10px] px-2 py-1 rounded-full bg-zeus-gold/15 text-zeus-brightgold font-medium">{isAr ? "ابدأ" : "Start"}</span>}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </>
      )}
    </div>
  );
}