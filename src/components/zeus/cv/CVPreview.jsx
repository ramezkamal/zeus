import React from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";

export default function CVPreview({ cv, isAr, previewRef }) {
  const exp = cv.experiences || [];
  const edu = cv.education || [];
  const skills = cv.skills || [];
  const langs = cv.languages || [];
  const certs = cv.certifications || [];

  return (
    <div ref={previewRef} className="bg-white text-slate-800 rounded-xl shadow-lg overflow-hidden" style={{ minHeight: 400 }}>
      <div className="bg-slate-900 text-white px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight">{cv.full_name || "—"}</h1>
        <p className="text-amber-400 text-sm font-medium mt-0.5">{cv.title_role || ""}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-300">
          {cv.email && <span className="flex items-center gap-1"><Mail style={{ width: 11, height: 11 }} /> {cv.email}</span>}
          {cv.phone && <span className="flex items-center gap-1"><Phone style={{ width: 11, height: 11 }} /> {cv.phone}</span>}
          {cv.location && <span className="flex items-center gap-1"><MapPin style={{ width: 11, height: 11 }} /> {cv.location}</span>}
          {cv.linkedin && <span className="flex items-center gap-1"><Linkedin style={{ width: 11, height: 11 }} /> {cv.linkedin}</span>}
          {cv.github && <span className="flex items-center gap-1"><Github style={{ width: 11, height: 11 }} /> {cv.github}</span>}
          {cv.website && <span className="flex items-center gap-1"><Globe style={{ width: 11, height: 11 }} /> {cv.website}</span>}
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {cv.summary ? (
          <Section title={isAr ? "ملخص" : "Summary"}>
            <p className="text-[13px] leading-relaxed text-slate-600">{cv.summary}</p>
          </Section>
        ) : null}

        {exp.length > 0 ? (
          <Section title={isAr ? "الخبرات" : "Experience"}>
            <div className="space-y-3">
              {exp.map((e, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="font-semibold text-sm text-slate-800">{e.role || ""}{e.company ? ` · ${e.company}` : ""}</h4>
                    <span className="text-[11px] text-slate-400 shrink-0">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                  </div>
                  {e.description ? <p className="text-[12px] text-slate-600 mt-1 leading-relaxed whitespace-pre-line">{e.description}</p> : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {edu.length > 0 ? (
          <Section title={isAr ? "التعليم" : "Education"}>
            <div className="space-y-2">
              {edu.map((e, i) => (
                <div key={i} className="flex justify-between items-baseline gap-2">
                  <div><span className="font-semibold text-sm">{e.degree}</span>{e.institution ? <span className="text-slate-500 text-[12px]"> · {e.institution}</span> : null}</div>
                  <span className="text-[11px] text-slate-400 shrink-0">{[e.start, e.end].filter(Boolean).join(" — ")}</span>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {skills.length > 0 ? (
          <Section title={isAr ? "المهارات" : "Skills"}>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">{s.name}{s.level ? ` · ${s.level}` : ""}</span>
              ))}
            </div>
          </Section>
        ) : null}

        {certs.length > 0 ? (
          <Section title={isAr ? "الشهادات" : "Certifications"}>
            <ul className="text-[12px] text-slate-600 list-disc ps-4 space-y-0.5">{certs.map((c, i) => <li key={i}>{c}</li>)}</ul>
          </Section>
        ) : null}

        {langs.length > 0 ? (
          <Section title={isAr ? "اللغات" : "Languages"}>
            <div className="text-[12px] text-slate-600">{langs.map((l) => `${l.name} (${l.level})`).join(" · ")}</div>
          </Section>
        ) : null}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-amber-600 border-b border-slate-200 pb-1 mb-2">{title}</h3>
      {children}
    </div>
  );
}