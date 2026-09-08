import React from "react";

export default function VideoPlayer({ url, title }) {
  const videoId = extractYouTubeId(url);
  if (!videoId) return null;
  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-border/40">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title || "Lesson video"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}

function extractYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([^&\s]+)/,
    /(?:youtu\.be\/)([^&\s]+)/,
    /(?:youtube\.com\/embed\/)([^&\s]+)/
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}