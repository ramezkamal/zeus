import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles, Brain, Map, BookOpen, TrendingUp, Rocket, Briefcase, Users, Zap, CheckCircle2, Quote } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { base44 } from "@/api/base44Client";
import Logo from "@/components/zeus/Logo";
import LanguageToggle from "@/components/zeus/LanguageToggle";

const PROBLEMS_AR = [
  "ميدريش يبدأ منين",
  "ميعرفش يتعلم إيه بالظبط",
  "إيه المهم وإيه اللي يتعبر",
  "أنهي مصادر فعلاً مفيدة",
  "إزاي يفضل ملتزم",
  "إزاي يحوّل التعلّم لفرصة شغل حقيقية"
];

const STEPS_AR = [
  { icon: Sparkles, title: "اقابل ZEUS", desc: "تقابل رفيقك الذكي اللي هيمشي معاك خطوة بخطوة." },
  { icon: Brain, title: "اكتشف نفسك", desc: "محادثة طبيعية نفهم منها إنت مين وإزاي بتتعلّم." },
  { icon: Map, title: "ابني خريطتك", desc: "خريطة مخصصة لهدفك ومستواك ووقتك." },
  { icon: BookOpen, title: "تعلّم بإرشاد", desc: "مهام ومصادر مختارة بعناية لكل مرحلة." },
  { icon: TrendingUp, title: "تابع تقدّمك", desc: "شوف تطورك ومهاراتك بيتزرموا إزاي." },
  { icon: Rocket, title: "ابني مشاريع حقيقية", desc: "مشاريع عملية تثبت مهاراتك." },
  { icon: Briefcase, title: "أطلق مسارك المهني", desc: "سيرة ذاتية وفرص شغل متطابقة معاك." }
];

export default function Landing() {
  const { t, lang, dir } = useI18n();
  const nav = useNavigate();
  const isAr = lang === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => { if (authed) nav("/app", { replace: true }); });
  }, [nav]);

  const start = async () => {
    const authed = await base44.auth.isAuthenticated();
    nav(authed ? "/app" : "/register");
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen" dir={dir}>
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/40">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <button onClick={start} className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zeus-gold text-zeus-midnight text-sm font-semibold hover:bg-zeus-brightgold transition shadow-gold-sm">
              {t("landing.cta.start")} <Arrow style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 zeus-grid-bg opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_30%,black,transparent)]" />
        <div className="relative max-w-7xl mx-auto px-5 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zeus-gold/30 bg-zeus-gold/10 text-zeus-brightgold text-xs font-medium mb-6">
              <Zap style={{ width: 14, height: 14 }} /> {isAr ? "رفيقك الذكي في التعلّم والمسار المهني" : "Your smart learning & career companion"}
            </div>
            <div className="font-heading text-zeus-cloud/50 text-[11px] tracking-[0.34em] uppercase mb-6">
              {isAr ? "مسارك. مرفوع بالذكاء الاصطناعي." : "Your Path. Elevated by AI."}
            </div>
            <h1 className="font-heading font-extrabold text-4xl lg:text-6xl leading-[1.1] tracking-tight">
              {isAr ? (
                <>رحلة تعلّمك. <span className="zeus-gold-text">مصمّمة حوالينك.</span></>
              ) : (
                <>Your Learning Journey. <span className="zeus-gold-text">Engineered Around You.</span></>
              )}
            </h1>
            <p className="mt-5 text-muted-foreground text-lg max-w-xl leading-relaxed">
              {t("landing.hero.sub")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button onClick={start} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold">
                {t("landing.cta.start")} <Arrow style={{ width: 18, height: 18 }} />
              </button>
              <button onClick={() => scrollTo("how")} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-border bg-card/50 hover:zeus-gold-border transition font-medium">
                {t("landing.cta.how")}
              </button>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="text-zeus-gold" style={{ width: 16, height: 16 }} /> {isAr ? "تعلّم مخصص" : "Personalized"}</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-zeus-gold" style={{ width: 16, height: 16 }} /> {isAr ? "خريطة حية" : "Adaptive roadmap"}</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="text-zeus-gold" style={{ width: 16, height: 16 }} /> {isAr ? "مجتمع متلائم" : "Smart community"}</div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative animate-fade-in">
            <HeroVisual isAr={isAr} />
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5">
          <SectionTitle eyebrow={isAr ? "ليه ZEUS" : "Why ZEUS"} title={t("landing.problem.title")} />
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mt-3">
            {isAr ? "الناس اللي بتتعلّم بتواجه تحديات حقيقية:" : "Learners face real challenges:"}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {(isAr ? PROBLEMS_AR : [
              "Don't know where to start","Don't know what to learn","What to skip","Which resources are useful","How to stay consistent","How to turn learning into a career"
            ]).map((p, i) => (
              <div key={i} className="zeus-glass p-5 flex items-start gap-3 hover:zeus-gold-border transition">
                <span className="w-7 h-7 shrink-0 rounded-lg bg-destructive/15 text-destructive flex items-center justify-center text-sm font-bold">!</span>
                <span className="text-foreground/90">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="py-20 border-t border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 zeus-grid-bg opacity-20" />
        <div className="relative max-w-6xl mx-auto px-5">
          <SectionTitle eyebrow={isAr ? "الحل" : "The Solution"} title={t("landing.solution.title")} />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {[
              { icon: Brain, label: isAr ? "افهم" : "Understand" },
              { icon: Map, label: isAr ? "خطط" : "Plan" },
              { icon: BookOpen, label: isAr ? "تعلّم" : "Learn" },
              { icon: TrendingUp, label: isAr ? "تابع" : "Track" },
              { icon: Rocket, label: isAr ? "ابني" : "Build" },
              { icon: Briefcase, label: isAr ? "مسار مهني" : "Career" }
            ].map((s, i, arr) => {
              const Icon = s.icon;
              return (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-2 px-5 py-4 rounded-2xl zeus-glass min-w-[110px] hover:zeus-gold-border transition">
                    <Icon className="text-zeus-gold" style={{ width: 26, height: 26 }} />
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                  {i < arr.length - 1 && <Arrow className="text-zeus-gold/50 hidden sm:block" style={{ width: 20, height: 20 }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5">
          <SectionTitle eyebrow={isAr ? "إزاي بيشتغل" : "How it works"} title={t("landing.how.title")} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {(isAr ? STEPS_AR : STEPS_AR.map((s) => ({ ...s, title: enStep(s.title), desc: enStepDesc(s.title) }))).map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative zeus-glass p-6 hover:zeus-gold-border transition group">
                  <span className="absolute top-4 end-4 text-5xl font-heading font-extrabold text-zeus-gold/10 group-hover:text-zeus-gold/20 transition">{i + 1}</span>
                  <div className="w-12 h-12 rounded-xl bg-zeus-gold/15 flex items-center justify-center mb-4">
                    <Icon className="text-zeus-gold" style={{ width: 24, height: 24 }} />
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-1.5">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community */}
      <section className="py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionTitle align="start" eyebrow={isAr ? "مجتمع ذكي" : "Smart Community"} title={t("landing.community.title")} />
            <p className="text-muted-foreground mt-4 leading-relaxed">
              {isAr
                ? "ZEUS بيربط المتعلّمين اللي ليهم نفس الهدف ونفس المرحلة ونفس مستوى المهارة في مجتمعات تعلّم صغيرة — عشان تتعلموا سوا، تشاركوا مصادر، وتحتفلوا بالإنجازات."
                : "ZEUS connects learners with the same goal, stage, and skill level into small learning communities — to learn together, share resources, and celebrate milestones."}
            </p>
            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {["#FFC107","#FFD54F","#FFE9A3","#3B4A66"].map((c, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-white font-bold text-xs" style={{ background: c }}>{["A","M","S","K"][i]}</div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{isAr ? "+24 متعلّم على نفس المسار" : "+24 learners on the same path"}</span>
            </div>
          </div>
          <CommunityCard isAr={isAr} />
        </div>
      </section>

      {/* Career */}
      <section className="py-20 border-t border-border/40">
        <div className="max-w-6xl mx-auto px-5">
          <SectionTitle eyebrow={isAr ? "من التعلّم للشغل" : "Learning to Career"} title={t("landing.career.title")} />
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-sm">
            {[
              { icon: BookOpen, label: isAr ? "تعلّم" : "Learn" },
              { icon: Rocket, label: isAr ? "مشاريع" : "Projects" },
              { icon: Briefcase, label: isAr ? "سيرة ذاتية" : "CV" },
              { icon: CheckCircle2, label: isAr ? "فرص شغل" : "Opportunities" }
            ].map((s, i, arr) => {
              const Icon = s.icon;
              return (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-2 px-5 py-3 rounded-full zeus-gold-border bg-zeus-gold/5">
                    <Icon className="text-zeus-gold" style={{ width: 18, height: 18 }} />
                    <span className="font-medium">{s.label}</span>
                  </div>
                  {i < arr.length - 1 && <Arrow className="text-zeus-gold/40" style={{ width: 18, height: 18 }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 border-t border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zeus-gold/5 to-transparent" />
        <div className="relative max-w-3xl mx-auto px-5 text-center">
          <Quote className="text-zeus-gold/40 mx-auto mb-6" style={{ width: 40, height: 40 }} />
          <h2 className="font-heading font-extrabold text-3xl lg:text-5xl leading-tight">
            {isAr ? <>مسارك مختلف. <span className="zeus-gold-text">خريطتك المفروض تكون كمان.</span></> : <><span className="zeus-gold-text">Your path is different.</span> Your roadmap should be too.</>}
          </h2>
          <button onClick={start} className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold text-lg">
            {t("landing.final.cta")} <Arrow style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </section>

      <footer className="border-t border-border/40 py-10">
        <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={28} />
          <p className="text-xs text-muted-foreground">ZEUS — {t("brand.tagline")}</p>
          <LanguageToggle />
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title, align = "center" }) {
  return (
    <div className={align === "center" ? "text-center" : "text-start"}>
      <div className="text-zeus-gold text-sm font-semibold uppercase tracking-wider mb-2">{eyebrow}</div>
      <h2 className="font-heading font-extrabold text-3xl lg:text-4xl">{title}</h2>
    </div>
  );
}

function HeroVisual({ isAr }) {
  const nodes = [
    { x: 50, y: 8, label: isAr ? "إنت" : "You", top: true },
    { x: 50, y: 30, label: "ZEUS AI" },
    { x: 50, y: 52, label: isAr ? "خريطتك" : "Roadmap" },
    { x: 50, y: 74, label: isAr ? "تقدّم" : "Progress" },
    { x: 50, y: 94, label: isAr ? "مسار مهني" : "Career", bottom: true }
  ];
  return (
    <div className="relative aspect-[4/5] max-w-md mx-auto">
      <div className="absolute inset-0 rounded-3xl zeus-glass zeus-grid-bg overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <line x1="50" y1="14" x2="50" y2="26" stroke="#FFC107" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
          <line x1="50" y1="36" x2="50" y2="48" stroke="#FFC107" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
          <line x1="50" y1="58" x2="50" y2="70" stroke="#FFC107" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
          <line x1="50" y1="80" x2="50" y2="90" stroke="#FFC107" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.6" />
        </svg>
        {nodes.map((n, i) => (
          <div key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 animate-fade-up"
            style={{ left: `${n.x}%`, top: `${n.y}%`, animationDelay: `${i * 0.15}s` }}>
            <div className={`px-4 py-2.5 rounded-xl border whitespace-nowrap text-sm font-medium ${n.top || n.bottom ? "bg-zeus-gold text-zeus-midnight border-zeus-gold shadow-gold" : "bg-card/80 border-zeus-gold/30 text-foreground"}`}>
              {n.label}
            </div>
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </div>
    </div>
  );
}

function CommunityCard({ isAr }) {
  return (
    <div className="zeus-glass p-6 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-muted-foreground">{isAr ? "مجتمع" : "Community"}</div>
          <div className="font-heading font-bold">{isAr ? "هندسة الذكاء الاصطناعي — مسار المبتدئين" : "AI Engineering — Beginner Track"}</div>
        </div>
        <div className="text-zeus-gold font-bold text-2xl">94%</div>
      </div>
      <div className="space-y-3">
        {[["Python", 82], ["Math", 54], ["ML", 31]].map(([k, v]) => (
          <div key={k}>
            <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="text-muted-foreground">{v}%</span></div>
            <div className="h-2 rounded-full bg-secondary/60 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-zeus-gold to-zeus-brightgold rounded-full" style={{ width: `${v}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
        <Users style={{ width: 14, height: 14 }} className="text-zeus-gold" /> {isAr ? "24 متعلّم على نفس المرحلة" : "24 learners at the same stage"}
      </div>
    </div>
  );
}

function enStep(ar) {
  const map = { "اقابل ZEUS":"Meet ZEUS","اكتشف نفسك":"Discover Yourself","ابني خريطتك":"Build Your Roadmap","تعلّم بإرشاد":"Learn With Guidance","تابع تقدّمك":"Track Your Progress","ابني مشاريع حقيقية":"Build Real Projects","أطلق مسارك المهني":"Launch Your Career" };
  return map[ar] || ar;
}
function enStepDesc(ar) {
  const map = {
    "اقابل ZEUS":"Meet your AI companion that walks with you step by step.",
    "اكتشف نفسك":"A natural conversation that reveals who you are and how you learn.",
    "ابني خريطتك":"A roadmap tailored to your goal, level, and time.",
    "تعلّم بإرشاد":"Curated tasks and resources for each phase.",
    "تابع تقدّمك":"See your progress and skills grow.",
    "ابني مشاريع حقيقية":"Hands-on projects that prove your skills.",
    "أطلق مسارك المهني":"A CV and job opportunities matched to you."
  };
  return map[ar] || "";
}