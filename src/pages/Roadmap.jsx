import React, { useState, useEffect, useCallback } from "react";
import { Map, Loader2, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import RoadmapTree from "@/components/zeus/RoadmapTree";
import NodeDetail from "@/components/zeus/NodeDetail";

export default function Roadmap() {
  const { t, lang, dir } = useI18n();
  const isAr = lang === "ar";
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [fetchingId, setFetchingId] = useState(null);
  const [failedIds, setFailedIds] = useState([]);

  useEffect(() => {
    (async () => {
      const r = await base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1);
      if (r.length) setRoadmap(r[0]);
      setLoading(false);
    })();
  }, []);

  const fetchResources = useCallback(async (nodeId, rm) => {
    const target = rm || roadmap;
    if (!target || fetchingId) return;
    setFetchingId(nodeId);
    setFailedIds((p) => p.filter((x) => x !== nodeId));
    try {
      const res = await base44.functions.invoke("nodeResources", { roadmapId: target.id, nodeId, lang });
      const data = res?.data || {};
      if (data.success && Array.isArray(data.nodes)) {
        setRoadmap((prev) => ({ ...prev, nodes: data.nodes }));
      } else {
        setFailedIds((p) => [...p, nodeId]);
      }
    } catch (e) {
      setFailedIds((p) => [...p, nodeId]);
    }
    setFetchingId(null);
  }, [roadmap, fetchingId, lang]);

  const handleToggle = (nodeId) => {
    if (openId === nodeId) { setOpenId(null); return; }
    setOpenId(nodeId);
    const node = (roadmap?.nodes || []).find((n) => n.id === nodeId);
    const verified = (node?.resources || []).some((r) => r.rank);
    if (node && !verified && !failedIds.includes(nodeId)) fetchResources(nodeId);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  const nodes = roadmap?.nodes || [];
  const openNode = nodes.find((n) => n.id === openId);
  const withResources = nodes.filter((n) => (n.resources || []).some((r) => r.rank)).length;

  return (
    <div dir={dir} className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl flex items-center gap-2">
          <Map className="text-zeus-gold" style={{ width: 26, height: 26 }} /> {t("roadmap.title")}
        </h1>
        {roadmap?.goal && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zeus-gold/10 border border-zeus-gold/30 text-zeus-brightgold text-sm max-w-full">
            <Target style={{ width: 13, height: 13 }} className="shrink-0" /> <span className="truncate">{roadmap.goal}</span>
          </div>
        )}
        {nodes.length > 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            {isAr
              ? `${nodes.length} محطة · ${withResources} محطة مصادرها جاهزة · افتح أي محطة وزيوس هيدوّر على أحسن مصادر ليها`
              : `${nodes.length} nodes · ${withResources} with resources · open any node and ZEUS finds its best resources`}
          </p>
        )}
      </div>

      {!nodes.length ? (
        <div className="zeus-glass p-10 text-center text-muted-foreground">{isAr ? "مفيش خريطة لسه" : "No roadmap yet"}</div>
      ) : (
        <RoadmapTree nodes={nodes} isAr={isAr} openId={openId} onToggle={handleToggle}>
          {openNode && (
            <NodeDetail
              node={openNode}
              isAr={isAr}
              loading={fetchingId === openNode.id}
              failed={failedIds.includes(openNode.id)}
              onRefresh={() => fetchResources(openNode.id)}
            />
          )}
        </RoadmapTree>
      )}
    </div>
  );
}