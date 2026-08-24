import React, { useState, useEffect } from "react";
import { Briefcase, Loader2, Lock, BookOpen, Rocket, FileText, Target, Award, ArrowRight, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/ProfileContext";

const LOOP_AR = ["تعلّم", "ابني", "أثبت", "استعد", "تطابق", "قدّم", "مقابلة", "اتوظف"];
const LOOP_EN = ["Learn", "Build", "Prove", "Prepare", "Match", "Apply", "Interview", "Hired"];

export default function Career() {
  const { t, lang, dir } = useI18n();
  const { profile } = useProfile();
  const isAr = lang === "ar";
  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await base44.entities.Project.filter({}, "-created_date", 50);
      setProjects(p);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  const completed = projects.filter((p) => p.status === "completed").length;
  const skillGraph = profile?.skill_graph || [];
  const strongSkills = skillGraph.filter((s) => s.level >= 60).map((s) => s.skill);
  const weakSkills = skillGraph.filter((s) => s.level < 40).map((s) => s.skill);

  return (
    <div dir={dir} className="space-y-6">
      <div>
        <h1 className="font-heading font-extrabold text-3xl flex items-center gap-2"><Briefcase className="text-zeus-gold" style={{ width: 28, height: 28 }} /> {t("career.title")}</h1>
        <p className="text-muted-foreground mt-1">{isAr ? "حوّل تعلّمك لفرصة شغل" : "Turn your learning into a career opportunity"}</p>
      </div>

      {/* Career loop */}
      <div className="zeus-glass p-6">
        <h2 className="font-heading font-bold text-lg mb-4">{isAr ? "دورة المسار المهني" : "The Career Loop"}</h2>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {(isAr ? LOOP_AR : LOOP_EN).map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className={`px-4 py-2.5 rounded-full text-sm font-medium ${i === arr.length - 1 ? "bg-zeus-gold text-zeus-midnight shadow-gold" : "bg-secondary/40 border border-border/60"}`}>{s}</div>
              {i < arr.length - 1 && <Arrow className="text-zeus-gold/40" style={{ width: 16, height: 16 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Career profile preview */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="zeus-glass p-6">
          <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><Award className="text-zeus-gold" style={{ width: 18, height: 18 }} /> {isAr ? "ملفك المهني" : "Career Profile"}</h2>
          <div className="space-y-3 text-sm">
            <Row label={isAr ? "الهدف" : "Goal"} value={profile?.goal} />
            <Row label={isAr ? "مشاريع مكتملة" : "Completed projects"} value={String(completed)} />
            <Row label={isAr ? "مهارات قوية" : "Strong skills"} value={strongSkills.length ? strongSkills.join("، ") : "—"} />
            <Row label={isAr ? "مهارات تحتاج تطوير" : "Skills to grow"} value={weakSkills.length ? weakSkills.join("، ") : "—"} />
          </div>
        </div>
        <div className="zeus-glass p-6">
          <h2 className="font-heading font-bold text-lg mb-4 flex items-center gap-2"><Target className="text-zeus-gold" style={{ width: 18, height: 18 }} /> {isAr ? "خطوات جاية" : "Next steps"}</h2>
          <div className="space-y-2.5">
            {[
              { icon: FileText, ar: "بنّاء السيرة الذاتية (ATS)", en: "CV Builder (ATS)" },
              { icon: Briefcase, ar: "تطابق الوظائف", en: "Job Matching" },
              { icon: Rocket, ar: "تجهيز المقابلات", en: "Interview Prep" },
              { icon: BookOpen, ar: "خطاب التقديم", en: "Cover Letters" }
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/20 border border-border/60 opacity-70">
                  <Icon className="text-muted-foreground" style={{ width: 18, height: 18 }} />
                  <span className="text-sm flex-1">{isAr ? s.ar : s.en}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground flex items-center gap-1"><Lock style={{ width: 9, height: 9 }} /> {isAr ? "قريبًا" : "Soon"}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return <div className="flex justify-between gap-3 py-1.5 border-b border-border/40"><span className="text-muted-foreground">{label}</span><span className="font-medium text-end">{value || "—"}</span></div>;
}