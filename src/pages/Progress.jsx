import React, { useState, useEffect } from "react";
import { TrendingUp, Flame, Clock, Target, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/ProfileContext";

export default function Progress() {
  const { t, lang, dir } = useI18n();
  const { profile } = useProfile();
  const isAr = lang === "ar";
  const [tasks, setTasks] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tk = await base44.entities.Task.filter({}, "order", 200);
      setTasks(tk);
      const r = await base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1);
      if (r.length) setRoadmap(r[0]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  const total = tasks.length;
  const done = tasks.filter((x) => x.status === "done").length;
  const overall = total ? Math.round((done / total) * 100) : 0;
  const nodes = roadmap?.nodes || [];
  const completedNodes = nodes.filter((n) => n.status === "completed").length;
  const streak = computeStreak(tasks);
  const skillGraph = profile?.skill_graph || [];

  return (
    <div dir={dir} className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-3xl">{t("progress.title")}</h1>
        <p className="text-muted-foreground mt-1">{profile?.goal}</p>
      </div>

      {/* Overall ring */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="zeus-glass p-6 flex flex-col items-center justify-center">
          <Ring value={overall} />
          <div className="mt-3 text-sm text-muted-foreground">{isAr ? "إجمالي التقدّم" : "Overall Progress"}</div>
        </div>
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <Stat icon={Flame} label={isAr ? "السلسلة" : "Streak"} value={`${streak} ${isAr ? "يوم" : "days"}`} />
          <Stat icon={Target} label={isAr ? "محطات مكتملة" : "Milestones"} value={`${completedNodes}/${nodes.length}`} />
          <Stat icon={Clock} label={isAr ? "مهام مكتملة" : "Tasks done"} value={`${done}/${total}`} />
          <Stat icon={TrendingUp} label={isAr ? "ساعات/أسبوع" : "Hours/week"} value={`${profile?.weekly_hours || 0}`} />
        </div>
      </div>

      {/* Skill graph */}
      <div className="zeus-glass p-6">
        <h2 className="font-heading font-bold text-lg mb-4">{isAr ? "تطوّر مهاراتي" : "Skill Growth"}</h2>
        {skillGraph.length ? (
          <div className="space-y-3">
            {skillGraph.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between text-sm mb-1"><span className="font-medium">{s.skill}</span><span className="text-zeus-gold font-semibold">{s.level}%</span></div>
                <div className="h-2.5 rounded-full bg-secondary/60 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-zeus-gold to-zeus-brightgold rounded-full transition-all" style={{ width: `${s.level}%` }} />
                </div>
              </div>
            ))}
          </div>
        ) : <p className="text-muted-foreground text-sm">{isAr ? "قيّم مهاراتك في الإعدادات" : "Rate your skills in settings"}</p>}
      </div>

      {/* Phase progress */}
      {nodes.length > 0 && (
        <div className="zeus-glass p-6">
          <h2 className="font-heading font-bold text-lg mb-4">{isAr ? "تقدّم المراحل" : "Phase Progress"}</h2>
          <div className="space-y-3">
            {phasesList(nodes).map((p) => {
              const pn = nodes.filter((n) => n.phase === p.phase);
              const pdone = pn.filter((n) => n.status === "completed").length;
              const pct = pn.length ? Math.round((pdone / pn.length) * 100) : 0;
              return (
                <div key={p.phase}>
                  <div className="flex justify-between text-sm mb-1"><span>{isAr ? `المرحلة ${p.phase}` : `Phase ${p.phase}`}</span><span className="text-muted-foreground">{pct}%</span></div>
                  <div className="h-2 rounded-full bg-secondary/60 overflow-hidden"><div className="h-full bg-gradient-to-r from-zeus-gold to-zeus-brightgold" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Ring({ value }) {
  const r = 52, c = 2 * Math.PI * r;
  return (
    <svg width="140" height="140" className="-rotate-90">
      <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="10" />
      <circle cx="70" cy="70" r={r} fill="none" stroke="url(#g)" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} className="transition-all duration-700" />
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#F5B700" /><stop offset="100%" stopColor="#FFD84D" /></linearGradient></defs>
      <text x="70" y="70" textAnchor="middle" dominantBaseline="middle" className="rotate-90 fill-zeus-brightgold font-heading font-extrabold" style={{ fontSize: 28, transformOrigin: "center" }}>{value}%</text>
    </svg>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="zeus-glass p-5 flex items-center gap-3">
      <div className="w-11 h-11 rounded-xl bg-zeus-gold/15 flex items-center justify-center"><Icon className="text-zeus-gold" style={{ width: 22, height: 22 }} /></div>
      <div><div className="text-xs text-muted-foreground">{label}</div><div className="font-heading font-bold text-xl">{value}</div></div>
    </div>
  );
}

function phasesList(nodes) {
  const map = {}; nodes.forEach((n) => { map[n.phase] = true; });
  return Object.keys(map).map((p) => ({ phase: Number(p) })).sort((a, b) => a.phase - b.phase);
}
function computeStreak(tasks) {
  const done = tasks.filter((x) => x.status === "done" && x.completed_date);
  if (!done.length) return 0;
  const days = new Set(done.map((x) => x.completed_date.slice(0, 10)));
  let streak = 0; let d = new Date();
  while (days.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}