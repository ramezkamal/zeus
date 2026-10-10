import React from "react";
import { User, Compass, ListChecks, TrendingUp, Hammer, ShieldCheck, Lock, Eye, SlidersHorizontal, Scale, RefreshCw } from "lucide-react";
import SectionHead from "@/components/landing/SectionHead";

const WHY = [
  { icon: User, t: "Learner-first personalization" },
  { icon: Compass, t: "Learning connected to career direction" },
  { icon: ListChecks, t: "Structured next steps" },
  { icon: TrendingUp, t: "Progress-informed recommendations" },
  { icon: Hammer, t: "Practical skill development" },
  { icon: ShieldCheck, t: "Responsible AI principles" }
];
const TRUST = [
  { icon: Lock, t: "Privacy-conscious design", d: "Your learning data is private to your account by default." },
  { icon: Eye, t: "Transparent recommendations", d: "Career paths come with the reasons they fit you." },
  { icon: SlidersHorizontal, t: "You stay in control", d: "Edit your profile and change your goals at any time." },
  { icon: Scale, t: "Fairness by intent", d: "Guidance supports decisions — it doesn't make them for you." },
  { icon: RefreshCw, t: "Continuous improvement", d: "The product evolves based on learner feedback." }
];

export default function WhyTrust() {
  return (
    <>
      <section id="why" className="py-24 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHead eyebrow="Why ZEUS" title="More Than Content. A Clearer Way Forward." desc="An early-stage Egyptian EdTech initiative with a working platform tested by university students." />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {WHY.map(({ icon: Icon, t }) => (
              <div key={t} className="flex items-center gap-3 p-5 rounded-xl border border-border/40">
                <Icon className="w-5 h-5 text-zeus-gold shrink-0" /><span className="text-sm font-medium">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 border-t border-border/40 bg-card/20">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHead eyebrow="Trust & Responsible AI" title="AI that informs, never decides for you." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {TRUST.map(({ icon: Icon, t, d }) => (
              <div key={t}>
                <Icon className="w-5 h-5 text-zeus-gold mb-3" />
                <h3 className="font-heading font-semibold text-sm mb-1.5">{t}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}