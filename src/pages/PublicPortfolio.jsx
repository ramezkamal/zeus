import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Linkedin, Mail, Globe, Download, Sparkles, FolderKanban, Briefcase, GraduationCap, Award, ExternalLink, MapPin, Phone, Play, X } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ACCENTS = {
  gold: { primary: "#FFC107", glow: "rgba(255,193,7,0.2)", light: "rgba(255,193,7,0.1)" },
  blue: { primary: "#3B82F6", glow: "rgba(59,130,246,0.2)", light: "rgba(59,130,246,0.1)" },
  purple: { primary: "#8B5CF6", glow: "rgba(139,92,246,0.2)", light: "rgba(139,92,246,0.1)" },
  green: { primary: "#10B981", glow: "rgba(16,185,129,0.2)", light: "rgba(16,185,129,0.1)" },
  red: { primary: "#EF4444", glow: "rgba(239,68,68,0.2)", light: "rgba(239,68,68,0.1)" }
};

export default function PublicPortfolio() {
  const { userId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);

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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-10 h-10 border-4 border-zeus-gold/30 border-t-zeus-gold rounded-full animate-spin" />
    </div>
  );

  if (!data || (!data.cv && !data.projects?.length)) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-5">
      <p className="text-muted-foreground">Portfolio not found</p>
    </div>
  );

  const cv = data.cv || {};
  const projects = data.projects || [];
  const accent = ACCENTS[cv.accent_color] || ACCENTS.gold;
  const certList = (cv.certifications || []).map((c) => typeof c === "string" ? { name: c } : c);

  return (
    <div className="min-h-screen bg-background" style={{ "--accent": accent.primary, "--accent-glow": accent.glow, "--accent-light": accent.light }}>
      {/* Hero */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 zeus-grid-bg opacity-20" />
        <div className="absolute inset-0" style={{ background: `radial-gradient(40rem 40rem at 50% 0%, ${accent.glow}, transparent 60%)` }} />
        <div className="relative max-w-4xl mx-auto px-5 py-16 text-center">
          {cv.photo_url ? (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
              className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 mb-5 shadow-2xl" style={{ borderColor: accent.primary }}>
              <img src={cv.photo_url} alt={cv.full_name} className="w-full h-full object-cover" />
            </motion.div>
          ) : (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
              className="w-28 h-28 mx-auto rounded-full flex items-center justify-center text-4xl font-bold mb-5 shadow-2xl"
              style={{ background: accent.primary, color: "#0D1426" }}>
              {(cv.full_name || "Z").charAt(0)}
            </motion.div>
          )}
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="font-heading font-extrabold text-3xl sm:text-5xl">{cv.full_name || "Portfolio"}</motion.h1>
          {cv.title_role && (
            <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="text-lg mt-2 font-medium" style={{ color: accent.primary }}>{cv.title_role}</motion.p>
          )}
          {cv.location && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
              className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-1">
              <MapPin style={{ width: 13, height: 13 }} /> {cv.location}
            </motion.p>
          )}
          {cv.summary && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-muted-foreground mt-4 max-w-2xl mx-auto leading-relaxed">{cv.summary}</motion.p>
          )}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-3 mt-6">
            {cv.github && <a href={cv.github} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border/60 flex items-center justify-center hover:scale-110 transition"><Github style={{ width: 18, height: 18 }} /></a>}
            {cv.linkedin && <a href={cv.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border/60 flex items-center justify-center hover:scale-110 transition"><Linkedin style={{ width: 18, height: 18 }} /></a>}
            {cv.email && <a href={`mailto:${cv.email}`} className="w-10 h-10 rounded-full bg-card border border-border/60 flex items-center justify-center hover:scale-110 transition"><Mail style={{ width: 18, height: 18 }} /></a>}
            {cv.phone && <a href={`https://wa.me/${cv.phone}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-card border border-border/60 flex items-center justify-center hover:scale-110 transition"><Phone style={{ width: 18, height: 18 }} /></a>}
          </motion.div>
          {cv.voice_url && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 max-w-md mx-auto">
              <audio controls src={cv.voice_url} className="w-full" style={{ filter: "invert(0.85)" }} />
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-5 py-12 space-y-12">
        {/* Skills */}
        {cv.skills?.length > 0 && (
          <Section icon={Sparkles} title="Skills">
            <div className="flex flex-wrap gap-2.5">
              {cv.skills.map((s, i) => (
                <motion.span key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className="px-4 py-2 rounded-full text-sm font-medium border transition hover:scale-105"
                  style={{ borderColor: accent.primary, background: accent.light, color: accent.primary }}>
                  {s.name}
                </motion.span>
              ))}
            </div>
          </Section>
        )}

        {/* Experience */}
        {cv.experiences?.length > 0 && (
          <Section icon={Briefcase} title="Experience">
            <div className="relative ps-6">
              <div className="absolute start-0 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${accent.primary}, transparent)` }} />
              {cv.experiences.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="relative mb-6">
                  <div className="absolute -start-6 top-1 w-3 h-3 rounded-full" style={{ background: accent.primary }} />
                  <h3 className="font-heading font-bold">{e.role}</h3>
                  <p className="text-sm font-medium" style={{ color: accent.primary }}>{e.company}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{[e.start, e.end].filter(Boolean).join(" — ")}</p>
                  {e.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{e.description}</p>}
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <Section icon={FolderKanban} title="Projects">
            <div className="grid sm:grid-cols-2 gap-5">
              {projects.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedProject(p)}
                  className="zeus-glass p-5 cursor-pointer hover:scale-[1.02] transition group">
                  <h3 className="font-heading font-bold text-lg mb-1 group-hover:text-zeus-brightgold transition">{p.title}</h3>
                  {p.difficulty && <span className="text-xs" style={{ color: accent.primary }}>{p.difficulty}</span>}
                  {p.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {p.technologies.map((t, j) => (
                        <span key={j} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: accent.light, color: accent.primary }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {p.description && <p className="text-muted-foreground text-sm mt-3 leading-relaxed line-clamp-2">{p.description}</p>}
                  <div className="mt-3 text-xs flex items-center gap-1" style={{ color: accent.primary }}>
                    View details <ExternalLink style={{ width: 12, height: 12 }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {cv.education?.length > 0 && (
          <Section icon={GraduationCap} title="Education">
            <div className="space-y-4">
              {cv.education.map((e, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="zeus-glass p-4 border-s-2" style={{ borderColor: accent.primary }}>
                  <h3 className="font-heading font-bold">{e.degree}</h3>
                  <p className="text-sm" style={{ color: accent.primary }}>{e.institution}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{[e.start, e.end].filter(Boolean).join(" — ")}</p>
                </motion.div>
              ))}
            </div>
          </Section>
        )}

        {/* Certifications */}
        {certList.length > 0 && (
          <Section icon={Award} title="Certifications">
            <div className="grid sm:grid-cols-2 gap-3">
              {certList.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="zeus-glass p-4">
                  <h3 className="font-heading font-bold text-sm">{c.name}</h3>
                  {c.issuer && <p className="text-xs" style={{ color: accent.primary }}>{c.issuer}</p>}
                  {c.date && <p className="text-xs text-muted-foreground mt-0.5">{c.date}</p>}
                  {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="text-xs underline mt-1 inline-block" style={{ color: accent.primary }}>View certificate</a>}
                </motion.div>
              ))}
            </div>
          </Section>
        )}
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-5" onClick={() => setSelectedProject(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative zeus-glass p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 end-4 text-muted-foreground hover:text-foreground"><X style={{ width: 20, height: 20 }} /></button>
              <h2 className="font-heading font-extrabold text-xl mb-2">{selectedProject.title}</h2>
              {selectedProject.difficulty && <span className="text-xs" style={{ color: accent.primary }}>{selectedProject.difficulty}</span>}
              {selectedProject.description && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{selectedProject.description}</p>}
              {selectedProject.technologies?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.technologies.map((t, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: accent.light, color: accent.primary }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedProject.requirements?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Requirements</h3>
                  <ul className="list-disc ps-4 text-sm text-muted-foreground space-y-1">
                    {selectedProject.requirements.map((r, j) => <li key={j}>{r}</li>)}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-border/40 py-6 text-center">
        <p className="text-xs text-muted-foreground">© 2026</p>
      </footer>
    </div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5 }}>
      <h2 className="font-heading font-bold text-xl mb-5 flex items-center gap-2">
        <Icon style={{ width: 20, height: 20, color: "var(--accent)" }} /> {title}
      </h2>
      {children}
    </motion.section>
  );
}