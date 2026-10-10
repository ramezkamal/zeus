import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { base44 } from "@/api/base44Client";
import useL from "@/components/landing/useL";

const field = "w-full px-3.5 py-2.5 rounded-lg bg-background border border-border/60 text-sm outline-none focus:border-zeus-gold/60";

export default function PartnerDialog({ open, type, onClose }) {
  const { L, dir } = useL();
  const TYPES = [["general", L("General", "عام")], ["industry", L("Employment & Industry", "التوظيف والصناعة")], ["training", L("Corporate Training", "تدريب مؤسسي")], ["institution", L("Educational Institution", "مؤسسة تعليمية")], ["technology", L("Technology", "تكنولوجيا")]];
  const [form, setForm] = useState({});
  const [state, setState] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => { if (open) { setForm({ type: type || "general" }); setState("idle"); setError(""); } }, [open, type]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setState("sending"); setError("");
    try {
      await base44.entities.PartnershipInquiry.create(form);
      setState("done");
    } catch (err) {
      setError(L("Couldn't send your request. Please try again.", "مقدرناش نبعت طلبك. حاول تاني.")); setState("idle");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent dir={dir} className="max-w-md">
        <DialogHeader>
          <DialogTitle>{L("Partner With ZEUS", "اعمل شراكة مع زيوس")}</DialogTitle>
          <DialogDescription>{L("Tell us about your organization and we'll get back to you.", "عرّفنا بمؤسستك وهنتواصل معاك.")}</DialogDescription>
        </DialogHeader>
        {state === "done" ? (
          <div className="py-8 text-center"><CheckCircle2 className="w-10 h-10 text-zeus-gold mx-auto mb-3" /><p className="text-sm">{L("Thanks — your request was received.", "شكرًا — طلبك وصلنا.")}</p></div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <select value={form.type || "general"} onChange={set("type")} className={field}>{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
            <input required placeholder={L("Organization *", "اسم المؤسسة *")} value={form.organization || ""} onChange={set("organization")} className={field} />
            <input placeholder={L("Your name", "اسمك")} value={form.contact_name || ""} onChange={set("contact_name")} className={field} />
            <input required type="email" placeholder={L("Work email *", "إيميل العمل *")} value={form.email || ""} onChange={set("email")} className={field} />
            <textarea rows={3} placeholder={L("How would you like to collaborate?", "إزاي حابب نتعاون؟")} value={form.message || ""} onChange={set("message")} className={`${field} resize-none`} />
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button disabled={state === "sending"} className="w-full py-3 rounded-full bg-zeus-gold text-zeus-midnight font-semibold text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60">
              {state === "sending" && <Loader2 className="w-4 h-4 animate-spin" />} {L("Send Request", "ابعت الطلب")}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}