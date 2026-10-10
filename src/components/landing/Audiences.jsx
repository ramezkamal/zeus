import React from "react";
import { GraduationCap, School, Building2, Briefcase, ArrowRight } from "lucide-react";
import SectionHead from "@/components/landing/SectionHead";

export default function Audiences({ onStart, onPartner }) {
  const cards = [
    { icon: GraduationCap, t: "For Learners", d: "Personalized direction, structured roadmaps, skill development, and career-readiness support.", cta: "Explore Learning", on: onStart, tag: "Available now" },
    { icon: School, t: "For Educational Institutions", d: "Personalized learning support and potential digital learning programs for students.", cta: "Explore Institutional Partnerships", on: () => onPartner("institution"), tag: "Pilot programs" },
    { icon: Building2, t: "For Companies & HR Teams", d: "Online employee training and structured skill-development pathways.", cta: "Discuss Corporate Training", on: () => onPartner("training"), tag: "In development" },
    { icon: Briefcase, t: "For Employers & Industry", d: "Collaboration around internships, projects, and skills-based talent discovery.", cta: "Explore Talent Partnerships", on: () => onPartner("industry"), tag: "In development" }
  ];
  return (
    <section id="audiences" className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead eyebrow="Who ZEUS Serves" title="Built for Learners. Designed to Work With Organizations." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ icon: Icon, ...c }) => (
            <div key={c.t} className="flex flex-col p-6 rounded-2xl border border-border/50 bg-card/30 hover:border-zeus-gold/40 transition">
              <div className="flex items-center justify-between mb-5">
                <Icon className="w-6 h-6 text-zeus-gold" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.tag}</span>
              </div>
              <h3 className="font-heading font-semibold mb-2">{c.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{c.d}</p>
              <button onClick={c.on} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-zeus-gold hover:gap-2.5 transition-all text-start">{c.cta} <ArrowRight className="w-4 h-4 shrink-0" /></button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}