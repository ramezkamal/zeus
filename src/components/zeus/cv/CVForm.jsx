import React from "react";
import { Plus, Trash2, User, Mail, Phone, MapPin, Linkedin, Github, Globe, FileText, Briefcase, GraduationCap, Wrench, Languages, Award } from "lucide-react";

export default function CVForm({ cv, setCv, isAr }) {
  const set = (k, v) => setCv({ ...cv, [k]: v });
  const setArr = (k, i, field, v) => {
    const next = [...(cv[k] || [])];
    next[i] = { ...next[i], [field]: v };
    setCv({ ...cv, [k]: next });
  };
  const add = (k, item) => setCv({ ...cv, [k]: [...(cv[k] || []), item] });
  const remove = (k, i) => setCv({ ...cv, [k]: (cv[k] || []).filter((_, x) => x !== i) });

  return (
    <div className="space-y-5">
      <Card title={isAr ? "بيانات التواصل" : "Contact"} icon={User}>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input icon={User} placeholder={isAr ? "الاسم بالكامل" : "Full name"} value={cv.full_name || ""} onChange={(v) => set("full_name", v)} />
          <Input icon={Briefcase} placeholder={isAr ? "المسمى الوظيفي" : "Professional title"} value={cv.title_role || ""} onChange={(v) => set("title_role", v)} />
          <Input icon={Mail} placeholder="Email" value={cv.email || ""} onChange={(v) => set("email", v)} />
          <Input icon={Phone} placeholder={isAr ? "الهاتف" : "Phone"} value={cv.phone || ""} onChange={(v) => set("phone", v)} />
          <Input icon={MapPin} placeholder={isAr ? "الموقع" : "Location"} value={cv.location || ""} onChange={(v) => set("location", v)} />
          <Input icon={Linkedin} placeholder="LinkedIn" value={cv.linkedin || ""} onChange={(v) => set("linkedin", v)} />
          <Input icon={Github} placeholder="GitHub" value={cv.github || ""} onChange={(v) => set("github", v)} />
          <Input icon={Globe} placeholder={isAr ? "موقع" : "Website"} value={cv.website || ""} onChange={(v) => set("website", v)} />
        </div>
      </Card>

      <Card title={isAr ? "ملخص مهني" : "Professional Summary"} icon={FileText}>
        <textarea value={cv.summary || ""} onChange={(e) => set("summary", e.target.value)} rows={4}
          placeholder={isAr ? "اكتب ملخص قصير عنك وعن أهدافك..." : "Short summary about you and your goals..."}
          className="w-full rounded-lg bg-secondary/30 border border-border/60 px-3 py-2 text-sm focus:outline-none focus:zeus-gold-border" />
      </Card>

      <Card title={isAr ? "الخبرات" : "Experience"} icon={Briefcase} onAdd={() => add("experiences", { role: "", company: "", start: "", end: "", description: "" })}>
        {(cv.experiences || []).map((exp, i) => (
          <Repeatable key={i} onRemove={() => remove("experiences", i)}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder={isAr ? "المسمى" : "Role"} value={exp.role} onChange={(v) => setArr("experiences", i, "role", v)} />
              <Input placeholder={isAr ? "الشركة" : "Company"} value={exp.company} onChange={(v) => setArr("experiences", i, "company", v)} />
              <Input placeholder={isAr ? "من" : "Start"} value={exp.start} onChange={(v) => setArr("experiences", i, "start", v)} />
              <Input placeholder={isAr ? "إلى" : "End"} value={exp.end} onChange={(v) => setArr("experiences", i, "end", v)} />
            </div>
            <textarea placeholder={isAr ? "الإنجازات..." : "Achievements..."} rows={2} value={exp.description}
              onChange={(e) => setArr("experiences", i, "description", e.target.value)}
              className="mt-3 w-full rounded-lg bg-secondary/30 border border-border/60 px-3 py-2 text-sm focus:outline-none focus:zeus-gold-border" />
          </Repeatable>
        ))}
      </Card>

      <Card title={isAr ? "التعليم" : "Education"} icon={GraduationCap} onAdd={() => add("education", { degree: "", institution: "", start: "", end: "", description: "" })}>
        {(cv.education || []).map((ed, i) => (
          <Repeatable key={i} onRemove={() => remove("education", i)}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Input placeholder={isAr ? "الدرجة" : "Degree"} value={ed.degree} onChange={(v) => setArr("education", i, "degree", v)} />
              <Input placeholder={isAr ? "المؤسسة" : "Institution"} value={ed.institution} onChange={(v) => setArr("education", i, "institution", v)} />
              <Input placeholder={isAr ? "من" : "Start"} value={ed.start} onChange={(v) => setArr("education", i, "start", v)} />
              <Input placeholder={isAr ? "إلى" : "End"} value={ed.end} onChange={(v) => setArr("education", i, "end", v)} />
            </div>
          </Repeatable>
        ))}
      </Card>

      <Card title={isAr ? "المهارات" : "Skills"} icon={Wrench} onAdd={() => add("skills", { name: "", level: "Intermediate" })}>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {(cv.skills || []).map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20 border border-border/60">
              <input value={s.name} onChange={(e) => setArr("skills", i, "name", e.target.value)} placeholder={isAr ? "مهارة" : "Skill"}
                className="flex-1 bg-transparent text-sm focus:outline-none" />
              <select value={s.level} onChange={(e) => setArr("skills", i, "level", e.target.value)} className="bg-secondary/40 rounded text-xs px-2 py-1 focus:outline-none">
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Expert</option>
              </select>
              <button onClick={() => remove("skills", i)} className="text-muted-foreground hover:text-destructive"><Trash2 style={{ width: 14, height: 14 }} /></button>
            </div>
          ))}
        </div>
      </Card>

      <Card title={isAr ? "اللغات" : "Languages"} icon={Languages} onAdd={() => add("languages", { name: "", level: "Intermediate" })}>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {(cv.languages || []).map((s, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20 border border-border/60">
              <input value={s.name} onChange={(e) => setArr("languages", i, "name", e.target.value)} placeholder={isAr ? "لغة" : "Language"}
                className="flex-1 bg-transparent text-sm focus:outline-none" />
              <select value={s.level} onChange={(e) => setArr("languages", i, "level", e.target.value)} className="bg-secondary/40 rounded text-xs px-2 py-1 focus:outline-none">
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option><option>Native</option>
              </select>
              <button onClick={() => remove("languages", i)} className="text-muted-foreground hover:text-destructive"><Trash2 style={{ width: 14, height: 14 }} /></button>
            </div>
          ))}
        </div>
      </Card>

      <Card title={isAr ? "الشهادات" : "Certifications"} icon={Award} onAdd={() => add("certifications", "")}>
        <div className="space-y-2">
          {(cv.certifications || []).map((c, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-secondary/20 border border-border/60">
              <input value={c} onChange={(e) => { const n = [...(cv.certifications || [])]; n[i] = e.target.value; set("certifications", n); }} placeholder={isAr ? "شهادة" : "Certification"}
                className="flex-1 bg-transparent text-sm focus:outline-none" />
              <button onClick={() => remove("certifications", i)} className="text-muted-foreground hover:text-destructive"><Trash2 style={{ width: 14, height: 14 }} /></button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Card({ title, icon: Icon, children, onAdd }) {
  return (
    <div className="zeus-glass p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-bold text-sm flex items-center gap-2"><Icon className="text-zeus-gold" style={{ width: 16, height: 16 }} /> {title}</h3>
        {onAdd && <button onClick={onAdd} className="inline-flex items-center gap-1 text-xs text-zeus-brightgold hover:text-zeus-gold"><Plus style={{ width: 14, height: 14 }} /> {onAdd && "Add"}</button>}
      </div>
      {children}
    </div>
  );
}

function Input({ icon: Icon, placeholder, value, onChange }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-secondary/30 border border-border/60 px-3 py-2 focus-within:zeus-gold-border">
      {Icon && <Icon className="text-muted-foreground shrink-0" style={{ width: 15, height: 15 }} />}
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/60" />
    </div>
  );
}

function Repeatable({ children, onRemove }) {
  return (
    <div className="relative p-3 rounded-xl bg-secondary/15 border border-border/50 mb-3">
      <button onClick={onRemove} className="absolute top-2 end-2 text-muted-foreground hover:text-destructive"><Trash2 style={{ width: 14, height: 14 }} /></button>
      {children}
    </div>
  );
}