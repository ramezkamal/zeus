import React from "react";
import { Map, BookOpen, Briefcase, Check, Lock } from "lucide-react";
import SectionHead from "@/components/landing/SectionHead";
import useL from "@/components/landing/useL";

function Frame({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/40 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 text-xs text-muted-foreground"><Icon className="w-4 h-4 text-zeus-gold" />{title}</div>
      <div className="p-5 space-y-3">{children}</div>
    </div>
  );
}

export default function ProductPreview({ onStart }) {
  const { L } = useL();
  return (
    <section className="py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHead eyebrow={L("Product Preview", "لمحة عن المنتج")} title={L("What using ZEUS feels like.", "تجربة زيوس من جوّه.")} desc={L("Illustrative previews of features available in the current platform.", "نماذج توضيحية لمميزات موجودة فعلًا في المنصة.")} />
        <div className="grid md:grid-cols-3 gap-5">
          <Frame icon={Map} title={L("Personalized Roadmap", "خريطة شخصية")}>
            {[["Python Fundamentals", "done"], ["Data Structures", "active"], [L("Stage Project: Phase 1", "مشروع المرحلة 1"), "locked"]].map(([t, s]) => (
              <div key={t} className={`flex items-center gap-3 p-3 rounded-xl border ${s === "active" ? "border-zeus-gold/50 bg-zeus-gold/5" : "border-border/40"}`}>
                {s === "done" ? <Check className="w-4 h-4 text-zeus-gold" /> : s === "locked" ? <Lock className="w-4 h-4 text-muted-foreground" /> : <span className="w-2 h-2 rounded-full bg-zeus-gold" />}
                <span className="text-sm">{t}</span>
              </div>
            ))}
          </Frame>
          <Frame icon={BookOpen} title={L("Lesson & Quiz", "درس واختبار")}>
            <div className="text-sm font-medium">{L("Which structure gives O(1) lookups by key?", "أنهي هيكل بيدّيك بحث O(1) بالمفتاح؟")}</div>
            {["List", "Dictionary", "Tuple"].map((o) => <div key={o} className={`text-sm px-3 py-2 rounded-lg border ${o === "Dictionary" ? "border-zeus-gold/60 text-zeus-gold" : "border-border/40 text-muted-foreground"}`}>{o}</div>)}
          </Frame>
          <Frame icon={Briefcase} title={L("Career Hub", "مركز الوظائف")}>
            {[["Junior Data Analyst", 86], ["Python Developer Intern", 74]].map(([t, v]) => (
              <div key={t}>
                <div className="flex justify-between text-sm mb-1.5"><span>{t}</span><span className="text-zeus-gold">{v}%</span></div>
                <div className="h-1.5 rounded-full bg-secondary/50"><div className="h-full rounded-full bg-zeus-gold" style={{ width: `${v}%` }} /></div>
              </div>
            ))}
            <div className="text-xs text-muted-foreground pt-1">{L("CV builder · Public portfolio · Job matching", "سيرة ذاتية · بورتفوليو · ترشيح وظائف")}</div>
          </Frame>
        </div>
        <div className="text-center mt-10">
          <button onClick={onStart} className="px-6 py-3.5 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition">{L("Explore the ZEUS Platform", "اكتشف منصة زيوس")}</button>
        </div>
      </div>
    </section>
  );
}