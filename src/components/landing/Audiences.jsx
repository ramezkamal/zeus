import React from "react";
import { GraduationCap, School, Building2, Briefcase, ArrowRight, ArrowLeft } from "lucide-react";
import SectionHead from "@/components/landing/SectionHead";
import useL from "@/components/landing/useL";

export default function Audiences({ onStart, onPartner }) {
  const { L, isAr } = useL();
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const cards = [
    { icon: GraduationCap, t: L("For Learners", "للمتعلّمين"), d: L("Personalized direction, structured roadmaps, skill development, and career-readiness support.", "توجيه شخصي، خرائط منظّمة، تطوير مهارات، وتجهيز لسوق العمل."), cta: L("Explore Learning", "اكتشف التعلّم"), on: onStart, tag: L("Available now", "متاح دلوقتي") },
    { icon: School, t: L("For Educational Institutions", "للمؤسسات التعليمية"), d: L("Personalized learning support and potential digital learning programs for students.", "دعم تعلّم شخصي وبرامج تعلّم رقمية محتملة للطلاب."), cta: L("Explore Institutional Partnerships", "اكتشف شراكات المؤسسات"), on: () => onPartner("institution"), tag: L("Pilot programs", "برامج تجريبية") },
    { icon: Building2, t: L("For Companies & HR Teams", "للشركات وفرق الـ HR"), d: L("Online employee training and structured skill-development pathways.", "تدريب أونلاين للموظفين ومسارات تطوير مهارات منظّمة."), cta: L("Discuss Corporate Training", "ناقش التدريب المؤسسي"), on: () => onPartner("training"), tag: L("In development", "قيد التطوير") },
    { icon: Briefcase, t: L("For Employers & Industry", "لأصحاب العمل والصناعة"), d: L("Collaboration around internships, projects, and skills-based talent discovery.", "تعاون في التدريب العملي والمشاريع واكتشاف المواهب بالمهارات."), cta: L("Explore Talent Partnerships", "اكتشف شراكات المواهب"), on: () => onPartner("industry"), tag: L("In development", "قيد التطوير") }
  ];
  return (
    <section id="audiences" className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead eyebrow={L("Who ZEUS Serves", "زيوس بيخدم مين")} title={L("Built for Learners. Designed to Work With Organizations.", "معمول للمتعلّمين. ومصمّم يشتغل مع المؤسسات.")} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map(({ icon: Icon, ...c }) => (
            <div key={c.t} className="flex flex-col p-6 rounded-2xl border border-border/50 bg-card/30 hover:border-zeus-gold/40 transition">
              <div className="flex items-center justify-between mb-5">
                <Icon className="w-6 h-6 text-zeus-gold" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{c.tag}</span>
              </div>
              <h3 className="font-heading font-semibold mb-2">{c.t}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{c.d}</p>
              <button onClick={c.on} className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-zeus-gold hover:gap-2.5 transition-all text-start">{c.cta} <Arrow className="w-4 h-4 shrink-0" /></button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}