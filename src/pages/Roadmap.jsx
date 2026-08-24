import React, { useState, useEffect } from "react";
import { Map, Loader2, X, BookOpen, Wrench, Clock, ListChecks, Link2, CheckCircle2, Circle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";

export default function Roadmap() {
  const { t, lang, dir } = useI18n();
  const isAr = lang === "ar";
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    (async () => {
      const r = await base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1);
      if (r.length) setRoadmap(r[0]);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  const nodes = roadmap?.nodes || [];
  const phases = [...new Set(nodes.map((n) => n.phase))].sort((a, b) => a - b);

  return (
    <div dir={dir} className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl flex items-center gap-2"><Map className="text-zeus-gold" style={{ width: 28, height: 28 }} /> {t("roadmap.title")}</h1>
        <p className="text-muted-foreground mt-1">{roadmap?.goal}</p>
      </div>

      {!nodes.length ? (
        <div className="zeus-glass p-10 text-center text-muted-foreground">{isAr ? "مفيش خريطة لسه" : "No roadmap yet"}</div>
      ) : (
        <div className="space-y-6">
          {phases.map((p, pi) => (
            <div key={p}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-zeus-gold text-zeus-midnight font-bold flex items-center justify-center text-sm">{p}</div>
                <h2 className="font-heading font-bold text-lg">{isAr ? `المرحلة ${p}` : `Phase ${p}`}</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {nodes.filter((n) => n.phase === p).map((node) => {
                  const done = node.status === "completed";
                  return (
                    <button key={node.id} onClick={() => setSelected(node)}
                      className="text-start zeus-glass p-4 hover:zeus-gold-border transition group relative">
                      <div className="flex items-start justify-between gap-2">
                        <div className="font-heading font-bold">{node.title}</div>
                        {done ? <CheckCircle2 className="text-zeus-gold shrink-0" style={{ width: 18, height: 18 }} /> : <Circle className="text-muted-foreground/40 shrink-0" style={{ width: 18, height: 18 }} />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{node.objective}</p>
                      <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
                        <Clock style={{ width: 11, height: 11 }} /> {node.estimated_hours || 0} {isAr ? "س" : "h"}
                        <span>·</span><ListChecks style={{ width: 11, height: 11 }} /> {(node.tasks || []).length} {isAr ? "مهام" : "tasks"}
                      </div>
                      {node.parent_ids?.length > 0 && <div className="mt-2 flex items-center gap-1 text-[10px] text-zeus-gold/70"><Link2 style={{ width: 10, height: 10 }} /> {isAr ? "يعتمد على محطات سابقة" : "depends on prior nodes"}</div>}
                    </button>
                  );
                })}
              </div>
              {pi < phases.length - 1 && <div className="flex justify-center my-3"><div className="w-px h-8 bg-gradient-to-b from-zeus-gold/40 to-transparent" /></div>}
            </div>
          ))}
        </div>
      )}

      {/* Node detail drawer */}
      {selected && <NodeDrawer node={selected} onClose={() => setSelected(null)} isAr={isAr} />}
    </div>
  );
}

function NodeDrawer({ node, onClose, isAr }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" dir={document.documentElement.dir}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative h-full w-full max-w-md bg-card border-s border-border/60 overflow-y-auto animate-fade-up">
        <div className="sticky top-0 bg-card/90 backdrop-blur-xl p-5 border-b border-border/60 flex items-center justify-between">
          <div>
            <div className="text-xs text-zeus-gold">{isAr ? `المرحلة ${node.phase}` : `Phase ${node.phase}`}</div>
            <h3 className="font-heading font-bold text-xl">{node.title}</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary/60"><X style={{ width: 18, height: 18 }} /></button>
        </div>
        <div className="p-5 space-y-5">
          <div>
            <div className="text-sm font-semibold mb-1.5 flex items-center gap-1.5"><BookOpen style={{ width: 14, height: 14 }} className="text-zeus-gold" /> {isAr ? "الهدف" : "Objective"}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{node.objective}</p>
          </div>
          {node.skills?.length > 0 && (
            <div>
              <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Wrench style={{ width: 14, height: 14 }} className="text-zeus-gold" /> {isAr ? "المهارات" : "Skills"}</div>
              <div className="flex flex-wrap gap-1.5">{node.skills.map((s) => <span key={s} className="px-2.5 py-1 rounded-full bg-zeus-gold/10 text-zeus-brightgold text-xs">{s}</span>)}</div>
            </div>
          )}
          {node.tasks?.length > 0 && (
            <div>
              <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><ListChecks style={{ width: 14, height: 14 }} className="text-zeus-gold" /> {isAr ? "المهام" : "Tasks"}</div>
              <ul className="space-y-1.5">{node.tasks.map((tk, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-zeus-gold">•</span>{tk}</li>)}</ul>
            </div>
          )}
          {node.resources?.length > 0 && (
            <div>
              <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><BookOpen style={{ width: 14, height: 14 }} className="text-zeus-gold" /> {isAr ? "المصادر" : "Resources"}</div>
              <div className="space-y-2">{node.resources.map((r, i) => (
                <a key={i} href={r.url || "#"} target="_blank" rel="noreferrer" className="block p-3 rounded-xl bg-secondary/30 border border-border/60 hover:zeus-gold-border transition">
                  <div className="flex items-center justify-between"><span className="text-sm font-medium">{r.title}</span><span className="text-[10px] px-2 py-0.5 rounded-full bg-zeus-gold/15 text-zeus-brightgold">{tierLabel(r.tier, isAr)}</span></div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.type}</div>
                </a>
              ))}</div>
            </div>
          )}
          {node.projects?.length > 0 && (
            <div>
              <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Wrench style={{ width: 14, height: 14 }} className="text-zeus-gold" /> {isAr ? "أفكار مشاريع" : "Project Ideas"}</div>
              <ul className="space-y-1.5">{node.projects.map((p, i) => <li key={i} className="text-sm text-muted-foreground flex gap-2"><span className="text-zeus-gold">•</span>{p}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function tierLabel(t, isAr) {
  if (t === "best_match") return isAr ? "الأفضل" : "Best Match";
  if (t === "alternative") return isAr ? "بديل" : "Alternative";
  if (t === "deep_dive") return isAr ? "تعمّق" : "Deep Dive";
  return t || "Resource";
}