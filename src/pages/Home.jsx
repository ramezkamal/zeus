import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Target, Clock, TrendingUp, Users, MessageSquare, Sparkles, Flame } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/ProfileContext";

export default function Home() {
  const { t, lang, dir } = useI18n();
  const { profile } = useProfile();
  const isAr = lang === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const [roadmap, setRoadmap] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    (async () => {
      const r = await base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1);
      if (r.length) setRoadmap(r[0]);
      const tk = await base44.entities.Task.filter({}, "order", 50);
      setTasks(tk);
      const n = await base44.entities.Notification.filter({}, "-created_date", 1);
      setNotifications(n);
    })();
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return t("dash.greeting.morning");
    return t("dash.greeting.evening");
  })();

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((x) => x.status === "done").length;
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const todayTask = tasks.find((x) => x.status !== "done");
  const nodes = roadmap?.nodes || [];
  const nextNode = nodes.find((n) => n.status !== "completed");
  const streak = computeStreak(tasks);

  return (
    <div className="space-y-6" dir={dir}>
      {/* Greeting hero */}
      <div className="relative overflow-hidden rounded-3xl zeus-glass p-6 lg:p-8">
        <div className="absolute inset-0 zeus-grid-bg opacity-20" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="text-muted-foreground text-sm">{greeting} 👋</div>
            <h1 className="font-heading font-extrabold text-3xl lg:text-4xl mt-1">
              {(profile?.companion_name) ? `${profile.companion_name} ${isAr ? "معاك" : "is with you"}` : ""}
            </h1>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zeus-gold/10 border border-zeus-gold/30 text-zeus-brightgold text-sm">
              <Target style={{ width: 14, height: 14 }} /> {t("dash.current_goal")}: {profile?.goal || "—"}
            </div>
          </div>
          <Link to="/learn" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold shrink-0">
            {t("common.continue")} <Arrow style={{ width: 18, height: 18 }} />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Today's focus */}
        <div className="lg:col-span-2 zeus-glass p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-lg flex items-center gap-2"><Sparkles className="text-zeus-gold" style={{ width: 18, height: 18 }} /> {t("dash.today_focus")}</h2>
            {todayTask && <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock style={{ width: 12, height: 12 }} /> {todayTask.estimated_minutes || 45} {isAr ? "دقيقة" : "min"}</span>}
          </div>
          {todayTask ? (
            <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60">
              <div className="text-xs text-zeus-gold mb-1">{todayTask.node_title}</div>
              <div className="font-medium text-lg">{todayTask.title}</div>
              <div className="mt-3 flex items-center gap-2">
                <Link to="/learn" className="px-4 py-2 rounded-full bg-zeus-gold text-zeus-midnight text-sm font-medium hover:bg-zeus-brightgold transition">{isAr ? "ابدأ دلوقتي" : "Start now"}</Link>
                <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/50 text-muted-foreground">{todayTask.difficulty}</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">{isAr ? "خلّصت كل مهام النهارده! 🎉" : "You finished today's tasks! 🎉"}</div>
          )}

          {/* Progress + next milestone */}
          <div className="grid sm:grid-cols-2 gap-4 mt-5">
            <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60">
              <div className="text-xs text-muted-foreground mb-1">{t("dash.progress")}</div>
              <div className="flex items-end gap-2">
                <span className="font-heading font-extrabold text-3xl zeus-gold-text">{progress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary/60 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-zeus-gold to-zeus-brightgold" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-secondary/20 border border-border/60">
              <div className="text-xs text-muted-foreground mb-1">{t("dash.next_milestone")}</div>
              <div className="font-medium">{nextNode?.title || "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">{nextNode ? `${nextNode.estimated_hours || 0} ${isAr ? "ساعة" : "hrs"}` : ""}</div>
            </div>
          </div>
        </div>

        {/* AI companion + streak */}
        <div className="space-y-5">
          <div className="zeus-glass p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zeus-gold to-zeus-brightgold text-zeus-midnight flex items-center justify-center font-bold text-sm">{(profile?.companion_name || "Z").charAt(0)}</div>
              <div className="font-heading font-bold">{profile?.companion_name || "ZEUS"}</div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {todayTask
                ? (isAr ? `"ممتاز! خلّصت ${doneTasks} مهام. كمان مهمة وتفتح المحطة الجاية 🔥"` : `"Great! You finished ${doneTasks} tasks. One more and you unlock the next milestone 🔥"`)
                : (isAr ? `"أحسنتم النهارده! استريح شوية ونجمّل بكره 💛"` : `"Great work today! Rest a bit and we'll plan tomorrow 💛"`)}
            </p>
            <Link to="/companion" className="mt-3 inline-flex items-center gap-1.5 text-sm text-zeus-brightgold hover:underline">
              <MessageSquare style={{ width: 14, height: 14 }} /> {isAr ? "كلم رفيقك" : "Talk to your companion"}
            </Link>
          </div>
          <div className="zeus-glass p-5">
            <div className="flex items-center gap-2 mb-1"><Flame className="text-zeus-gold" style={{ width: 18, height: 18 }} /><span className="font-heading font-bold">{isAr ? "سلسلتك" : "Your streak"}</span></div>
            <div className="font-heading font-extrabold text-3xl zeus-gold-text">{streak} <span className="text-base text-muted-foreground">{isAr ? "يوم" : "days"}</span></div>
          </div>
        </div>
      </div>

      {/* Community */}
      <div className="zeus-glass p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-zeus-gold/15 flex items-center justify-center"><Users className="text-zeus-gold" style={{ width: 22, height: 22 }} /></div>
          <div>
            <div className="font-heading font-bold">{t("dash.community.pitch")}</div>
            <div className="text-xs text-muted-foreground">{isAr ? "لاقي متعلّمين على نفس مسارك" : "Find learners on your path"}</div>
          </div>
        </div>
        <Link to="/community" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zeus-gold/40 text-zeus-brightgold hover:bg-zeus-gold/10 transition text-sm font-medium">
          {t("dash.join")} <Arrow style={{ width: 16, height: 16 }} />
        </Link>
      </div>
    </div>
  );
}

function computeStreak(tasks) {
  const done = tasks.filter((x) => x.status === "done" && x.completed_date);
  if (!done.length) return 0;
  const days = new Set(done.map((x) => x.completed_date.slice(0, 10)));
  let streak = 0;
  let d = new Date();
  while (days.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}