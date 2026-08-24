import React, { useState, useEffect } from "react";
import { Rocket, Loader2, Plus, CheckCircle2, Circle, Wrench } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/ProfileContext";

export default function Projects() {
  const { t, lang, dir } = useI18n();
  const { profile } = useProfile();
  const isAr = lang === "ar";
  const [roadmap, setRoadmap] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const r = await base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1);
    if (r.length) setRoadmap(r[0]);
    const p = await base44.entities.Project.filter({}, "-created_date", 50);
    setProjects(p);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const suggestions = (roadmap?.nodes || []).filter((n) => n.projects?.length).flatMap((n) => (n.projects || []).map((p, i) => ({ title: p, node: n, key: n.id + i })));

  const addProject = async (title, node) => {
    await base44.entities.Project.create({
      title, goal: profile?.goal, description: node.objective,
      requirements: node.skills || [], technologies: node.skills || [],
      milestones: node.tasks || [], difficulty: "beginner", status: "in_progress"
    });
    await base44.entities.Notification.create({ type: "project", title: isAr ? "مشروع جديد! 🚀" : "New project! 🚀", body: isAr ? `بدأت "${title}"` : `You started "${title}"` });
    load();
  };

  const cycle = async (p) => {
    const next = p.status === "suggested" ? "in_progress" : p.status === "in_progress" ? "completed" : "suggested";
    await base44.entities.Project.update(p.id, { status: next });
    load();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  return (
    <div dir={dir} className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-3xl flex items-center gap-2"><Rocket className="text-zeus-gold" style={{ width: 28, height: 28 }} /> {t("projects.title")}</h1>
        <p className="text-muted-foreground mt-1">{isAr ? "مشاريع عملية تثبت مهاراتك" : "Hands-on projects that prove your skills"}</p>
      </div>

      {projects.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zeus-brightgold mb-3">{isAr ? "مشاريعي" : "My Projects"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((p) => (
              <div key={p.id} className="zeus-glass p-5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-heading font-bold">{p.title}</h3>
                  <button onClick={() => cycle(p)} className="shrink-0">
                    {p.status === "completed" ? <CheckCircle2 className="text-zeus-gold" style={{ width: 22, height: 22 }} /> : <Circle className="text-muted-foreground/40" style={{ width: 22, height: 22 }} />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                {p.technologies?.length > 0 && <div className="flex flex-wrap gap-1.5 mt-3">{p.technologies.map((s) => <span key={s} className="px-2 py-0.5 rounded-full bg-zeus-gold/10 text-zeus-brightgold text-[11px]">{s}</span>)}</div>}
                <div className="mt-3 text-xs text-muted-foreground">{p.status === "completed" ? (isAr ? "مكتمل ✓" : "Completed ✓") : p.status === "in_progress" ? (isAr ? "قيد التنفيذ" : "In progress") : (isAr ? "مقترح" : "Suggested")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-1.5"><Wrench style={{ width: 14, height: 14 }} /> {isAr ? "مقترحات من خريطتك" : "Suggested from your roadmap"}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {suggestions.map((s) => {
              const exists = projects.some((p) => p.title === s.title);
              return (
                <div key={s.key} className="zeus-glass p-5 flex flex-col">
                  <div className="text-xs text-zeus-gold mb-1">{s.node.title}</div>
                  <h3 className="font-medium">{s.title}</h3>
                  {exists ? <span className="text-xs text-muted-foreground mt-3">{isAr ? "أضفته لمشاريعك" : "Added to your projects"}</span> :
                    <button onClick={() => addProject(s.title, s.node)} className="mt-3 self-start inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zeus-gold/40 text-zeus-brightgold text-xs font-medium hover:bg-zeus-gold/10 transition"><Plus style={{ width: 12, height: 12 }} /> {isAr ? "أضف لمشاريعي" : "Add to my projects"}</button>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}