import React, { useState, useEffect, useRef } from "react";
import { FileText, Download, Loader2, Save } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/ProfileContext";
import CVForm from "@/components/zeus/cv/CVForm";
import CVPreview from "@/components/zeus/cv/CVPreview";

export default function CVBuilder() {
  const { lang, dir } = useI18n();
  const { profile } = useProfile();
  const isAr = lang === "ar";
  const [cv, setCv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me().catch(() => null);
      const existing = await base44.entities.CV.filter({}, "-created_date", 1);
      if (existing.length) {
        setCv(existing[0]);
      } else {
        const skills = (profile?.skill_graph || []).map((s) => ({
          name: s.skill,
          level: s.level >= 70 ? "Expert" : s.level >= 40 ? "Intermediate" : "Beginner"
        }));
        const created = await base44.entities.CV.create({
          full_name: me?.full_name || "",
          email: me?.email || "",
          title_role: profile?.goal || "",
          summary: profile?.background || "",
          experiences: [],
          education: [],
          skills,
          languages: [],
          certifications: []
        });
        setCv(created);
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    if (!cv) return;
    setSaving(true);
    try {
      const updated = await base44.entities.CV.update(cv.id, cv);
      setCv(updated);
    } catch (e) {}
    setSaving(false);
  };

  const exportPdf = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, { backgroundColor: "#ffffff", scale: 2 });
      const img = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, "PNG", 0, 0, w, h);
      pdf.save(`${(cv.full_name || "CV").replace(/\s+/g, "_")}.pdf`);
    } catch (e) {}
    setExporting(false);
  };

  if (loading || !cv) return <div className="flex justify-center py-20"><Loader2 className="text-zeus-gold animate-spin" style={{ width: 28, height: 28 }} /></div>;

  return (
    <div dir={dir} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl flex items-center gap-2"><FileText className="text-zeus-gold" style={{ width: 28, height: 28 }} /> {isAr ? "بنّاء السيرة الذاتية" : "CV Builder"}</h1>
          <p className="text-muted-foreground mt-1">{isAr ? "رتّب خبراتك ومهاراتك بشكل احترافي جاهز للتقديم" : "Organize your experience and skills, submission-ready"}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/60 text-sm font-medium hover:bg-secondary/60 transition disabled:opacity-60">
            {saving ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Save style={{ width: 16, height: 16 }} />}
            {isAr ? "حفظ" : "Save"}
          </button>
          <button onClick={exportPdf} disabled={exporting} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-zeus-gold to-zeus-brightgold text-white text-sm font-bold hover:shadow-gold transition disabled:opacity-60">
            {exporting ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Download style={{ width: 16, height: 16 }} />}
            {isAr ? "تصدير PDF" : "Export PDF"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        <CVForm cv={cv} setCv={setCv} isAr={isAr} />
        <div className="lg:sticky lg:top-20">
          <CVPreview cv={cv} isAr={isAr} previewRef={previewRef} />
        </div>
      </div>
    </div>
  );
}