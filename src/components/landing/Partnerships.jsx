import React from "react";
import SectionHead from "@/components/landing/SectionHead";

const CARDS = [
  { type: "industry", t: "Employment & Industry", s: "Help connect learning with the real market.", items: ["Share internships and relevant job opportunities", "Define relevant skill requirements", "Explore project-based collaboration", "Discover candidates by demonstrated skills"], cta: "Become an Industry Partner" },
  { type: "training", t: "Education & Corporate Training", s: "Personalized digital learning for students and employees.", items: ["Educational and university pilots", "Corporate online training programs", "Structured skill-development pathways", "Co-developed learning initiatives"], cta: "Discuss a Training Partnership" },
  { type: "technology", t: "Technology", s: "Support the technology that enables ZEUS to evolve.", items: ["AI and software services", "Cloud and infrastructure capabilities", "Technical integrations", "Developer tools and expertise"], cta: "Explore Technology Partnerships" }
];

export default function Partnerships({ onPartner }) {
  return (
    <section id="partnerships" className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead eyebrow="Partnership Opportunities" title="Different Goals. One Learning Ecosystem." desc="Open collaboration opportunities — we're actively looking for partners in each area." />
        <div className="grid md:grid-cols-3 gap-5">
          {CARDS.map((c) => (
            <div key={c.type} className="relative flex flex-col p-7 rounded-2xl border border-border/50 bg-gradient-to-b from-card/60 to-card/20 overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zeus-gold/60 to-transparent" />
              <h3 className="font-heading font-semibold text-xl mb-1">{c.t}</h3>
              <p className="text-sm text-muted-foreground mb-5">{c.s}</p>
              <ul className="space-y-2.5 flex-1">
                {c.items.map((i) => <li key={i} className="flex gap-2.5 text-sm text-foreground/85"><span className="mt-2 w-1 h-1 rounded-full bg-zeus-gold shrink-0" />{i}</li>)}
              </ul>
              <button onClick={() => onPartner(c.type)} className="mt-7 w-full py-3 rounded-full border border-zeus-gold/40 text-sm font-medium hover:bg-zeus-gold hover:text-zeus-midnight transition">{c.cta}</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}