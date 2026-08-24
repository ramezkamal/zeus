import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle, Lightbulb, X, Target, Rocket, Users, Briefcase, TrendingUp, Cpu, Flag, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const SLIDES = [
  {
    tag: "01",
    icon: Target,
    title: "The Problem",
    subtitle: "Learning is not the problem. Knowing what to learn, how to learn it, and when you are ready — is.",
    points: [
      "Too many scattered learning resources",
      "One-size-fits-all roadmaps",
      "No accurate assessment of actual skill level",
      "Passive learning with limited practical application",
      "Lack of continuous guidance and feedback",
      "Difficult transition from learning to employment",
    ],
    result: "Learners spend time consuming content without knowing whether they are actually progressing toward their career goals.",
    notes: "المشكلة مش إن المحتوى التعليمي قليل — بالعكس، دلوقتي عندنا كمية محتوى ضخمة. المشكلة إن الطالب مش عارف إيه اللي يناسب مستواه، يبدأ منين، وإمتى يعرف إنه بقى جاهز فعلًا للشغل. الـRoadmaps الموجودة غالبًا ثابتة وبتفترض إن كل الناس عندها نفس المستوى ونفس الاحتياجات. وكمان الطالب ممكن يتفرج على فيديو كامل، لكن مفيش نظام حقيقي يتأكد هو فهم إيه فعلًا وإيه اللي لسه ناقصه. وفوق ده كله، فيه Gap بين إن الطالب \"اتعلم\" Skill وبين إنه يعرف يستخدمها في موقف عملي أو وظيفة حقيقية.",
  },
  {
    tag: "02",
    icon: Sparkles,
    title: "Meet Zeus",
    subtitle: "An AI-powered personalized learning platform that adapts the learning journey to each learner.",
    flow: ["Choose", "Assess", "Learn", "Practice", "Adapt", "Track", "Career-Ready"],
    points: [
      "Personalized & adaptive roadmaps",
      "Skill-level assessment",
      "AI-powered learning support",
      "Practical tasks & assessments",
      "Continuous progress tracking",
      "Soft-skills simulations",
      "Career & job opportunities",
    ],
    valueProp: "The roadmap adapts to the learner — not the learner to the roadmap.",
    notes: "Zeus مش مجرد منصة بتدي الطالب Roadmap وتقول له اتفرج على الفيديوهات دي. الطالب أول ما يحدد الـCareer Track، Zeus بتحدد هو مبتدئ ولا عنده خبرة بالفعل. لو عنده خبرة، مش هنصدقه لمجرد إنه قال \"أنا درست Python\"، لكن هنعمله Assessment متدرج لحد ما نحدد هو فاهم إيه فعلًا وإيه اللي ناقصه. وبعد كده الـRoadmap نفسها بتتغير بناءً على مستواه. ولو الطالب لقى فيديو تاني أفضل بالنسبة له، يقدر يحطه، والـAI يحلل الفيديو ويقارنه بالـLearning Objective ويحدد هل هو كافي ولا فيه أجزاء ناقصة. فإحنا مش بنجبر الطالب يمشي في طريق واحد؛ إحنا بنوصل كل طالب لنفس الـLearning Goal بالطريق الأنسب ليه.",
  },
  {
    tag: "03",
    icon: Users,
    title: "Target Market & Customer",
    subtitle: "Who are we building Zeus for?",
    customers: [
      { name: "University Students", desc: "Students preparing for their future careers." },
      { name: "Fresh Graduates", desc: "Graduates struggling to become job-ready." },
      { name: "Career Switchers", desc: "People transitioning into new career paths." },
    ],
    ideal: "A learner who knows where they want to go, but doesn't know exactly how to get there.",
    needs: ["Clear learning path", "Personalized guidance", "Practical experience", "Proof of skill", "Career direction", "Access to relevant opportunities"],
    notes: "إحنا مش مستهدفين أي شخص بيتعلم Online بشكل عام. الـPrimary Target بتاعنا هو الشباب اللي عندهم Career Goal واضح، لكن مش عارفين يوصلوا له إزاي. زي طالب جامعة عايز يدخل Data Analysis، لكنه محتار يبدأ Python ولا SQL ولا Excel، وإيه المستوى المطلوب أصلًا عشان يقدم على Internship. أو Fresh Graduate اتعلم حاجات كتير، لكن مش عارف هل مستواه فعلًا يسمح له يقدم على وظيفة. Zeus بتاخد الشخص ده من \"أنا عايز أوصل لفين؟\" إلى \"أنا جاهز أقدم على إيه؟\". مهم: هنا لازم نحط نتائج الـIdea Validation الحقيقية اللي عملتوها (Interviews / Surveys / Data) بدل أرقام غير مؤكدة.",
  },
  {
    tag: "04",
    icon: Briefcase,
    title: "Business Model",
    subtitle: "How Zeus Makes Money",
    plans: [
      { name: "B2C — Core Learning Plan", items: ["Personalized Roadmap", "Assessments", "AI Topic Support", "Progress Tracking"] },
      { name: "B2C — Premium Plan", items: ["AI Career Mentor", "Advanced Adaptive Learning", "Career Guidance", "Job Matching"] },
      { name: "Add-on — Soft Skills Training", items: ["Critical Thinking", "Problem Solving", "Strategic Thinking", "Communication", "Decision Making"] },
    ],
    future: "B2B Partnerships — Universities, Educational Institutions, Training Centers",
    notes: "الـBusiness Model الأساسي هو Subscription. الطالب يشترك في الـCore Learning Plan ويحصل على الـPersonalized Roadmap والـAssessments والـAI Support والـProgress Tracking. وفي Premium Plan هنقدم Features أعمق مرتبطة بالـCareer والـAI Mentor والـJob Matching. الـSoft Skills هتكون Plans منفصلة لأن دي مش مجرد فيديوهات إضافية؛ دي تجربة تدريب عملية كاملة، الطالب بيتحط في Scenarios ويمارس المهارة ويأخذ Feedback. ومستقبلًا نقدر ندخل B2B بحيث الجامعات والمؤسسات التعليمية تستخدم Zeus مع طلابها.",
  },
  {
    tag: "05",
    icon: TrendingUp,
    title: "Go-to-Market Strategy",
    subtitle: "From Learner to Career-Ready",
    gtm: [
      "Student Communities — University communities & student organizations",
      "Social Media — Educational & career-focused content",
      "Campus Ambassadors — Student-led acquisition",
      "Partnerships — Universities & educational organizations",
      "Referral Program — Learners invite other learners",
    ],
    traction: ["User interviews", "Survey responses", "Prototype testing", "Beta users", "Waiting list", "Early sign-ups"],
    notes: "في البداية هنركز على University Students لأن الوصول ليهم أسهل من خلال Student Communities والـCampus Ambassadors. هنستخدم Social Media مش بس للإعلانات، لكن نقدم Content يحل مشاكل حقيقية للطلاب وبالتالي نبني Trust مع الـTarget Audience. وبعد كده نقدر نعمل Partnerships مع Universities وEducational Organizations. وبالنسبة للـTraction، هنا لازم نعرض أي دليل حقيقي عندنا إن الناس محتاجة الحل (Interviews / Survey Responses / Prototype Users / Waiting List). لو لسه مفيش Traction قوي، منقولش إن عندنا Traction؛ نعرض الـValidation الموجود بوضوح.",
  },
  {
    tag: "06",
    icon: Cpu,
    title: "Operations & Financials",
    subtitle: "How Zeus Works",
    ops: ["User selects a Career Track", "AI assesses current skill level", "Personalized roadmap is generated", "Learner studies & practices", "AI evaluates progress", "Roadmap adapts automatically", "Career opportunities become accessible"],
    resources: ["Product & Engineering", "AI Infrastructure", "Learning Content", "Learning Design", "Marketing & Sales"],
    costs: ["AI & Cloud Infrastructure", "Product Development", "Content Creation", "Marketing & Customer Acquisition"],
    revenue: "Revenue = Subscribers × Average Subscription Price",
    notes: "تشغيل Zeus قائم على نظام متكامل. الطالب بيحدد الـTrack، وبعدها الـAI يعمل Assessment ويحدد مستواه، وبناءً عليه يبني الـRoadmap. بعد كل Topic فيه Assessment وPractice، والـAI بيستخدم النتائج دي عشان يحدد هل الطالب يكمل ولا محتاج يرجع لجزء معين. أكبر Cost Drivers في البداية هي الـAI Infrastructure والـProduct Development والـContent والـCustomer Acquisition. والـRevenue Model بسيط: عدد الـSubscribers × متوسط سعر الاشتراك = Revenue. هنا نضيف أرقامكم الفعلية للـPricing والـCosts والـFinancial Projection.",
  },
  {
    tag: "07",
    icon: Flag,
    title: "Growth & Fundraising",
    subtitle: "Our Growth Roadmap",
    phases: [
      { p: "Phase 1 — MVP", d: "Launch core learning experience" },
      { p: "Phase 2 — Career Expansion", d: "Add more career tracks" },
      { p: "Phase 3 — Intelligent Adaptation", d: "Improve AI personalization & assessments" },
      { p: "Phase 4 — Skill Simulation", d: "Launch practical soft-skills training" },
      { p: "Phase 5 — Career Ecosystem", d: "Jobs + Career Readiness + B2B" },
    ],
    ask: "We are seeking: [X EGP]",
    funds: ["Product Development", "AI Infrastructure", "Content & Learning Design", "Marketing & User Acquisition", "Team Expansion"],
    notes: "إحنا مش هنبدأ بكل الـFeatures مرة واحدة. الـMVP هيكون مركز على الـCore Learning Experience: Assessment وAdaptive Roadmap وAI Support وProgress Tracking. بعد ما نثبت الـProduct-Market Fit، نبدأ نوسع الـCareer Tracks. بعدها نطور الـAI بحيث يبقى أكثر دقة في فهم مستوى الطالب وتعديل الـRoadmap. ثم نضيف الـSoft Skills Simulation والـCareer Ecosystem والـB2B. والـFunding هيستخدم بشكل أساسي في تطوير المنتج، الـAI Infrastructure، الـContent، والـMarketing واكتساب أول مجموعة كبيرة من المستخدمين.",
  },
  {
    tag: "08",
    icon: Rocket,
    title: "Zeus",
    subtitle: "Learn smarter. Practice better. Become career-ready.",
    manifesto: "We don't build fixed learning paths. We build learning journeys that adapt to people.",
    ask: "[X EGP] Investment — to: Build → Validate → Acquire → Scale",
    notes: "في النهاية، إحنا مش بنحاول نعمل منصة تعليمية جديدة وخلاص. المحتوى التعليمي موجود بالفعل وبكميات ضخمة. المشكلة إن كل شخص بيتعلم بطريقة مختلفة، ومستواه مختلف، وهدفه مختلف — وده السبب اللي خلانا نبني Zeus. Zeus بتخلي الـLearning Journey شخصية، قابلة للتكيف، ومبنية على التطبيق والتقييم المستمر، وفي النهاية مرتبطة بالـCareer الحقيقي. إحنا مش هدفنا إن الطالب يخلص Roadmap. هدفنا إنه يخرج منها جاهز يستخدم اللي اتعلمه في العالم الحقيقي. نقفل بالـAsk: We're looking for [X EGP] to build our MVP, validate the product with our first users, and take Zeus to the next stage.",
  },
];

const WA_MESSAGE = `🚀 *ZEUS — منصة التعلّم الذكية اللي بتبني مسار تعلّم شخصي لكل متعلّم*

*المشكلة:*
المحتوى التعليمي موجود بكميات ضخمة، لكن المتعلّم مش عارف إيه يناسب مستواه، يبدأ منين، وإمتى يبقى جاهز للشغل فعلاً. الـRoadmaps الموجودة ثابتة وبتفترض إن كل الناس نفس المستوى، ومفيش تقييم حقيقي للمهارة ولا توجيه مستمر.

*الحل — ZEUS:*
منصة تعلّم ذكية بتكيّف رحلة التعلّم مع كل متعلّم:
اختيار المسار المهني ← تقييم المستوى ← خريطة تعلّم شخصية ← تعلّم وتطبيق ← الخريطة بتتعدّل أوتوماتيك ← جاهز للسوق.

*القيمة المضافة:*
«الخريطة بتتكيّف مع المتعلّم — مش المتعلّم اللي بيتكيّف مع الخريطة»
• خريطة تعلّم شخصية وتكيّفية
• تقييم مستوى المهارة
• دعم تعلّم بالذكاء الاصطناعي
• مهام وتقييمات عملية
• تتبّع مستمر للتقدّم
• محاكاة المهارات الناعمة
• فرص مهنية وتوظيف

*السوق المستهدف:*
طلاب الجامعات، الخريجين الجدد، والناس اللي بتغيّر مسارها المهني — تحديدًا اللي عارفين عايزين يوصلوا فين بس مش عارفين إزاي.

*الموديل التجاري:*
اشتراك B2C (Core + Premium + Soft Skills) + B2B مستقبلاً مع الجامعات والمؤسسات التعليمية.

*الطلب:*
بنطلب استثمار [X ج.م] لبناء الـMVP، التحقق من المنتج مع أول المستخدمين، والتوسّع للمرحلة الجاية.

*Learn smarter. Practice better. Become career-ready.* 🎯`;

export default function Pitch() {
  const { dir } = useI18n();
  const [i, setI] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [showWA, setShowWA] = useState(false);
  const slide = SLIDES[i];
  const Icon = slide.icon;
  const next = () => setI((p) => Math.min(p + 1, SLIDES.length - 1));
  const prev = () => setI((p) => Math.max(p - 1, 0));

  const shareWA = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(WA_MESSAGE)}`;
    window.open(url, "_blank");
  };

  return (
    <div dir={dir} className="min-h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-card/80 backdrop-blur-xl border-b border-border/60 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-zeus-gold to-zeus-brightgold text-zeus-midnight flex items-center justify-center font-heading font-extrabold text-sm">Z</div>
          <span className="font-heading font-bold tracking-tight">ZEUS <span className="text-muted-foreground font-normal text-xs">Pitch</span></span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowWA(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:opacity-90 transition">
            <MessageCircle style={{ width: 14, height: 14 }} /> واتساب
          </button>
          <span className="text-xs text-muted-foreground tabular-nums">{slide.tag} / 08</span>
        </div>
      </div>

      {/* Slide */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden rounded-3xl zeus-glass p-6 sm:p-8 min-h-[420px] flex flex-col"
            >
              <div className="absolute inset-0 zeus-grid-bg opacity-10 pointer-events-none" />
              <div className="relative flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl bg-zeus-gold/15 flex items-center justify-center shrink-0">
                    <Icon className="text-zeus-gold" style={{ width: 22, height: 22 }} />
                  </div>
                  <div>
                    <div className="text-[11px] text-zeus-gold font-semibold tracking-widest">{slide.tag}</div>
                    <h1 className="font-heading font-extrabold text-xl sm:text-2xl leading-tight">{slide.title}</h1>
                  </div>
                </div>

                {slide.subtitle && <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{slide.subtitle}</p>}

                <SlideBody slide={slide} />

                {/* Speaker notes toggle */}
                <button onClick={() => setShowNotes((s) => !s)} className="mt-5 inline-flex items-center gap-1.5 text-xs text-zeus-brightgold hover:underline self-start">
                  <Lightbulb style={{ width: 13, height: 13 }} /> {showNotes ? "خفّ الشرح" : "شرح الشريحة (للمتحدث)"}
                </button>
                {showNotes && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 p-4 rounded-2xl bg-secondary/30 border border-border/60 text-sm text-muted-foreground leading-relaxed">
                    {slide.notes}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-between mt-5">
            <button onClick={prev} disabled={i === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-border/60 text-sm font-medium hover:bg-secondary/40 transition disabled:opacity-40">
              <ChevronRight style={{ width: 16, height: 16 }} /> السابق
            </button>
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, idx) => (
                <button key={idx} onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === i ? "w-6 bg-zeus-gold" : "w-1.5 bg-secondary/60"}`} />
              ))}
            </div>
            <button onClick={next} disabled={i === SLIDES.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-zeus-gold text-zeus-midnight text-sm font-semibold hover:bg-zeus-brightgold transition disabled:opacity-40">
              التالي <ChevronLeft style={{ width: 16, height: 16 }} />
            </button>
          </div>
        </div>
      </div>

      {/* WhatsApp modal */}
      {showWA && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" dir={dir}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={() => setShowWA(false)} />
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            className="relative w-full max-w-lg zeus-glass p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MessageCircle className="text-[#25D366]" style={{ width: 20, height: 20 }} />
                <h3 className="font-heading font-bold">رسالة واتساب احترافية</h3>
              </div>
              <button onClick={() => setShowWA(false)} className="p-1.5 rounded-full hover:bg-secondary/60"><X style={{ width: 18, height: 18 }} /></button>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed bg-secondary/20 rounded-2xl p-4 mb-4 font-body">{WA_MESSAGE}</pre>
            <div className="flex gap-2">
              <button onClick={shareWA} className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#25D366] text-white font-semibold text-sm hover:opacity-90 transition">
                <MessageCircle style={{ width: 16, height: 16 }} /> افتح في واتساب
              </button>
              <button onClick={() => navigator.clipboard?.writeText(WA_MESSAGE)}
                className="px-4 py-3 rounded-full border border-border/60 text-sm font-medium hover:bg-secondary/40 transition">
                نسخ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function SlideBody({ slide }) {
  return (
    <div className="space-y-4 text-sm">
      {slide.flow && (
        <div className="flex flex-wrap gap-1.5">
          {slide.flow.map((f, idx) => (
            <React.Fragment key={idx}>
              <span className="px-2.5 py-1.5 rounded-full bg-zeus-gold/10 text-zeus-brightgold text-xs font-medium">{f}</span>
              {idx < slide.flow.length - 1 && <span className="text-muted-foreground self-center text-xs">→</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {slide.points && (
        <ul className="space-y-2">
          {slide.points.map((p, idx) => (
            <li key={idx} className="flex gap-2.5 text-foreground/90">
              <span className="block w-1.5 h-1.5 rounded-full bg-zeus-gold mt-1.5 shrink-0" />
              {p}
            </li>
          ))}
        </ul>
      )}

      {slide.result && (
        <div className="p-3.5 rounded-2xl bg-destructive/10 border border-destructive/30 text-foreground/90 text-sm">
          <span className="font-semibold text-destructive">Result: </span>{slide.result}
        </div>
      )}

      {slide.valueProp && (
        <div className="p-4 rounded-2xl bg-zeus-gold/10 border border-zeus-gold/40 text-center">
          <div className="text-[11px] text-zeus-gold font-semibold tracking-widest mb-1">VALUE PROPOSITION</div>
          <div className="font-heading font-bold text-base zeus-gold-text">{slide.valueProp}</div>
        </div>
      )}

      {slide.customers && (
        <div className="grid sm:grid-cols-3 gap-2.5">
          {slide.customers.map((c, idx) => (
            <div key={idx} className="p-3 rounded-2xl bg-secondary/30 border border-border/60">
              <div className="font-heading font-bold text-sm text-zeus-brightgold">{c.name}</div>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.desc}</div>
            </div>
          ))}
        </div>
      )}

      {slide.ideal && (
        <div className="p-3.5 rounded-2xl bg-secondary/20 border border-border/60">
          <div className="text-[11px] text-muted-foreground font-semibold mb-1">IDEAL CUSTOMER</div>
          <div className="text-sm font-medium">{slide.ideal}</div>
        </div>
      )}

      {slide.needs && (
        <div className="flex flex-wrap gap-1.5">
          {slide.needs.map((n, idx) => (
            <span key={idx} className="px-2.5 py-1.5 rounded-full bg-secondary/40 text-foreground/80 text-xs">{n}</span>
          ))}
        </div>
      )}

      {slide.plans && (
        <div className="space-y-2.5">
          {slide.plans.map((pl, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-secondary/30 border border-border/60">
              <div className="font-heading font-bold text-sm text-zeus-brightgold mb-2">{pl.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {pl.items.map((it, j) => (
                  <span key={j} className="px-2 py-1 rounded-full bg-secondary/50 text-xs text-foreground/80">{it}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {slide.future && (
        <div className="p-3.5 rounded-2xl bg-zeus-gold/10 border border-zeus-gold/40 text-sm">
          <span className="text-[11px] text-zeus-gold font-semibold tracking-widest">FUTURE · </span>{slide.future}
        </div>
      )}

      {slide.gtm && (
        <ol className="space-y-2">
          {slide.gtm.map((g, idx) => (
            <li key={idx} className="flex gap-2.5 text-foreground/90">
              <span className="w-5 h-5 rounded-full bg-zeus-gold/15 text-zeus-gold text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
              <span>{g}</span>
            </li>
          ))}
        </ol>
      )}

      {slide.traction && (
        <div>
          <div className="text-[11px] text-muted-foreground font-semibold mb-2">TRACTION</div>
          <div className="flex flex-wrap gap-1.5">
            {slide.traction.map((tr, idx) => (
              <span key={idx} className="px-2.5 py-1.5 rounded-full bg-secondary/40 text-xs text-foreground/80">{tr}</span>
            ))}
          </div>
        </div>
      )}

      {slide.ops && (
        <div className="space-y-1.5">
          {slide.ops.map((o, idx) => (
            <div key={idx} className="flex items-center gap-2 text-foreground/90">
              <span className="w-5 h-5 rounded-full bg-zeus-gold/15 text-zeus-gold text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
              <span>{o}</span>
              {idx < slide.ops.length - 1 && <span className="text-zeus-gold/50">↓</span>}
            </div>
          ))}
        </div>
      )}

      {slide.resources && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {slide.resources.map((r, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-secondary/30 border border-border/60 text-xs text-center font-medium">{r}</div>
          ))}
        </div>
      )}

      {slide.costs && (
        <div>
          <div className="text-[11px] text-muted-foreground font-semibold mb-2">MAIN COSTS</div>
          <div className="flex flex-wrap gap-1.5">
            {slide.costs.map((c, idx) => (
              <span key={idx} className="px-2.5 py-1.5 rounded-full bg-destructive/10 border border-destructive/30 text-xs text-foreground/80">{c}</span>
            ))}
          </div>
        </div>
      )}

      {slide.revenue && (
        <div className="p-3.5 rounded-2xl bg-zeus-gold/10 border border-zeus-gold/40 text-center font-heading font-bold text-zeus-brightgold">{slide.revenue}</div>
      )}

      {slide.phases && (
        <div className="space-y-2">
          {slide.phases.map((ph, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-full bg-zeus-gold text-zeus-midnight text-xs font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
              <div>
                <div className="font-heading font-bold text-sm text-zeus-brightgold">{ph.p}</div>
                <div className="text-xs text-muted-foreground">{ph.d}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {slide.funds && (
        <div className="flex flex-wrap gap-1.5">
          {slide.funds.map((f, idx) => (
            <span key={idx} className="px-2.5 py-1.5 rounded-full bg-secondary/40 text-xs text-foreground/80">{f}</span>
          ))}
        </div>
      )}

      {slide.ask && (
        <div className="p-4 rounded-2xl bg-zeus-gold/10 border border-zeus-gold/40 text-center font-heading font-bold text-zeus-brightgold">{slide.ask}</div>
      )}

      {slide.manifesto && (
        <div className="p-4 rounded-2xl bg-secondary/30 border border-border/60 text-center font-heading font-semibold text-base leading-relaxed">
          {slide.manifesto}
        </div>
      )}
    </div>
  );
}