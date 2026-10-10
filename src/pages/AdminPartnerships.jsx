import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Handshake, Mail, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";

const STATUSES = ["new", "contacted", "closed"];
const TYPE_LABEL = { general: "General", industry: "Employment & Industry", training: "Corporate Training", institution: "Educational Institution", technology: "Technology" };

export default function AdminPartnerships() {
  const { lang, dir } = useI18n();
  const isAr = lang === "ar";
  const [me, setMe] = useState(null);
  const [status, setStatus] = useState("all");
  const [items, setItems] = useState(null);

  useEffect(() => { base44.auth.me().then(setMe); }, []);
  useEffect(() => {
    if (me?.role !== "admin") return;
    setItems(null);
    base44.entities.PartnershipInquiry.filter(status === "all" ? {} : { status }, { sort: "-created_date", limit: 100 }).then((p) => setItems(p.items));
  }, [me, status]);

  const update = async (id, s) => {
    await base44.entities.PartnershipInquiry.update(id, { status: s });
    setItems((prev) => status === "all" ? prev.map((i) => (i.id === id ? { ...i, status: s } : i)) : prev.filter((i) => i.id !== id));
  };

  if (!me) return <div className="flex justify-center py-24"><Loader2 className="w-7 h-7 text-zeus-gold animate-spin" /></div>;
  if (me.role !== "admin") return <div className="text-center py-24 text-muted-foreground text-sm">{isAr ? "الصفحة دي للأدمن بس." : "Admins only."}</div>;

  return (
    <div dir={dir} className="space-y-6 max-w-4xl">
      <div>
        <Link to="/settings" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-zeus-gold mb-3"><ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />{isAr ? "الإعدادات" : "Settings"}</Link>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl flex items-center gap-2"><Handshake className="w-7 h-7 text-zeus-gold" />{isAr ? "طلبات الشراكة" : "Partnership Requests"}</h1>
      </div>
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUSES].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`px-4 py-1.5 rounded-full text-xs font-medium capitalize transition ${status === s ? "bg-zeus-gold text-zeus-midnight" : "border border-border/60 text-muted-foreground"}`}>{s}</button>
        ))}
      </div>
      {!items ? <div className="flex justify-center py-16"><Loader2 className="w-6 h-6 text-zeus-gold animate-spin" /></div>
        : !items.length ? <div className="text-center py-16 text-sm text-muted-foreground border border-dashed border-border/60 rounded-2xl">{isAr ? "مفيش طلبات لسه." : "No requests yet."}</div>
        : (
          <div className="divide-y divide-border/40 border border-border/50 rounded-2xl overflow-hidden">
            {items.map((i) => (
              <div key={i.id} className="p-5 bg-card/30 flex flex-col sm:flex-row gap-4 sm:items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold">{i.organization}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zeus-gold/10 text-zeus-gold">{TYPE_LABEL[i.type] || i.type}</span>
                  </div>
                  <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                    {i.contact_name && <span>{i.contact_name}</span>}
                    <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1 hover:text-zeus-gold"><Mail className="w-3 h-3" />{i.email}</a>
                    <span>{new Date(i.created_date).toLocaleDateString()}</span>
                  </div>
                  {i.message && <p className="mt-2 text-sm text-foreground/85 whitespace-pre-wrap">{i.message}</p>}
                </div>
                <select value={i.status || "new"} onChange={(e) => update(i.id, e.target.value)} className="px-3 py-2 rounded-lg bg-background border border-border/60 text-xs capitalize">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}