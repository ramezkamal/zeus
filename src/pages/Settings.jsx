import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings as SettingsIcon, Globe, MessageSquare, LogOut, Check, Loader2, User } from "lucide-react";
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
    await updateProfile({ companion_name: name.trim() || "Zeus" });
    setSaving(false);
  };

  const logout = async () => { await base44.auth.logout(); nav("/"); };

  return (
    <div dir={dir} className="space-y-5 max-w-2xl">
      <h1 className="font-heading font-extrabold text-2xl sm:text-3xl flex items-center gap-2"><SettingsIcon className="text-zeus-gold" style={{ width: 28, height: 28 }} /> {t("nav.settings")}</h1>

      <div className="zeus-glass p-5">
        <div className="flex items-center gap-2 mb-3"><Globe className="text-zeus-gold" style={{ width: 18, height: 18 }} /><h2 className="font-heading font-bold text-sm">{isAr ? "اللغة" : "Language"}</h2></div>
        <LanguageToggle />
      </div>

      <div className="zeus-glass p-5">
        <div className="flex items-center gap-2 mb-3"><MessageSquare className="text-zeus-gold" style={{ width: 18, height: 18 }} /><h2 className="font-heading font-bold text-sm">{isAr ? "اسم المدرّب" : "Coach Name"}</h2></div>
        <div className="flex gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="flex-1 px-4 py-3 rounded-xl bg-card border border-border/60 focus:zeus-gold-border outline-none text-sm" />
          <button onClick={saveName} disabled={saving} className="px-5 rounded-xl bg-zeus-gold text-zeus-midnight font-medium text-sm hover:bg-zeus-brightgold transition disabled:opacity-50 inline-flex items-center gap-1.5 shrink-0">
            {saving ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Check style={{ width: 16, height: 16 }} />} {t("common.save")}
          </button>
        </div>
      </div>

      <Link to="/profile" className="zeus-glass p-5 flex items-center gap-3 hover:zeus-gold-border transition">
        <User className="text-zeus-gold" style={{ width: 18, height: 18 }} />
        <span className="text-sm font-medium flex-1">{isAr ? "ملفك الشخصي وبيانات التعلّم" : "Profile & Learning DNA"}</span>
        <span className="text-xs text-muted-foreground">{isAr ? "تعديل" : "Edit"}</span>
      </Link>

      <button onClick={logout} className="w-full zeus-glass p-5 flex items-center gap-3 text-destructive hover:bg-destructive/10 transition">
        <LogOut style={{ width: 20, height: 20 }} />
        <span className="font-medium">{t("nav.logout")}</span>
      </button>
    </div>
  );
}