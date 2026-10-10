import React from "react";
import { PARTNER_GROUPS } from "@/components/landing/partners";
import useL from "@/components/landing/useL";

const LABELS_AR = { technology: "منظومة التكنولوجيا", training: "التعليم والتدريب المؤسسي", industry: "التوظيف والصناعة" };

function Row({ group, reverse, label }) {
  const items = [...group.items, ...group.items];
  return (
    <div className="group/row">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zeus-gold/80 mb-3 px-5 max-w-6xl mx-auto">{label}</div>
      <div dir="ltr" className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className={`zeus-marquee flex w-max gap-3 ${reverse ? "zeus-marquee-reverse" : ""}`}>
          {items.map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" aria-hidden={i >= group.items.length} tabIndex={i >= group.items.length ? -1 : 0}
              className="flex items-center gap-2.5 h-12 px-4 rounded-xl border border-border/50 bg-card/40 hover:border-zeus-gold/50 hover:bg-card/80 transition group/logo focus-visible:outline focus-visible:outline-2 focus-visible:outline-zeus-gold">
              <img src={p.logo} alt="" loading="lazy" className="w-6 h-6 object-contain rounded grayscale opacity-70 group-hover/logo:grayscale-0 group-hover/logo:opacity-100 transition" />
              <span className="text-sm font-medium text-muted-foreground group-hover/logo:text-foreground whitespace-nowrap transition">{p.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PartnerMarquee() {
  const { L, isAr } = useL();
  return (
    <section id="ecosystem" className="py-20 border-t border-border/40">
      <div className="max-w-3xl mx-auto px-5 text-center mb-12">
        <h2 className="font-heading font-bold text-3xl lg:text-4xl">{L("Building the Future of Learning — Together", "بنبني مستقبل التعلّم — مع بعض")}</h2>
        <p className="mt-3 text-muted-foreground">{L("Connecting learners, educators, employers, and technology partners through a shared commitment to skills and opportunity.", "بنربط المتعلّمين والمعلّمين وأصحاب العمل وشركاء التكنولوجيا حوالين هدف واحد: المهارات والفرص.")}</p>
      </div>
      <div className="space-y-8">
        {PARTNER_GROUPS.map((g, i) => <Row key={g.key} group={g} reverse={i % 2 === 1} label={isAr ? LABELS_AR[g.key] : g.label} />)}
      </div>
      <p className="mt-10 px-5 text-center text-[11px] text-muted-foreground/70 max-w-2xl mx-auto">
        {L("Technologies we build with and organizations we aim to collaborate with. Names and logos are trademarks of their respective owners and do not imply an official partnership or endorsement.",
          "تقنيات بنستخدمها وجهات بنسعى للتعاون معاها. الأسماء والشعارات ملك أصحابها ولا تعني وجود شراكة رسمية أو تأييد.")}
      </p>
    </section>
  );
}