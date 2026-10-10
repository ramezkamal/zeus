import React from "react";
import { Layers, HelpCircle, Copy, Unlink, EyeOff } from "lucide-react";
import SectionHead from "@/components/landing/SectionHead";
import useL from "@/components/landing/useL";

export default function ProblemSolution() {
  const { L } = useL();
  const PROBLEMS = [
    { icon: Layers, text: L("Too many learning resources and career options.", "مصادر تعلّم ومسارات مهنية كتير جدًا.") },
    { icon: HelpCircle, text: L("Uncertainty about which skills to develop first.", "مش عارف تبدأ بأنهي مهارة الأول.") },
    { icon: Copy, text: L("Generic journeys that ignore individual needs.", "مسارات عامة مش بتراعي احتياجك.") },
    { icon: Unlink, text: L("Courses disconnected from projects and employment.", "كورسات منفصلة عن المشاريع والشغل.") },
    { icon: EyeOff, text: L("Limited visibility into skill gaps and next steps.", "مش شايف الفجوات ولا الخطوة الجاية.") }
  ];
  const FLOW = [L("Understand", "افهم"), L("Personalize", "خصّص"), L("Guide", "وجّه"), L("Assess", "قيّم"), L("Adapt", "طوّر"), L("Launch", "انطلق")];
  const CONNECTS = [L("Learner understanding", "فهم المتعلّم"), L("Personalized roadmaps", "مسارات شخصية"), L("Learning resources", "مصادر تعلّم"), L("Skill development", "تطوير المهارات"), L("Assessments & progress", "تقييم وتقدّم"), L("Practical projects", "مشاريع عملية"), L("Career preparation", "التجهيز لسوق العمل")];
  return (
    <>
      <section className="py-24 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHead eyebrow={L("The Problem", "المشكلة")} title={L("Learning Is Everywhere. Direction Is Not.", "التعلّم في كل حتة. لكن الاتجاه مش واضح.")} />
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
          <SectionHead eyebrow={L("The ZEUS Solution", "حل زيوس")} title={L("One Personalized Journey. From Learning to Career Readiness.", "رحلة واحدة مخصّصة ليك. من التعلّم للجاهزية لسوق العمل.")} desc={L("ZEUS starts with the learner, not the content — connecting every step into one guided path.", "زيوس بيبدأ منك إنت مش من المحتوى — وبيربط كل خطوة في مسار واحد واضح.")} />
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-10">
            {FLOW.map((s, i) => (
              <div key={s} className="text-center py-5 rounded-xl border border-zeus-gold/20 bg-gradient-to-b from-zeus-gold/10 to-transparent">
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