import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Brain, Map, Target, Gauge, Rocket, ArrowLeft, ArrowRight, Check, Loader2, Pencil } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/ProfileContext";
import Logo from "@/components/zeus/Logo";
import LanguageToggle from "@/components/zeus/LanguageToggle";
import ChatPanel from "@/components/zeus/ChatPanel";
import DnaSummary from "@/components/zeus/onboarding/DnaSummary";
import RoadmapReveal from "@/components/zeus/onboarding/RoadmapReveal";

const STEPS = [
  { key: "naming", icon: Sparkles, labelKey: "onb.discover.title" },
  { key: "discovery", icon: Brain, labelKey: "onb.discover.title" },
  { key: "dna", icon: Brain, labelKey: "onb.dna.title" },
  { key: "goal", icon: Target, labelKey: "onb.goal.title" },
  { key: "assessment", icon: Gauge, labelKey: "onb.assess.title" },
  { key: "roadmap", icon: Map, labelKey: "onb.roadmap.title" }
];

const welcomeMessage = (name, isAr) => isAr
  ? `أهلًا يا ${name} 👋 خلينا نفهمك الأول قبل ما نحدد هتتعلم إيه. عايز أفهم إنت مين، إيه اللي نفسك تتعلمه، وإيه المشاكل اللي واقفة قدامك. احكيلي براحتك.`
  : `Hey ${name} 👋 Let's understand you first before deciding what to learn. Tell me — who you are, what you want to learn, and what's holding you back. Just talk freely.`;

export default function Onboarding() {
  const { t, lang, dir } = useI18n();
  const { profile, loading, createProfile, updateProfile } = useProfile();
  const nav = useNavigate();
  const isAr = lang === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;

  const [step, setStep] = useState("naming");
  const [companionName, setCompanionName] = useState("");
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [recs, setRecs] = useState(null);
  const [keySkills, setKeySkills] = useState([]);
  const [skillLevels, setSkillLevels] = useState({});
  const [roadmapPreview, setRoadmapPreview] = useState(null);
  const [skillsText, setSkillsText] = useState("");
  const [building, setBuilding] = useState(false);

  useEffect(() => {
    if (loading || !profile) return;
    setStep(profile.onboarding_step || "naming");
    setCompanionName(profile.companion_name || "");
    if (profile.onboarding_step === "done") { nav("/app", { replace: true }); return; }
    if (profile.onboarding_step === "discovery") {
      (async () => {
        const name = profile.companion_name || t("onb.name.default");
        const existing = await base44.entities.Conversation.filter({ type: "discovery" }, "-created_date", 1);
        if (existing.length) {
          setConversation(existing[0]);
          setMessages(existing[0].messages || []);
        } else {
          const convo = await base44.entities.Conversation.create({
            type: "discovery", companion_name: name,
            messages: [{ role: "assistant", content: welcomeMessage(name, isAr), ts: new Date().toISOString() }]
          });
          setConversation(convo);
          setMessages(convo.messages);
        }
      })();
    }
  }, [profile, loading, nav]);

  const goto = async (nextStep, patch = {}) => {
    if (profile) await updateProfile({ onboarding_step: nextStep, ...patch });
    setStep(nextStep);
  };

  const skipToDashboard = async () => {
    if (profile) await updateProfile({ onboarding_step: "done" });
    nav("/app", { replace: true });
  };

  // ---------- Naming ----------
  const submitName = async () => {
    const name = companionName.trim() || t("onb.name.default");
    let p;
    if (profile) {
      p = await updateProfile({ companion_name: name, onboarding_step: "discovery" });
    } else {
      p = await createProfile({ companion_name: name, onboarding_step: "discovery" });
    }
    const convo = await base44.entities.Conversation.create({
      type: "discovery", companion_name: name,
      messages: [{ role: "assistant", content: welcomeMessage(name, isAr), ts: new Date().toISOString() }]
    });
    setConversation(convo);
    setMessages(convo.messages);
    setStep("discovery");
  };

  // ---------- Discovery ----------
  const sendDiscovery = async (text) => {
    const userMsg = { role: "user", content: text, ts: new Date().toISOString() };
    const next = [...messages, userMsg];
    setMessages(next);
    setTyping(true);
    try {
      const res = await base44.functions.invoke("discoveryChat", {
        messages: next.map((m) => ({ role: m.role, content: m.content })),
        profile: profile, companionName: companionName, lang
      });
      const data = res.data || res;
      const aiMsg = { role: "assistant", content: data.reply, ts: new Date().toISOString() };
      const updated = [...next, aiMsg];
      setMessages(updated);
      await base44.entities.Conversation.update(conversation.id, { messages: updated });
      if (data.isComplete && data.profile) {
        const clean = Object.fromEntries(Object.entries(data.profile).filter(([, v]) => v !== null && v !== undefined && v !== ""));
        await updateProfile({ ...clean, onboarding_step: "dna" });
        setStep("dna");
      }
    } catch (e) {
      setMessages([...next, { role: "assistant", content: isAr ? "حصل خطأ صغير، جرّب تاني 🙏" : "A small error occurred, please try again 🙏", ts: new Date().toISOString() }]);
    } finally {
      setTyping(false);
    }
  };

  // ---------- Goal ----------
  const loadGoals = useCallback(async () => {
    if (recs || !profile) return;
    setTyping(true);
    try {
      const res = await base44.functions.invoke("recommendGoals", { profile, goal: profile.goal, lang });
      const data = res.data || res;
      setRecs(data);
      setKeySkills(data.key_skills || []);
    } catch (e) {
    } finally {
      setTyping(false);
    }
  }, [profile, recs, lang]);

  useEffect(() => { if (step === "goal") loadGoals(); }, [step, loadGoals]);

  const pickGoal = async (goal) => {
    await updateProfile({ goal, goal_recommendations: recs?.recommendations || [], onboarding_step: "assessment" });
    setStep("assessment");
  };

  // ---------- Assessment ----------
  const submitSkills = async () => {
    const graph = keySkills.map((s) => ({ skill: s, level: skillLevels[s] ?? 50 }));
    await updateProfile({ skill_graph: graph, strengths: skillsText.trim() || undefined, onboarding_step: "roadmap" });
    setStep("roadmap");
  };

  // ---------- Roadmap ----------
  const loadRoadmap = useCallback(async () => {
    if (roadmapPreview || !profile) return;
    setTyping(true);
    try {
      const res = await base44.functions.invoke("generateRoadmap", { profile, goal: profile.goal, lang });
      setRoadmapPreview((res.data || res));
    } catch (e) {
    } finally {
      setTyping(false);
    }
  }, [profile, roadmapPreview, lang]);

  useEffect(() => { if (step === "roadmap") loadRoadmap(); }, [step, loadRoadmap]);

  const buildRoadmap = async () => {
    setBuilding(true);
    try {
      const nodes = roadmapPreview?.nodes || [];
      const roadmap = await base44.entities.Roadmap.create({ goal: profile.goal, version: 1, status: "active", nodes });
      // create tasks for the first phase
      const firstPhase = nodes.filter((n) => n.phase === 1);
      const tasks = [];
      firstPhase.forEach((node) => {
        (node.tasks || []).forEach((taskTitle, i) => {
          tasks.push({ title: taskTitle, node_id: node.id, node_title: node.title, status: "todo", estimated_minutes: Math.round((node.estimated_hours || 4) * 60 / Math.max(1, (node.tasks || []).length)), difficulty: "medium", order: tasks.length });
        });
      });
      if (tasks.length) await base44.entities.Task.bulkCreate(tasks);
      // Generate study schedule
      await base44.functions.invoke("generateSchedule", { roadmapId: roadmap.id, availableDays: profile.available_days || [], lang });
      // welcome notification
      await base44.entities.Notification.create({
        type: "ai", title: isAr ? "خريطتك جاهزة! 🎉" : "Your roadmap is ready! 🎉",
        body: isAr ? `بدأنا رحلتك نحو "${profile.goal}". أول مهامك مستنية في تبويب تعلّم.` : `Your journey toward "${profile.goal}" started. Your first tasks are waiting in Learn.`,
        action_label: isAr ? "ابدأ" : "Start", action_url: "/learn"
      });
      await updateProfile({ onboarding_step: "done" });
      nav("/app", { replace: true });
    } catch (e) {
    } finally {
      setBuilding(false);
    }
  };

  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center"><div className="w-9 h-9 border-4 border-zeus-gold/30 border-t-zeus-gold rounded-full animate-spin" /></div>;
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden" dir={dir}>
      <header className="h-16 border-b border-border/40 bg-background/70 backdrop-blur-xl flex items-center justify-between px-5">
        <Logo size={30} />
        <div className="flex items-center gap-3">
          <button onClick={skipToDashboard} className="text-xs text-muted-foreground hover:text-zeus-brightgold transition px-3 py-1.5 rounded-full border border-border/40 hover:border-zeus-gold/40">
            {isAr ? "تخطّي للوحة التحكم" : "Skip to dashboard"}
          </button>
          <LanguageToggle />
        </div>
      </header>

      {/* Step indicator */}
      <div className="px-5 py-4 border-b border-border/40">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold transition ${
                    active ? "bg-zeus-gold text-zeus-midnight shadow-gold scale-110" : done ? "bg-zeus-gold/20 text-zeus-brightgold" : "bg-secondary/50 text-muted-foreground"
                  }`}>
                    {done ? <Check style={{ width: 16, height: 16 }} /> : <Icon style={{ width: 16, height: 16 }} />}
                  </div>
                  <span className={`text-[10px] hidden sm:block ${active ? "text-zeus-brightgold font-medium" : "text-muted-foreground"}`}>{t(s.labelKey)}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < stepIndex ? "bg-zeus-gold/40" : "bg-border/60"}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <main className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full max-w-2xl">
          {step === "naming" && <NamingStep name={companionName} setName={setCompanionName} onSubmit={submitName} t={t} isAr={isAr} Arrow={Arrow} />}
          {step === "discovery" && (
            <div className="zeus-glass p-4 sm:p-5 h-[58vh] sm:h-[60vh] flex flex-col">
              <div className="mb-3 pb-3 border-b border-border/60 flex items-center gap-3">
                <img src="https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/d926a568e_image-removebg-preview1.png" alt="Zeus" className="w-10 h-10 rounded-full object-cover object-top shrink-0" />
                <div>
                  <div className="font-heading font-bold text-lg">{companionName || t("onb.name.default")} — {isAr ? "رفيقك في التعلّم" : "Your Learning Companion"}</div>
                  <div className="text-xs text-muted-foreground">{isAr ? "محادثة طبيعية عشان أفهمك" : "A natural conversation to understand you"}</div>
                </div>
              </div>
              <div className="flex-1 min-h-0"><ChatPanel messages={messages} onSend={sendDiscovery} typing={typing} placeholder={isAr ? "اكتب ردك..." : "Type your reply..."} companionName={companionName} t={t} /></div>
            </div>
          )}
          {step === "dna" && <DnaSummary profile={profile} isAr={isAr} Arrow={Arrow} onConfirm={async (patch) => { await updateProfile(patch); goto("goal"); }} />}
          {step === "goal" && <GoalStep recs={recs} typing={typing} onPick={pickGoal} t={t} isAr={isAr} />}
          {step === "assessment" && <AssessmentStep skills={keySkills} levels={skillLevels} setLevels={setSkillLevels} skillsText={skillsText} setSkillsText={setSkillsText} onSubmit={submitSkills} t={t} isAr={isAr} Arrow={Arrow} />}
          {step === "roadmap" && <RoadmapReveal preview={roadmapPreview} typing={typing} building={building} onBuild={buildRoadmap} isAr={isAr} companionName={companionName} />}
        </div>
      </main>
    </div>
  );
}

function NamingStep({ name, setName, onSubmit, t, isAr, Arrow }) {
  return (
    <div className="text-center animate-fade-up">
      <img src="https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/02325ee37_generated_image.png" alt="Zeus" className="w-32 h-32 mx-auto object-contain mb-6 animate-float rounded-2xl" />
      <h2 className="font-heading font-extrabold text-2xl sm:text-3xl mb-6">{t("onb.name.ask")}</h2>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        placeholder={t("onb.name.placeholder")}
        className="w-full max-w-md mx-auto px-5 py-4 rounded-2xl bg-card border border-border/60 focus:zeus-gold-border outline-none text-center text-lg transition block"
        autoFocus
      />
      <button onClick={onSubmit} className="mt-6 inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold">
        {isAr ? "كمّل" : "Continue"} <Arrow style={{ width: 18, height: 18 }} />
      </button>
    </div>
  );
}

function GoalStep({ recs, typing, onPick, t, isAr }) {
  const [custom, setCustom] = useState("");
  return (
    <div className="animate-fade-up">
      <div className="text-center mb-6">
        <div className="text-zeus-gold text-sm font-semibold uppercase tracking-wider mb-1">{isAr ? "تحليل الأهداف" : "Goal Analysis"}</div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl">{t("onb.goal.title")}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{isAr ? "زيوس حلّل مسارات ممكنة تناسبك." : "ZEUS analyzed paths that fit you."}</p>
      </div>
      {typing ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="text-zeus-gold animate-spin" style={{ width: 32, height: 32 }} />
          <p className="text-muted-foreground text-sm">{isAr ? "بحلّل أفضل مسار ليك..." : "Analyzing your best path..."}</p>
        </div>
      ) : recs ? (
        <div className="space-y-3">
          {recs.recommendations?.map((r, i) => (
            <button key={i} onClick={() => onPick(r.goal)}
              className="w-full text-start zeus-glass p-4 hover:zeus-gold-border transition group">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-heading font-bold text-lg">{r.goal}</span>
                <span className="text-zeus-gold font-bold text-xl">{r.score}%</span>
              </div>
              <p className="text-muted-foreground text-sm">{r.reason}</p>
              <div className="mt-2 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-zeus-gold to-zeus-brightgold" style={{ width: `${r.score}%` }} />
              </div>
            </button>
          ))}
          <div className="zeus-glass p-4">
            <label className="text-xs text-muted-foreground block mb-1.5">{isAr ? "أو اكتب هدف مختلف" : "Or type a different goal"}</label>
            <div className="flex gap-2">
              <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder={isAr ? "اكتب هدفك" : "Your goal"}
                className="flex-1 bg-transparent border border-border/60 rounded-lg px-3 py-2.5 text-sm outline-none focus:zeus-gold-border" />
              <button onClick={() => custom.trim() && onPick(custom.trim())} className="px-4 rounded-lg bg-zeus-gold text-zeus-midnight font-medium text-sm">{isAr ? "تأكيد" : "Confirm"}</button>
            </div>
          </div>
        </div>
      ) : <p className="text-center text-muted-foreground">{isAr ? "حصل خطأ، حدّث الصفحة" : "Something went wrong, refresh"}</p>}
    </div>
  );
}

function AssessmentStep({ skills, levels, setLevels, skillsText, setSkillsText, onSubmit, t, isAr, Arrow }) {
  return (
    <div className="animate-fade-up">
      <div className="text-center mb-6">
        <div className="text-zeus-gold text-sm font-semibold uppercase tracking-wider mb-1">{isAr ? "تقييم سريع" : "Quick Assessment"}</div>
        <h2 className="font-heading font-extrabold text-2xl sm:text-3xl">{t("onb.assess.title")}</h2>
        <p className="text-muted-foreground mt-2 text-sm">{isAr ? "قيم مستواك في كل مهارة من 0 لـ 100." : "Rate your level in each skill from 0 to 100."}</p>
      </div>
      <div className="space-y-4">
        {skills.map((s) => {
          const v = levels[s] ?? 50;
          return (
            <div key={s} className="zeus-glass p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{s}</span>
                <span className="text-zeus-gold font-bold">{v}%</span>
              </div>
              <input type="range" min="0" max="100" value={v}
                onChange={(e) => setLevels({ ...levels, [s]: Number(e.target.value) })}
                className="w-full accent-zeus-gold" />
            </div>
          );
        })}
      </div>
      <div className="zeus-glass p-4 mt-4">
        <label className="text-xs font-semibold text-zeus-brightgold block mb-2">{isAr ? "احكي لنا عن مهاراتك بالتفصيل" : "Tell us about your skills in detail"}</label>
        <textarea value={skillsText} onChange={(e) => setSkillsText(e.target.value)} rows={3}
          placeholder={isAr ? "اكتب إيه اللي تقدر تعمله فعليًا، الأدوات اللي استخدمتها، والمشاريع اللي اشتغلت عليها..." : "Write what you can actually do, tools you've used, and projects you've worked on..."}
          className="w-full bg-transparent border border-border/60 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:zeus-gold-border resize-none" />
      </div>
      <div className="text-center mt-6">
        <button onClick={onSubmit} className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition shadow-gold">
          {isAr ? "ابني خريطتي" : "Build my roadmap"} <Arrow style={{ width: 18, height: 18 }} />
        </button>
      </div>
    </div>
  );
}