import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Github, Linkedin, Mail, Globe, Sparkles, FolderKanban, Briefcase, GraduationCap } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.functions.invoke("getPublicPortfolio", { userId });
        setData(res.data || res);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-9 h-9 border-4 border-zeus-gold/30 border-t-zeus-gold rounded-full animate-spin" /></div>;

  if (!data || (!data.cv && !data.projects?.length)) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-5">
      <div className="font-heading font-extrabold text-5xl zeus-gold-text mb-3">Z</div>
      <p className="text-muted-foreground">Portfolio not found or not published yet.</p>
    </div>
  );

  const cv = data.cv || {};
  const projects = data.projects || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 zeus-grid-bg opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-zeus-gold/5 to-transparent" />
        <div className="relative max-w-4xl mx-auto px-5 py-16 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-zeus-gold to-zeus-brightgold flex items-center justify-center text-zeus-midnight font-heading font-extrabold text-4xl mb-5 shadow-gold">
            {(cv.full_name || "Z").charAt(0)}
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl">{cv.full_name || "ZEUS Learner"}</h1>
          {cv.title_role && <p className="text-zeus-gold font-medium mt-1">{cv.title_role}</p>}
          {cv.location && <p className="text-muted-foreground text-sm mt-1">{cv.location}</p>}
          {cv.summary && <p className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">{cv.summary}</p>}
          <div className="flex items-center justify-center gap-3 mt-6">
            {cv.github && <a href={cv.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border/60 flex items-center justify-center hover:zeus-gold-border transition"><Github style={{ width: 18, height: 18 }} /></a>}
            {cv.linkedin && <a href={cv.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border/60 flex items-center justify-center hover:zeus-gold-border transition"><Linkedin style={{ width: 18, height: 18 }} /></a>}
            {cv.email && <a href={`mailto:${cv.email}`} className="w-10 h-10 rounded-full bg-card border border-border/60 flex items-center justify-center hover:zeus-gold-border transition"><Mail style={{ width: 18, height: 18 }} /></a>}
            {cv.website && <a href={cv.website} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border/60 flex items-center justify-center hover:zeus-gold-border transition"><Globe style={{ width: 18, height: 18 }} /></a>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-12 space-y-12">
        {/* Skills */}
        {cv.skills?.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-xl mb-5 flex items-center gap-2"><Sparkles className="text-zeus-gold" style={{ width: 20, height: 20 }} /> Skills</h2>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((s, i) => (
                <span key={i} className="px-4 py-2 rounded-full bg-card border border-border/60 text-sm">{s.name}{s.level ? ` · ${s.level}` : ""}</span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-xl mb-5 flex items-center gap-2"><FolderKanban className="text-zeus-gold" style={{ width: 20, height: 20 }} /> Projects</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {projects.map((p, i) => (
                <div key={i} className="zeus-glass p-5 hover:zeus-gold-border transition">
                  <h3 className="font-heading font-bold text-lg mb-1">{p.title}</h3>
                  {p.difficulty && <span className="text-xs text-zeus-gold">{p.difficulty}</span>}
                  {p.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.technologies.map((t, j) => (
                        <span key={j} className="px-2.5 py-1 rounded-full bg-zeus-gold/10 text-zeus-brightgold text-xs">{t}</span>
                      ))}
                    </div>
                  )}
                  {p.description && <p className="text-muted-foreground text-sm mt-3 leading-relaxed">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {cv.experiences?.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-xl mb-5 flex items-center gap-2"><Briefcase className="text-zeus-gold" style={{ width: 20, height: 20 }} /> Experience</h2>
            <div className="space-y-4">
              {cv.experiences.map((e, i) => (
                <div key={i} className="border-s-2 border-zeus-gold/40 ps-4">
                  <h3 className="font-heading font-bold">{e.role}</h3>
                  <p className="text-zeus-gold text-sm">{e.company}</p>
                  <p className="text-muted-foreground text-xs mt-1">{e.start} — {e.end || "Present"}</p>
                  {e.description && <p className="text-muted-foreground text-sm mt-2">{e.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {cv.education?.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-xl mb-5 flex items-center gap-2"><GraduationCap className="text-zeus-gold" style={{ width: 20, height: 20 }} /> Education</h2>
            <div className="space-y-4">
              {cv.education.map((e, i) => (
                <div key={i} className="border-s-2 border-zeus-gold/40 ps-4">
                  <h3 className="font-heading font-bold">{e.degree}</h3>
                  <p className="text-zeus-gold text-sm">{e.institution}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className="border-t border-border/40 py-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026 <span className="zeus-gold-text font-bold">Z</span> · Built with ZEUS</p>
      </footer>
    </div>
  );
}