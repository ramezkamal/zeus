import React, { useState, useEffect } from "react";
import { Map, Loader2, X, BookOpen, Wrench, Clock, ListChecks, Link2, CheckCircle2, Circle, Globe, Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import ResourceCard from "@/components/zeus/ResourceCard";

export default function Roadmap() {
  const { t, lang, dir } = useI18n();
  const isAr = lang === "ar";
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1);
      if (r.length) setRoadmap(r[0]);
      setLoading(false);
    })();
  }, []);

  const handleFindResources = async () => {
    if (!roadmap || searching) return;
    setSearching(true);
    try {
      const res = await base44.functions.invoke("searchResources", { roadmapId: roadmap.id, lang });
      if (res?.data?.nodes) setRoadmap({ ...roadmap, nodes: res.data.nodes });
    } catch (e) { /* ignore */ }
    setSearching(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  const nodes = roadmap?.nodes || [];
  const phases = [...new Set(nodes.map((n) => n.phase))].sort((a, b) => a - b);

  return (
    <div dir={dir} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl flex items-center gap-2"><Map className="text-zeus-gold" style={{ width: 28, height: 28 }} /> {t("roadmap.title")}</h1>
          <p className="text-muted-foreground mt-1">{roadmap?.goal}</p>
        </div>
        {nodes.length > 0 && (
          <button onClick={handleFindResources} disabled={searching}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-zeus-gold to-zeus-brightgold text-zeus-midnight text-sm font-bold hover:shadow-gold transition disabled:opacity-60 shrink-0">
            {searching ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Globe style={{ width: 16, height: 16 }} />}
            {searching ? (isAr ? "بيدوّر على مصادر حقيقية..." : "Searching the web...") : (isAr ? "ادوّر على مصادر حقيقية" : "Find real resources")}
          </button>
        )}
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
      {selected && <NodeDrawer node={selected} onClose={() => setSelected(null)} isAr={isAr} searching={searching} onFindResources={handleFindResources} />}
    </div>
  );
}

function NodeDrawer({ node, onClose, isAr, searching, onFindResources }) {
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
          <div>
            <div className="text-sm font-semibold mb-2 flex items-center gap-1.5"><Globe style={{ width: 14, height: 14 }} className="text-zeus-gold" /> {isAr ? "المصادر" : "Resources"}</div>
            {node.resources?.length > 0 ? (
              <div className="space-y-3">{node.resources.map((r, i) => <ResourceCard key={i} resource={r} isAr={isAr} />)}</div>
            ) : (
              <div className="p-4 rounded-xl bg-secondary/20 border border-dashed border-border/60 text-center">
                <p className="text-xs text-muted-foreground mb-3">{isAr ? "لسه مفيش مصادر حقيقية للمرحلة دي" : "No real resources for this node yet"}</p>
                <button onClick={onFindResources} disabled={searching}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zeus-gold/15 text-zeus-brightgold text-xs font-semibold hover:bg-zeus-gold/25 transition disabled:opacity-60">
                  {searching ? <Loader2 className="animate-spin" style={{ width: 13, height: 13 }} /> : <Search style={{ width: 13, height: 13 }} />}
                  {searching ? (isAr ? "بيدوّر..." : "Searching...") : (isAr ? "ادوّر على مصادر" : "Find resources")}
                </button>
              </div>
            )}
          </div>
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