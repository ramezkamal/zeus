import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, Globe, MessageSquare, LogOut, Info, Check, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/ProfileContext";
import LanguageToggle from "@/components/zeus/LanguageToggle";

export default function Settings() {
  const { t, lang, dir } = useI18n();
  const { profile, updateProfile } = useProfile();
  const isAr = lang === "ar";
  const nav = useNavigate();
  const [name, setName] = useState(profile?.companion_name || "");
  const [saving, setSaving] = useState(false);

  const saveName = async () => {
    setSaving(true);
    await updateProfile({ companion_name: name.trim() || "Zeus Companion" });
    setSaving(false);
  };

  const logout = async () => { await base44.auth.logout(); nav("/"); };

  return (
    <div dir={dir} className="space-y-6 max-w-2xl">
      <h1 className="font-heading font-extrabold text-2xl sm:text-3xl flex items-center gap-2"><SettingsIcon className="text-zeus-gold" style={{ width: 28, height: 28 }} /> {t("nav.settings")}</h1>

      <div className="zeus-glass p-6">
        <div className="flex items-center gap-2 mb-4"><Globe className="text-zeus-gold" style={{ width: 18, height: 18 }} /><h2 className="font-heading font-bold">{isAr ? "اللغة" : "Language"}</h2></div>
        <p className="text-sm text-muted-foreground mb-3">{isAr ? "بدّل لغة التطبيق. افتراضيًا المصري." : "Switch the app language. Default is Egyptian Arabic."}</p>
        <LanguageToggle />
      </div>

      <div className="zeus-glass p-6">
        <div className="flex items-center gap-2 mb-4"><MessageSquare className="text-zeus-gold" style={{ width: 18, height: 18 }} /><h2 className="font-heading font-bold">{isAr ? "اسم رفيقك الذكي" : "Companion Name"}</h2></div>
        <div className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-card border border-border/60 focus:zeus-gold-border outline-none text-sm" />
          <button onClick={saveName} disabled={saving} className="px-5 rounded-xl bg-zeus-gold text-white font-medium text-sm hover:bg-zeus-brightgold transition disabled:opacity-50 inline-flex items-center gap-1.5">
            {saving ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Check style={{ width: 16, height: 16 }} />} {t("common.save")}
          </button>
        </div>
      </div>

      <div className="zeus-glass p-6">
        <div className="flex items-center gap-2 mb-4"><Info className="text-zeus-gold" style={{ width: 18, height: 18 }} /><h2 className="font-heading font-bold">{isAr ? "عن ZEUS" : "About ZEUS"}</h2></div>
        <p className="text-sm text-muted-foreground leading-relaxed">{isAr ? "ZEUS رفيقك الذكي في رحلة التعلّم وبناء المستقبل المهني. بيفهمك، يبني خريطتك، يمشي معاك، ويفعّلها لما تتعثر." : "ZEUS is your smart learning & career companion. It understands you, builds your roadmap, walks with you, and adapts when you struggle."}</p>
      </div>

      <button onClick={logout} className="w-full zeus-glass p-5 flex items-center gap-3 text-destructive hover:bg-destructive/10 transition">
        <LogOut style={{ width: 20, height: 20 }} />
        <span className="font-medium">{t("nav.logout")}</span>
      </button>
    </div>
  );
}