import React from "react";
import SectionHead from "@/components/landing/SectionHead";
import useL from "@/components/landing/useL";

export default function Partnerships({ onPartner }) {
  const { L } = useL();
  const CARDS = [
    { type: "industry", t: L("Employment & Industry", "التوظيف والصناعة"), s: L("Help connect learning with the real market.", "ساعدنا نربط التعلّم بالسوق الحقيقي."), items: [L("Share internships and relevant job opportunities", "شارك فرص تدريب ووظائف مناسبة"), L("Define relevant skill requirements", "حدد المهارات المطلوبة"), L("Explore project-based collaboration", "تعاون في مشاريع عملية"), L("Discover candidates by demonstrated skills", "اكتشف مرشحين بمهارات مثبتة")], cta: L("Become an Industry Partner", "كن شريك صناعة") },
    { type: "training", t: L("Education & Corporate Training", "التعليم والتدريب المؤسسي"), s: L("Personalized digital learning for students and employees.", "تعلّم رقمي مخصّص للطلاب والموظفين."), items: [L("Educational and university pilots", "برامج تجريبية في الجامعات"), L("Corporate online training programs", "برامج تدريب أونلاين للشركات"), L("Structured skill-development pathways", "مسارات تطوير مهارات منظّمة"), L("Co-developed learning initiatives", "مبادرات تعلّم مشتركة")], cta: L("Discuss a Training Partnership", "ناقش شراكة تدريب") },
    { type: "technology", t: L("Technology", "التكنولوجيا"), s: L("Support the technology that enables ZEUS to evolve.", "ادعم التكنولوجيا اللي بتطوّر زيوس."), items: [L("AI and software services", "خدمات ذكاء اصطناعي وبرمجيات"), L("Cloud and infrastructure capabilities", "سحابة وبنية تحتية"), L("Technical integrations", "تكاملات تقنية"), L("Developer tools and expertise", "أدوات وخبرات للمطورين")], cta: L("Explore Technology Partnerships", "اكتشف الشراكات التقنية") }
  ];
  return (
    <section id="partnerships" className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead eyebrow={L("Partnership Opportunities", "فرص الشراكة")} title={L("Different Goals. One Learning Ecosystem.", "أهداف مختلفة. منظومة تعلّم واحدة.")} desc={L("Open collaboration opportunities — we're actively looking for partners in each area.", "فرص تعاون مفتوحة — بندوّر على شركاء في كل مجال.")} />
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