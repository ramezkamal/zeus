import React from "react";
import SectionHead from "@/components/landing/SectionHead";
import useL from "@/components/landing/useL";

export default function HowItWorks() {
  const { L } = useL();
  const STEPS = [
    { t: L("Understand", "نفهمك"), d: L("Goals, interests, skills, experience, and available time — through a natural conversation.", "أهدافك واهتماماتك ومهاراتك وخبرتك ووقتك — من خلال محادثة طبيعية.") },
    { t: L("Build a Profile", "نبني ملفك"), d: L("A structured Learning DNA of where you are and where you want to go.", "Learning DNA منظّم بيوضح إنت فين وعايز توصل لفين.") },
    { t: L("Identify Gaps", "نحدد الفجوات"), d: L("The skills and priorities that matter most for your target goal.", "المهارات والأولويات الأهم لهدفك.") },
    { t: L("Generate a Roadmap", "نبني الخريطة"), d: L("An ordered plan with phases, lessons, resources, and stage projects.", "خطة مرتبة بمراحل ودروس ومصادر ومشاريع لكل مرحلة.") },
    { t: L("Guide Learning", "نوجّه تعلّمك"), d: L("Lessons, an AI tutor, quizzes, and hands-on tasks along the way.", "دروس ومدرّس ذكي واختبارات ومهام عملية طول الطريق.") },
    { t: L("Improve With Feedback", "نتطوّر معاك"), d: L("Progress and quiz results unlock the next steps on your path.", "تقدّمك ونتايج اختباراتك بتفتح الخطوات الجاية.") }
  ];
  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead eyebrow={L("How ZEUS Works", "إزاي زيوس بيشتغل")} title={L("Six steps from uncertainty to a clear plan.", "6 خطوات من الحيرة لخطة واضحة.")} />
        <ol className="grid md:grid-cols-3 gap-px bg-border/40 rounded-2xl overflow-hidden border border-border/40">
          {STEPS.map((s, i) => (
            <li key={i} className="bg-background p-7 hover:bg-card/50 transition">
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