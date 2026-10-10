import React from "react";

export default function SectionHead({ eyebrow, title, desc }) {
  return (
    <div className="max-w-3xl mx-auto text-center mb-12">
      {eyebrow && <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zeus-gold mb-3">{eyebrow}</div>}
      <h2 className="font-heading font-bold text-3xl lg:text-4xl leading-tight">{title}</h2>
      {desc && <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );
}