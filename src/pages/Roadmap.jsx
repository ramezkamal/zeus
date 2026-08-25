import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Workflow, Loader2, Target, Network, ListTree, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import WorkflowCanvas from "@/components/zeus/workflow/WorkflowCanvas";
import RoadmapTree from "@/components/zeus/RoadmapTree";
import NodeDetail from "@/components/zeus/NodeDetail";
import NodePanel from "@/components/zeus/NodePanel";

const isReady = (n) => (n?.resources || []).some((r) => r.rank);

export default function Roadmap() {
  const { t, lang, dir } = useI18n();
  const isAr = lang === "ar";
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("flow");
  const [activeId, setActiveId] = useState(null);
  const [openTreeId, setOpenTreeId] = useState(null);
  const [fetchingId, setFetchingId] = useState(null);
  const [failedIds, setFailedIds] = useState([]);
  const [prefetching, setPrefetching] = useState(false);

  const roadmapRef = useRef(null);
  roadmapRef.current = roadmap;
  const chainRef = useRef(Promise.resolve());
  const inFlightRef = useRef(new Set());
  const failedRef = useRef(new Set());

  useEffect(() => {
    (async () => {
      const r = await base44.entities.Roadmap.filter({ status: "active" }, "-created_date", 1);
      if (r.length) setRoadmap(r[0]);
      setLoading(false);
    })();
  }, []);

  // Serialized fetch — one node at a time so results never overwrite each other
  const doFetch = useCallback((nodeId) => {
    if (inFlightRef.current.has(nodeId)) return chainRef.current;
    inFlightRef.current.add(nodeId);
    const run = chainRef.current.then(async () => {
      const cur = roadmapRef.current;
      const node = (cur?.nodes || []).find((n) => n.id === nodeId);
      if (!node || isReady(node)) return;
      setFetchingId(nodeId);
      setFailedIds((p) => p.filter((x) => x !== nodeId));
      try {
        const res = await base44.functions.invoke("nodeResources", { roadmapId: cur.id, nodeId, lang });
        const data = res?.data || {};
        if (data.success && Array.isArray(data.nodes)) {
          setRoadmap((prev) => ({ ...prev, nodes: data.nodes }));
        } else {
          failedRef.current.add(nodeId);
          setFailedIds((p) => [...p, nodeId]);
        }
      } catch (e) {
        failedRef.current.add(nodeId);
        setFailedIds((p) => [...p, nodeId]);
      }
      setFetchingId(null);
    });
    chainRef.current = run.catch(() => {});
    run.finally(() => inFlightRef.current.delete(nodeId));
    return run;
  }, [lang]);

  const fetchResources = useCallback((nodeId) => {
    failedRef.current.delete(nodeId);
    return doFetch(nodeId);
  }, [doFetch]);

  // Background prefetch: collect resources for every node ahead of time
  useEffect(() => {
    if (!roadmap?.id) return;
    let cancelled = false;
    (async () => {
      setPrefetching(true);
      while (!cancelled) {
        const cur = roadmapRef.current;
        const next = (cur?.nodes || []).find((n) => !isReady(n) && !failedRef.current.has(n.id) && !inFlightRef.current.has(n.id));
        if (!next) break;
        await doFetch(next.id);
      }
      if (!cancelled) setPrefetching(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmap?.id, doFetch]);

  const ensureResources = (nodeId) => {
    const node = (roadmap?.nodes || []).find((n) => n.id === nodeId);
    if (node && !isReady(node) && !failedRef.current.has(nodeId)) doFetch(nodeId);
  };

  const selectFlow = (nodeId) => { setActiveId(nodeId); ensureResources(nodeId); };
  const toggleTree = (nodeId) => {
    if (openTreeId === nodeId) { setOpenTreeId(null); return; }
    setOpenTreeId(nodeId);
    ensureResources(nodeId);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  const nodes = roadmap?.nodes || [];
  const activeNode = nodes.find((n) => n.id === activeId);
  const openTreeNode = nodes.find((n) => n.id === openTreeId);
  const ready = nodes.filter(isReady).length;

  return (
    <div dir={dir} className="space-y-5">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl flex items-center gap-2">
          <Workflow className="text-zeus-gold" style={{ width: 26, height: 26 }} /> {t("roadmap.title")}
        </h1>
        {roadmap?.goal && (
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zeus-gold/10 border border-zeus-gold/30 text-zeus-brightgold text-sm max-w-full">
            <Target style={{ width: 13, height: 13 }} className="shrink-0" /> <span className="truncate">{roadmap.goal}</span>
          </div>
        )}
      </motion.div>

      {!nodes.length ? (
        <div className="zeus-glass p-10 text-center text-muted-foreground">{isAr ? "مفيش خريطة لسه" : "No roadmap yet"}</div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="inline-flex p-1 rounded-full bg-card/70 border border-border/60">
              <ViewTab active={view === "flow"} onClick={() => setView("flow")} icon={Network} label={isAr ? "شبكة" : "Flow"} />
              <ViewTab active={view === "list"} onClick={() => setView("list")} icon={ListTree} label={isAr ? "قائمة" : "List"} />
            </div>
            {prefetching && ready < nodes.length ? (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <Loader2 className="text-zeus-gold animate-spin" style={{ width: 12, height: 12 }} />
                {isAr ? `بجهّز المصادر في الخلفية… ${ready}/${nodes.length}` : `Preparing resources in background… ${ready}/${nodes.length}`}
              </span>
            ) : (
              <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                {ready === nodes.length && <CheckCircle2 className="text-zeus-gold" style={{ width: 12, height: 12 }} />}
                {isAr ? `${nodes.length} محطة · ${ready} مصادرها جاهزة` : `${nodes.length} nodes · ${ready} resourced`}
              </span>
            )}
          </div>

          <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            {view === "flow" ? (
              <WorkflowCanvas nodes={nodes} activeId={activeId} onSelect={selectFlow} isAr={isAr} />
            ) : (
              <RoadmapTree nodes={nodes} isAr={isAr} openId={openTreeId} onToggle={toggleTree}>
                {openTreeNode && (
                  <NodeDetail
                    node={openTreeNode}
                    isAr={isAr}
                    loading={fetchingId === openTreeNode.id || (!isReady(openTreeNode) && !failedIds.includes(openTreeNode.id) && prefetching)}
                    failed={failedIds.includes(openTreeNode.id)}
                    onRefresh={() => fetchResources(openTreeNode.id)}
                  />
                )}
              </RoadmapTree>
            )}
          </motion.div>
        </>
      )}

      <NodePanel
        node={view === "flow" ? activeNode : null}
        isAr={isAr}
        dir={dir}
        loading={activeNode ? (fetchingId === activeNode.id || (!isReady(activeNode) && !failedIds.includes(activeNode.id) && prefetching)) : false}
        failed={activeNode ? failedIds.includes(activeNode.id) : false}
        onRefresh={() => activeNode && fetchResources(activeNode.id)}
        onClose={() => setActiveId(null)}
      />
    </div>
  );
}

function ViewTab({ active, onClick, icon: Icon, label }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition ${active ? "bg-zeus-gold text-zeus-midnight shadow-gold" : "text-muted-foreground hover:text-foreground"}`}>
      <Icon style={{ width: 13, height: 13 }} /> {label}
    </button>
  );
}