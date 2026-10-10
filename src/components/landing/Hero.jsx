import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import useL from "@/components/landing/useL";

const ROBOT = "https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/636863135_generated_image.png";

export default function Hero({ onStart, onPartner }) {
  const { L, isAr } = useL();
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const FLOW = [L("Understand", "افهم"), L("Personalize", "خصّص"), L("Learn", "اتعلّم"), L("Build", "ابني"), L("Launch", "انطلق")];
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0 zeus-grid-bg opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" />
      <div className="relative max-w-7xl mx-auto px-5 pt-16 pb-20 lg:pt-24 lg:pb-24 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
        <div className="animate-fade-up">
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-zeus-gold mb-5">Think Fast. Think Smart.</div>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.15] tracking-tight">
            {L("Turn Learning Into Direction.", "حوّل التعلّم لاتجاه واضح.")}<br /><span className="zeus-gold-text">{L("Turn Skills Into Opportunity.", "وحوّل مهاراتك لفرص حقيقية.")}</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl leading-relaxed">
            {L("ZEUS is an AI-powered learning and career development platform that helps learners build personalized roadmaps while enabling organizations to deliver smarter training and connect learning with real-world opportunities.",
              "زيوس منصة تعلّم وتطوير مهني بالذكاء الاصطناعي، بتساعد المتعلّم يبني مسار شخصي، وبتمكّن المؤسسات تقدّم تدريب أذكى وتربط التعلّم بفرص حقيقية في سوق العمل.")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={onStart} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold">
              {L("Start Your Journey", "ابدأ رحلتك")} <Arrow className="w-4 h-4" />
            </button>
            <button onClick={onPartner} className="px-6 py-3.5 rounded-full border border-border bg-card/40 font-medium hover:border-zeus-gold/60 transition">{L("Partner With ZEUS", "اعمل شراكة مع زيوس")}</button>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-2 text-xs">
            {FLOW.map((s, i) => (
              <React.Fragment key={s}>
                <span className="px-3 py-1.5 rounded-full border border-zeus-gold/25 bg-zeus-gold/5 text-foreground/90">{s}</span>
                {i < FLOW.length - 1 && <span className="text-zeus-gold/50">{isAr ? "←" : "→"}</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="relative animate-fade-in">
          <div className="absolute inset-8 -z-10 blur-3xl bg-zeus-gold/15 rounded-full" />
          <img src={ROBOT} alt="ZEUS" className="w-full max-w-md mx-auto rounded-3xl border border-border/40 shadow-2xl" />
        </div>
      </div>
    </section>
  );
}