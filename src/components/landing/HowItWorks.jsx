import React from "react";
import SectionHead from "@/components/landing/SectionHead";

const STEPS = [
  { t: "Understand", d: "Goals, interests, skills, experience, and available time — through a natural conversation." },
  { t: "Build a Profile", d: "A structured Learning DNA of where you are and where you want to go." },
  { t: "Identify Gaps", d: "The skills and priorities that matter most for your target goal." },
  { t: "Generate a Roadmap", d: "An ordered plan with phases, lessons, resources, and stage projects." },
  { t: "Guide Learning", d: "Lessons, an AI tutor, quizzes, and hands-on tasks along the way." },
  { t: "Improve With Feedback", d: "Progress and quiz results unlock the next steps on your path." }
];

export default function HowItWorks() {
  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead eyebrow="How ZEUS Works" title="Six steps from uncertainty to a clear plan." />
        <ol className="relative grid md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
          {STEPS.map((s, i) => (
            <li key={s.t} className="bg-background p-7 hover:bg-card/50 transition">
              <div className="font-heading text-3xl font-bold text-zeus-gold/30 mb-4">{String(i + 1).padStart(2, "0")}</div>
              <h3 className="font-heading font-semibold text-lg mb-2">{s.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}