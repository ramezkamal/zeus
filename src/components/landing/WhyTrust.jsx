import React from "react";
import { User, Compass, ListChecks, TrendingUp, Hammer, ShieldCheck, Lock, Eye, SlidersHorizontal, Scale, RefreshCw } from "lucide-react";
import SectionHead from "@/components/landing/SectionHead";
import useL from "@/components/landing/useL";

export default function WhyTrust() {
  const { L } = useL();
  const WHY = [
    { icon: User, t: L("Learner-first personalization", "تخصيص بيبدأ منك") },
    { icon: Compass, t: L("Learning connected to career direction", "تعلّم مربوط بمسارك المهني") },
    { icon: ListChecks, t: L("Structured next steps", "خطوات جاية واضحة") },
    { icon: TrendingUp, t: L("Progress-informed recommendations", "توصيات مبنية على تقدّمك") },
    { icon: Hammer, t: L("Practical skill development", "تطوير مهارات عملي") },
    { icon: ShieldCheck, t: L("Responsible AI principles", "ذكاء اصطناعي مسؤول") }
  ];
  const TRUST = [
    { icon: Lock, t: L("Privacy-conscious design", "تصميم يحترم الخصوصية"), d: L("Your learning data is private to your account by default.", "بياناتك خاصة بحسابك بشكل افتراضي.") },
    { icon: Eye, t: L("Transparent recommendations", "توصيات شفافة"), d: L("Career paths come with the reasons they fit you.", "كل مسار مهني بييجي معاه سبب إنه مناسب ليك.") },
    { icon: SlidersHorizontal, t: L("You stay in control", "إنت المتحكم"), d: L("Edit your profile and change your goals at any time.", "عدّل ملفك وغيّر أهدافك في أي وقت.") },
    { icon: Scale, t: L("Fairness by intent", "عدالة مقصودة"), d: L("Guidance supports decisions — it doesn't make them for you.", "التوجيه بيساعدك تقرر — مش بيقرر بدالك.") },
    { icon: RefreshCw, t: L("Continuous improvement", "تطوير مستمر"), d: L("The product evolves based on learner feedback.", "المنتج بيتطوّر من آراء المتعلّمين.") }
  ];
  return (
    <>
      <section id="why" className="py-24 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5">
          <SectionHead eyebrow={L("Why ZEUS", "ليه زيوس")} title={L("More Than Content. A Clearer Way Forward.", "أكتر من محتوى. طريق أوضح لقدّام.")} desc={L("An early-stage Egyptian EdTech initiative with a working platform tested by university students.", "مبادرة EdTech مصرية في مرحلتها الأولى، بمنصة شغّالة جرّبها طلاب جامعات.")} />
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
          <SectionHead eyebrow={L("Trust & Responsible AI", "الثقة والذكاء الاصطناعي المسؤول")} title={L("AI that informs, never decides for you.", "ذكاء اصطناعي بيوضّحلك، مش بيقرر بدالك.")} />
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