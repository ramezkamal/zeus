import React from "react";
import { Layers, HelpCircle, Copy, Unlink, EyeOff } from "lucide-react";
import SectionHead from "@/components/landing/SectionHead";

const PROBLEMS = [
  { icon: Layers, text: "Too many learning resources and career options." },
  { icon: HelpCircle, text: "Uncertainty about which skills to develop first." },
  { icon: Copy, text: "Generic journeys that ignore individual needs." },
  { icon: Unlink, text: "Courses disconnected from projects and employment." },
  { icon: EyeOff, text: "Limited visibility into skill gaps and next steps." }
];
const FLOW = ["Understand", "Personalize", "Guide", "Assess", "Adapt", "Launch"];
const CONNECTS = ["Learner understanding", "Personalized roadmaps", "Learning resources", "Skill development", "Assessments & progress", "Practical projects", "Career preparation"];

export default function ProblemSolution() {
  return (
    <>
      <section className="py-24 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHead eyebrow="The Problem" title="Learning Is Everywhere. Direction Is Not." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROBLEMS.map(({ icon: Icon, text }) => (
              <div key={text} className="p-5 rounded-2xl border border-border/50 bg-card/30">
                <Icon className="w-5 h-5 text-zeus-gold mb-4" />
                <p className="text-sm leading-relaxed text-foreground/85">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="platform" className="py-24 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHead eyebrow="The ZEUS Solution" title="One Personalized Journey. From Learning to Career Readiness." desc="ZEUS starts with the learner, not the content — connecting every step into one guided path." />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-10">
            {FLOW.map((s, i) => (
              <div key={s} className="relative text-center py-5 rounded-xl border border-zeus-gold/20 bg-gradient-to-b from-zeus-gold/10 to-transparent">
                <div className="text-[10px] text-zeus-gold font-bold mb-1">0{i + 1}</div>
                <div className="font-heading font-semibold text-sm">{s}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {CONNECTS.map((c) => <span key={c} className="px-3.5 py-1.5 rounded-full bg-secondary/40 text-xs text-foreground/80">{c}</span>)}
          </div>
        </div>
      </section>
    </>
  );
}