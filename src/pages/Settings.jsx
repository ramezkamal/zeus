import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings as SettingsIcon, Globe, MessageSquare, LogOut, Check, Loader2, User, Palette, Camera, Mic, Upload } from "lucide-react";
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
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [savingName, setSavingName] = useState(false);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("zeus_theme") || "dark");
  const [cv, setCv] = useState(null);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("zeus_theme", theme);
  }, [theme]);

  useEffect(() => {
    (async () => {
      const c = await base44.entities.CV.filter({}, "-created_date", 1);
      if (c.length) setCv(c[0]);
    })();
  }, []);

  const uploadFile = async (file, field) => {
    setUploading(field);
    try {
      const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
      if (cv) {
        const updated = await base44.entities.CV.update(cv.id, { [field]: file_url });
        setCv(updated);
      }
    } catch (e) {}
    setUploading(null);
  };

  const saveName = async () => {
    setSaving(true);
    await updateProfile({ companion_name: name.trim() || "Zeus" });
    setSaving(false);
  };

  const saveFullName = async () => {
    setSavingName(true);
    await updateProfile({ full_name: fullName.trim() });
    setSavingName(false);
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
        <div className="flex items-center gap-2 mb-3"><Palette className="text-zeus-gold" style={{ width: 18, height: 18 }} /><h2 className="font-heading font-bold text-sm">{isAr ? "المظهر" : "Theme"}</h2></div>
        <div className="flex gap-2">
          <button onClick={() => setTheme("dark")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${theme === "dark" ? "bg-zeus-gold text-zeus-midnight" : "bg-secondary/30 border border-border/60"}`}>
            {isAr ? "داكن" : "Dark"}
          </button>
          <button onClick={() => setTheme("light")} className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${theme === "light" ? "bg-zeus-gold text-zeus-midnight" : "bg-secondary/30 border border-border/60"}`}>
            {isAr ? "فاتح" : "Light"}
          </button>
        </div>
      </div>

      <div className="zeus-glass p-5">
        <div className="flex items-center gap-2 mb-3"><User className="text-zeus-gold" style={{ width: 18, height: 18 }} /><h2 className="font-heading font-bold text-sm">{isAr ? "الاسم الكامل" : "Full Name"}</h2></div>
        <div className="flex gap-2">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={isAr ? "اكتب اسمك الكامل" : "Enter your full name"}
            className="flex-1 px-4 py-3 rounded-xl bg-card border border-border/60 focus:zeus-gold-border outline-none text-sm" />
          <button onClick={saveFullName} disabled={savingName} className="px-5 rounded-xl bg-zeus-gold text-zeus-midnight font-medium text-sm hover:bg-zeus-brightgold transition disabled:opacity-50 inline-flex items-center gap-1.5 shrink-0">
            {savingName ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Check style={{ width: 16, height: 16 }} />} {t("common.save")}
          </button>
        </div>
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

      <div className="zeus-glass p-5">
        <div className="flex items-center gap-2 mb-3"><Camera className="text-zeus-gold" style={{ width: 18, height: 18 }} /><h2 className="font-heading font-bold text-sm">{isAr ? "صورتك الشخصية" : "Profile Photo"}</h2></div>
        <div className="flex items-center gap-3">
          {cv?.photo_url ? (
            <img src={cv.photo_url} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-zeus-gold/40" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-secondary/40 flex items-center justify-center"><User className="text-muted-foreground" style={{ width: 24, height: 24 }} /></div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/60 text-sm font-medium cursor-pointer hover:bg-secondary/60 transition">
            {uploading === "photo_url" ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Upload style={{ width: 16, height: 16 }} />}
            {isAr ? "رفع صورة" : "Upload photo"}
            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0], "photo_url")} />
          </label>
        </div>
      </div>

      <div className="zeus-glass p-5">
        <div className="flex items-center gap-2 mb-3"><Mic className="text-zeus-gold" style={{ width: 18, height: 18 }} /><h2 className="font-heading font-bold text-sm">{isAr ? "صوتك (للبورتفوليو)" : "Voice (for portfolio)"}</h2></div>
        <p className="text-xs text-muted-foreground mb-3">{isAr ? "صوت اختياري يظهر في البورتفوليو العام" : "Optional voice that appears on your public portfolio"}</p>
        {cv?.voice_url && <audio controls src={cv.voice_url} className="w-full mb-3" style={{ filter: "invert(0.85)" }} />}
        <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-secondary/40 border border-border/60 text-sm font-medium cursor-pointer hover:bg-secondary/60 transition">
          {uploading === "voice_url" ? <Loader2 className="animate-spin" style={{ width: 16, height: 16 }} /> : <Upload style={{ width: 16, height: 16 }} />}
          {isAr ? "رفع صوت" : "Upload voice"}
          <input type="file" accept="audio/*" className="hidden" onChange={(e) => e.target.files[0] && uploadFile(e.target.files[0], "voice_url")} />
        </label>
      </div>

      <button onClick={logout} className="w-full zeus-glass p-5 flex items-center gap-3 text-destructive hover:bg-destructive/10 transition">
        <LogOut style={{ width: 20, height: 20 }} />
        <span className="font-medium">{t("nav.logout")}</span>
      </button>
    </div>
  );
}