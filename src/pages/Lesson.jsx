import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Play, BookOpen, Loader2, Lock, Bot, Brain, AlertCircle, Wrench } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import VideoPlayer from "@/components/zeus/lesson/VideoPlayer";
import ReadingView from "@/components/zeus/lesson/ReadingView";
import QuizPanel from "@/components/zeus/lesson/QuizPanel";
import TutorSheet from "@/components/zeus/lesson/TutorSheet";

export default function Lesson() {
  const { lessonId } = useParams();
  const { t, lang, dir } = useI18n();
  const isAr = lang === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const nav = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [preparing, setPreparing] = useState(false);
  const [prepareError, setPrepareError] = useState(false);
  const [mode, setMode] = useState("video");
  const [quizState, setQuizState] = useState("idle");
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [nextLessonId, setNextLessonId] = useState(null);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [tutorMessages, setTutorMessages] = useState([]);
  const [tutorTyping, setTutorTyping] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setQuizState("idle"); setAnswers({}); setResult(null); setNextLessonId(null); setTutorMessages([]);
      try {
        const l = await base44.entities.Lesson.get(lessonId);
        setLesson(l);
        if (l?.quiz_passed) { setQuizState("submitted"); setResult({ score: l.quiz_score, passed: true }); }
        if (l && !l.content_ready && l.status !== "locked") {
          setPreparing(true); setPrepareError(false);
          try {
            const res = await base44.functions.invoke("prepareLesson", { lessonId, lang });
            setLesson(res.data || res);
          } catch { setPrepareError(true); }
          setPreparing(false);
        }
      } catch {}
      setLoading(false);
    })();
  }, [lessonId, lang]);

  useEffect(() => {
    if (tutorOpen && tutorMessages.length === 0) {
      setTutorMessages([{ role: "assistant", content: isAr ? "أهلاً 👋 أنا مدرّبك الذكي لهذا الدرس. لو في أي حاجة مش فاهمها، اسألني على طول." : "Hey 👋 I'm your AI tutor for this lesson. If anything is unclear, just ask.", ts: new Date().toISOString() }]);
    }
  }, [tutorOpen]);

  const submitQuiz = async () => {
    const quiz = lesson?.quiz || [];
    let correct = 0;
    quiz.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const score = Math.round((correct / quiz.length) * 100);
    const passed = score >= 70;
    setResult({ score, passed, correct, total: quiz.length });
    setQuizState("submitted");
    if (passed && !lesson.quiz_passed) {
      try {
        await base44.entities.Lesson.update(lessonId, { status: "completed", quiz_passed: true, quiz_score: score, completed_date: new Date().toISOString().slice(0, 10) });
        await base44.entities.Notification.create({ type: "lesson", title: isAr ? "درس مكتمل! 🎉" : "Lesson Complete! 🎉", body: isAr ? `خلّصت "${lesson.node_title}" بنجاح. الدرس التالي فتح!` : `You completed "${lesson.node_title}". Next lesson unlocked!`, action_label: isAr ? "الدرس التالي" : "Next", action_url: "/schedule" });
        const all = await base44.entities.Lesson.filter({ roadmap_id: lesson.roadmap_id }, "order", 500);
        const next = all.find(l => l.order > lesson.order && l.status === "locked");
        if (next) { await base44.entities.Lesson.update(next.id, { status: "available" }); setNextLessonId(next.id); }
      } catch {}
    }
  };

  const retryQuiz = () => { setQuizState("taking"); setAnswers({}); setResult(null); };

  const sendTutor = async (text) => {
    const userMsg = { role: "user", content: text, ts: new Date().toISOString() };
    const next = [...tutorMessages, userMsg];
    setTutorMessages(next);
    setTutorTyping(true);
    try {
      const res = await base44.functions.invoke("lessonTutor", { lessonId, messages: next.map(m => ({ role: m.role, content: m.content })), lang });
      const data = res.data || res;
      setTutorMessages([...next, { role: "assistant", content: data.reply, ts: new Date().toISOString() }]);
    } catch {
      setTutorMessages([...next, { role: "assistant", content: isAr ? "حصل خطأ، جرّب تاني" : "An error occurred, try again", ts: new Date().toISOString() }]);
    }
    setTutorTyping(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  if (!lesson) return (
    <div className="zeus-glass p-10 text-center">
      <p className="text-muted-foreground text-sm">{isAr ? "الدرس مش موجود" : "Lesson not found"}</p>
      <button onClick={() => nav("/schedule")} className="mt-4 text-zeus-brightgold text-sm">{isAr ? "ارجع للجدول" : "Back to schedule"}</button>
    </div>
  );

  if (lesson.status === "locked") return (
    <div className="zeus-glass p-10 text-center">
      <Lock className="text-muted-foreground mx-auto mb-3" style={{ width: 32, height: 32 }} />
      <p className="text-muted-foreground mb-4 text-sm">{isAr ? "الدرس ده لسه مقفول. خلّص الدرس اللي قبله الأول." : "This lesson is locked. Complete the previous one first."}</p>
      <button onClick={() => nav("/schedule")} className="text-zeus-brightgold text-sm">{isAr ? "ارجع للجدول" : "Back to schedule"}</button>
    </div>
  );

  return (
    <div dir={dir} className="space-y-5 pb-20">
      <div className="flex items-center gap-3">
        <button onClick={() => nav("/schedule")} className="shrink-0 w-9 h-9 rounded-full bg-secondary/40 flex items-center justify-center hover:bg-secondary/60 transition">
          {isAr ? <ArrowRight style={{ width: 18, height: 18 }} /> : <ArrowLeft style={{ width: 18, height: 18 }} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-zeus-brightgold font-semibold">{isAr ? `المرحلة ${lesson.phase}` : `Phase ${lesson.phase}`}</div>
          <h1 className="font-heading font-extrabold text-xl sm:text-2xl truncate">{lesson.node_title}</h1>
        </div>
      </div>

      {preparing ? (
        <div className="zeus-glass p-10 text-center">
          <Loader2 className="text-zeus-gold animate-spin mx-auto mb-4" style={{ width: 32, height: 32 }} />
          <p className="text-muted-foreground text-sm">{isAr ? "بجهّز محتوى الدرس ده..." : "Preparing this lesson's content..."}</p>
        </div>
      ) : prepareError ? (
        <div className="zeus-glass p-8 text-center">
          <AlertCircle className="text-muted-foreground mx-auto mb-3" style={{ width: 28, height: 28 }} />
          <p className="text-muted-foreground mb-4 text-sm">{isAr ? "مقدرتش أجهّز المحتوى. حاول تاني." : "Couldn't prepare content. Try again."}</p>
          <button onClick={async () => { setPrepareError(false); setPreparing(true); try { const res = await base44.functions.invoke("prepareLesson", { lessonId, lang }); setLesson(res.data || res); } catch { setPrepareError(true); } setPreparing(false); }} className="px-5 py-2.5 rounded-full bg-zeus-gold text-zeus-midnight font-medium text-sm">{isAr ? "حاول تاني" : "Retry"}</button>
        </div>
      ) : (
        <>
          {lesson.summary && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="zeus-glass p-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zeus-brightgold mb-2">
                <Brain style={{ width: 13, height: 13 }} /> {isAr ? "ملخص الدرس" : "Lesson Summary"}
              </div>
              <p className="text-sm text-foreground/85 leading-relaxed">{lesson.summary}</p>
            </motion.div>
          )}

          <div className="inline-flex p-1 rounded-full bg-card/70 border border-border/60">
            <button onClick={() => setMode("video")} className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${mode === "video" ? "bg-zeus-gold text-zeus-midnight shadow-gold-sm" : "text-muted-foreground"}`}>
              <Play style={{ width: 13, height: 13 }} /> {isAr ? "فيديو" : "Video"}
            </button>
            <button onClick={() => setMode("reading")} className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${mode === "reading" ? "bg-zeus-gold text-zeus-midnight shadow-gold-sm" : "text-muted-foreground"}`}>
              <BookOpen style={{ width: 13, height: 13 }} /> {isAr ? "قراءة" : "Reading"}
            </button>
          </div>

          <motion.div key={mode} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {mode === "video" ? (
              lesson.video_url ? <VideoPlayer url={lesson.video_url} title={lesson.video_title} /> : (
                <div className="zeus-glass p-8 text-center"><p className="text-muted-foreground text-sm">{isAr ? "الفيديو لسه بيتجهّز..." : "Video is being prepared..."}</p></div>
              )
            ) : (
              <div className="zeus-glass p-5">
                {lesson.reading_content ? <ReadingView content={lesson.reading_content} /> : <p className="text-muted-foreground text-sm">{isAr ? "المحتوى المكتوب لسه بيتجهّز..." : "Reading content is being prepared..."}</p>}
              </div>
            )}
          </motion.div>

          <QuizPanel quiz={lesson.quiz || []} state={quizState} answers={answers} setAnswers={setAnswers} result={result}
            onStart={() => setQuizState("taking")} onSubmit={submitQuiz} onRetry={retryQuiz}
            onNext={() => nextLessonId ? nav(`/lesson/${nextLessonId}`) : nav("/schedule")} hasNext={!!nextLessonId} isAr={isAr} />

          {lesson.task && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="zeus-glass p-5">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zeus-brightgold mb-3">
                <Wrench style={{ width: 13, height: 13 }} /> {isAr ? "مهمة عملية" : "Hands-on Task"}
              </div>
              <h3 className="font-heading font-bold text-lg mb-2">{lesson.task.title}</h3>
              <p className="text-sm text-foreground/85 leading-relaxed mb-3">{lesson.task.description}</p>
              {lesson.task.steps?.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-xs font-bold text-zeus-brightgold mb-1.5">{isAr ? "الخطوات" : "Steps"}</h4>
                  <ol className="list-decimal ps-4 text-sm text-muted-foreground space-y-1">
                    {lesson.task.steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              )}
              {lesson.task.deliverables && (
                <div className="mb-3 p-3 rounded-xl bg-secondary/30 border border-border/60">
                  <h4 className="text-xs font-bold text-zeus-brightgold mb-1">{isAr ? "المطلوب تسليمه" : "Deliverables"}</h4>
                  <p className="text-sm text-muted-foreground">{lesson.task.deliverables}</p>
                </div>
              )}
              {lesson.task.completion_criteria && (
                <div className="mb-3 p-3 rounded-xl bg-secondary/30 border border-border/60">
                  <h4 className="text-xs font-bold text-zeus-brightgold mb-1">{isAr ? "معايير الإتمام" : "Completion Criteria"}</h4>
                  <p className="text-sm text-muted-foreground">{lesson.task.completion_criteria}</p>
                </div>
              )}
              {lesson.task.applied_skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {lesson.task.applied_skills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-full bg-zeus-gold/10 text-zeus-brightgold text-xs">{s}</span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </>
      )}

      {!preparing && !prepareError && (
        <button onClick={() => setTutorOpen(true)} className="fixed bottom-24 end-4 z-30 w-14 h-14 rounded-full bg-zeus-gold text-zeus-midnight shadow-gold flex items-center justify-center hover:bg-zeus-brightgold transition">
          <Bot style={{ width: 24, height: 24 }} />
        </button>
      )}

      <TutorSheet open={tutorOpen} onClose={() => setTutorOpen(false)} messages={tutorMessages} onSend={sendTutor} typing={tutorTyping} isAr={isAr} t={t} lang={lang} />
    </div>
  );
}