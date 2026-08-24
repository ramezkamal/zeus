import React from "react";
import { Youtube, FileText, GraduationCap, BookOpen, Wrench, PenTool, ExternalLink } from "lucide-react";

const TYPE_ICON = {
  video: Youtube,
  docs: FileText,
  course: GraduationCap,
  article: BookOpen,
  tool: Wrench,
  interactive: PenTool
};

function getYouTubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function tierLabel(t, isAr) {
  if (t === "best_match") return isAr ? "الأفضل" : "Best Match";
  if (t === "alternative") return isAr ? "بديل" : "Alternative";
  if (t === "deep_dive") return isAr ? "تعمّق" : "Deep Dive";
  return isAr ? "مصدر" : "Resource";
}

export default function ResourceCard({ resource, isAr }) {
  if (!resource) return null;
  const yt = getYouTubeId(resource.url);
  const Icon = TYPE_ICON[resource.type] || BookOpen;
  const tier = tierLabel(resource.tier, isAr);

  return (
    <div className="rounded-xl bg-secondary/30 border border-border/60 overflow-hidden hover:zeus-gold-border transition group">
      {yt ? (
        <div className="aspect-video bg-black/40 relative">
          <iframe
            src={`https://www.youtube.com/embed/${yt}`}
            title={resource.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : null}
      <div className="p-3.5">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 shrink-0 rounded-lg bg-zeus-gold/15 flex items-center justify-center">
            <Icon className="text-zeus-gold" style={{ width: 18, height: 18 }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium line-clamp-2">{resource.title}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-zeus-gold/15 text-zeus-brightgold font-semibold">{tier}</span>
              <span className="text-[11px] text-muted-foreground capitalize">{resource.type}</span>
            </div>
          </div>
        </div>
        <a href={resource.url} target="_blank" rel="noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-zeus-gold/10 hover:bg-zeus-gold/20 text-zeus-brightgold text-xs font-semibold transition">
          <ExternalLink style={{ width: 13, height: 13 }} />
          {isAr ? "فتح المصدر" : "Open resource"}
        </a>
      </div>
    </div>
  );
}