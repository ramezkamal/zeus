import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Target, Flame, Users, MessageSquare, Sparkles, Compass, Workflow, TrendingUp, Briefcase, FolderKanban } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/ProfileContext";
import HeroCard from "@/components/zeus/dashboard/HeroCard";
import StatStrip from "@/components/zeus/dashboard/StatStrip";
import ModuleGrid from "@/components/zeus/dashboard/ModuleGrid";
import SkillsCard from "@/components/zeus/dashboard/SkillsCard";

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
      const [r, tk, c] = await Promise.all([
        base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1),
        base44.entities.Task.filter({}, "order", 100),
        base44.entities.Conversation.filter({ type: "companion" }, "-created_date", 1)
      ]);
      if (r.length) setRoadmap(r[0]);
      setTasks(tk);
      if (c.length) setCompanion(c[0]);
    })();
  }, []);

  const greeting = new Date().getHours() < 12 ? t("dash.greeting.morning") : t("dash.greeting.evening");
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((x) => x.status === "done").length;
  const progress = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const todayTask = tasks.find((x) => x.status !== "done");
  const nodes = roadmap?.nodes || [];
  const skills = (profile?.skill_graph || []).slice().sort((a, b) => b.level - a.level);
  const lastMsg = companion?.messages?.slice(-1)[0];
  const streak = computeStreak(tasks);

  const modules = [
    { to: "/roadmap", icon: Workflow, title: isAr ? "شبكة المسار" : "Path Flow", desc: isAr ? `${nodes.length} محطة متفرّعة` : `${nodes.length} branching nodes` },
    { to: "/projects", icon: FolderKanban, title: isAr ? "مشاريعي" : "Projects", desc: isAr ? "طبّق اللي تعلمته" : "Apply what you learned" },
    { to: "/community", icon: Users, title: isAr ? "مجتمعي" : "Community", desc: isAr ? "متعلّمين على نفس مسارك" : "Learners on your path" },
    { to: "/discover", icon: Compass, title: isAr ? "اكتشف مجالات" : "Discover", desc: isAr ? "مسارات جديدة تتعلمها" : "New paths to learn" },
    { to: "/career", icon: Briefcase, title: isAr ? "مسارك المهني" : "Career", desc: isAr ? "سيرة ذاتية وفرص شغل" : "CV and opportunities" },
    { to: "/progress", icon: TrendingUp, title: isAr ? "تقدّمي" : "Progress", desc: isAr ? "أرقامك بالتفصيل" : "Your numbers in detail" }
  ];

  return (
    <div className="space-y-6 pb-4" dir={dir}>
      <HeroCard
        greeting={greeting}
        name={profile?.companion_name ? `${profile.companion_name}` : "ZEUS"}
        goal={profile?.goal}
        todayTask={todayTask}
        progress={progress}
        isAr={isAr}
        Arrow={Arrow}
      />

      <StatStrip stats={[
        { icon: Flame, value: streak, label: isAr ? "يوم متتالي" : "day streak" },
        { icon: Target, value: `${doneTasks}/${totalTasks}`, label: isAr ? "مهام" : "tasks" },
        { icon: Workflow, value: nodes.length, label: isAr ? "محطة" : "nodes" }
      ]} />

      <Section title={isAr ? "مدرّبك" : "Your Coach"} icon={MessageSquare} delay={0.15}>
        <Link to="/companion"
          className="flex items-center gap-3 p-4 rounded-2xl border border-border/60 bg-card/55 backdrop-blur-xl hover:border-zeus-gold/50 transition group">
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-zeus-gold to-zeus-brightgold text-white flex items-center justify-center font-bold">
              {(profile?.companion_name || "Z").charAt(0)}
            </div>
            <span className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-card animate-pulse-soft" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading font-bold text-sm">{profile?.companion_name || "ZEUS"}</div>
            <div className="text-[11px] text-muted-foreground line-clamp-1">
              {lastMsg ? lastMsg.content : (isAr ? "ابدأ محادثة مع مدرّبك" : "Start a chat with your coach")}
            </div>
          </div>
          <Arrow className="text-muted-foreground shrink-0 group-hover:text-zeus-gold transition" style={{ width: 16, height: 16 }} />
        </Link>
      </Section>

      <Section title={isAr ? "مهاراتي" : "My Skills"} icon={Sparkles} delay={0.2}>
        <SkillsCard skills={skills} isAr={isAr} />
      </Section>

      <Section title={isAr ? "أقسام التطبيق" : "Your Workspace"} icon={Compass} delay={0.25}>
        <ModuleGrid modules={modules} Arrow={Arrow} />
      </Section>
    </div>
  );
}

function Section({ title, icon: Icon, delay, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay }}>
      <h2 className="font-heading font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2 mb-3">
        <Icon className="text-zeus-gold" style={{ width: 15, height: 15 }} /> {title}
      </h2>
      {children}
    </motion.div>
  );
}

function computeStreak(tasks) {
  const done = tasks.filter((x) => x.status === "done" && x.completed_date);
  if (!done.length) return 0;
  const days = new Set(done.map((x) => x.completed_date.slice(0, 10)));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}