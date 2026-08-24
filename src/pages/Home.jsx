import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Target, Flame, Users, MessageSquare, Sparkles, Compass, Brain, Map, Clock, TrendingUp } from "lucide-react";
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
  const [companion, setCompanion] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1);
      if (r.length) setRoadmap(r[0]);
      const tk = await base44.entities.Task.filter({}, "order", 100);
      setTasks(tk);
      const c = await base44.entities.Conversation.filter({ type: "companion" }, "-created_date", 1);
      if (c.length) setCompanion(c[0]);
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
  const phases = [...new Set(nodes.map((n) => n.phase))].length;
  const streak = computeStreak(tasks);
  const skills = (profile?.skill_graph || []).slice().sort((a, b) => b.level - a.level);
  const lastMsg = companion?.messages?.slice(-1)[0];

  return (
    <div className="space-y-5" dir={dir}>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl zeus-glass p-6">
        <div className="absolute inset-0 zeus-grid-bg opacity-20" />
        <div className="relative">
          <div className="text-muted-foreground text-sm">{greeting} 👋</div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl mt-1">
            {profile?.companion_name ? `${profile.companion_name} ${isAr ? "معاك" : "with you"}` : "ZEUS"}
          </h1>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zeus-gold/10 border border-zeus-gold/30 text-zeus-brightgold text-sm max-w-full">
            <Target style={{ width: 14, height: 14 }} className="shrink-0" /> <span className="truncate">{profile?.goal || "—"}</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link to="/learn" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold text-sm">
              {todayTask ? (isAr ? "كمّل تعلّمك" : "Continue learning") : (isAr ? "ابدأ" : "Start")} <Arrow style={{ width: 16, height: 16 }} />
            </Link>
            {todayTask && <span className="text-xs text-muted-foreground flex items-center gap-1 truncate"><Clock style={{ width: 12, height: 12 }} /> {todayTask.title}</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Stat icon={Flame} value={streak} label={isAr ? "يوم متتالي" : "day streak"} />
        <Stat icon={TrendingUp} value={`${progress}%`} label={isAr ? "تقدّمك" : "progress"} />
        <Stat icon={Target} value={`${doneTasks}/${totalTasks}`} label={isAr ? "مهام" : "tasks"} />
      </div>

      {/* My Goals */}
      <Section title={isAr ? "أهدافي" : "My Goals"} icon={Target}>
        {roadmap ? (
          <Link to="/companion" className="block zeus-glass p-5 hover:zeus-gold-border transition group">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-heading font-bold text-lg truncate">{roadmap.goal}</div>
                <div className="text-xs text-muted-foreground mt-1">{isAr ? `${phases} مراحل · ${nodes.length} محطة` : `${phases} phases · ${nodes.length} nodes`}</div>
              </div>
              <div className="shrink-0 text-end">
                <div className="text-2xl font-heading font-extrabold zeus-gold-text">{progress}%</div>
              </div>
            </div>
            <div className="mt-3 h-2 rounded-full bg-secondary/60 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-zeus-gold to-zeus-brightgold" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-zeus-brightgold font-medium"><MessageSquare style={{ width: 13, height: 13 }} /> {isAr ? "كمل المحادثة" : "Resume chat"}</span>
              <Link to="/roadmap" onClick={(e) => e.stopPropagation()} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"><Map style={{ width: 13, height: 13 }} /> {isAr ? "الخريطة" : "Roadmap"}</Link>
            </div>
          </Link>
        ) : (
          <EmptyCard text={isAr ? "مفيش هدف لسه" : "No goal yet"} cta={isAr ? "اكتشف مجال" : "Discover a field"} to="/discover" />
        )}
      </Section>

      {/* My Coach */}
      <Section title={isAr ? "مدربك" : "Your Coach"} icon={Brain}>
        <Link to="/companion" className="block zeus-glass p-5 hover:zeus-gold-border transition">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zeus-gold to-zeus-brightgold text-zeus-midnight flex items-center justify-center font-bold text-lg shrink-0">{(profile?.companion_name || "Z").charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <div className="font-heading font-bold">{profile?.companion_name || "ZEUS"}</div>
              <div className="text-xs text-muted-foreground truncate">{lastMsg ? lastMsg.content : (isAr ? "ابدأ محادثة مع مدربك" : "Start a chat with your coach")}</div>
            </div>
            <Arrow className="text-muted-foreground shrink-0" style={{ width: 18, height: 18 }} />
          </div>
        </Link>
      </Section>

      {/* My Skills */}
      <Section title={isAr ? "مهاراتي" : "My Skills"} icon={Sparkles}>
        {skills.length ? (
          <div className="zeus-glass p-5 space-y-3">
            {skills.slice(0, 6).map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-sm mb-1"><span>{s.skill}</span><span className="text-zeus-gold font-medium">{s.level}%</span></div>
                <div className="h-2 rounded-full bg-secondary/60 overflow-hidden"><div className="h-full bg-gradient-to-r from-zeus-gold to-zeus-brightgold" style={{ width: `${s.level}%` }} /></div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyCard text={isAr ? "مفيش مهارات لسه" : "No skills yet"} cta={isAr ? "ابدأ تعلّم" : "Start learning"} to="/learn" />
        )}
      </Section>

      {/* Community + Discover */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/community" className="zeus-glass p-5 hover:zeus-gold-border transition flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-zeus-gold/15 flex items-center justify-center shrink-0"><Users className="text-zeus-gold" style={{ width: 22, height: 22 }} /></div>
          <div className="flex-1 min-w-0"><div className="font-heading font-bold">{isAr ? "مجتمعي" : "Community"}</div><div className="text-xs text-muted-foreground">{isAr ? "متعلّمين على نفس مسارك" : "Learners on your path"}</div></div>
          <Arrow className="text-muted-foreground shrink-0" style={{ width: 18, height: 18 }} />
        </Link>
        <Link to="/discover" className="zeus-glass p-5 hover:zeus-gold-border transition flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-zeus-gold/15 flex items-center justify-center shrink-0"><Compass className="text-zeus-gold" style={{ width: 22, height: 22 }} /></div>
          <div className="flex-1 min-w-0"><div className="font-heading font-bold">{isAr ? "اكتشف مجالات" : "Discover"}</div><div className="text-xs text-muted-foreground">{isAr ? "مسارات جديدة تتعلمها" : "New paths to learn"}</div></div>
          <Arrow className="text-muted-foreground shrink-0" style={{ width: 18, height: 18 }} />
        </Link>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div>
      <h2 className="font-heading font-bold text-lg flex items-center gap-2 mb-3"><Icon className="text-zeus-gold" style={{ width: 18, height: 18 }} /> {title}</h2>
      {children}
    </div>
  );
}

function Stat({ icon: Icon, value, label }) {
  return (
    <div className="zeus-glass p-3.5 text-center">
      <Icon className="text-zeus-gold mx-auto mb-1" style={{ width: 18, height: 18 }} />
      <div className="font-heading font-extrabold text-xl">{value}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}

function EmptyCard({ text, cta, to }) {
  return (
    <div className="zeus-glass p-5 text-center">
      <p className="text-sm text-muted-foreground mb-3">{text}</p>
      <Link to={to} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-zeus-gold/15 text-zeus-brightgold text-sm font-medium hover:bg-zeus-gold/25 transition">{cta}</Link>
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