import React, { useState } from "react";
import { Outlet, useLocation, useNavigate, Link, Navigate } from "react-router-dom";
import {
  Home, Sparkles, Map, BookOpen, TrendingUp, Users, Rocket, Briefcase,
  MessageSquare, Bell, User, Settings, LogOut, Menu, X, Calendar
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useI18n } from "@/lib/i18n";
import { useProfile } from "@/lib/ProfileContext";
import Logo from "./Logo";
import LanguageToggle from "./LanguageToggle";

const NAV = [
  { key: "nav.home", to: "/app", icon: Home },
  { key: "nav.journey", to: "/journey", icon: Sparkles },
  { key: "nav.roadmap", to: "/roadmap", icon: Map },
  { key: "nav.learn", to: "/learn", icon: BookOpen },
  { key: "nav.schedule", to: "/schedule", icon: Calendar },
  { key: "nav.progress", to: "/progress", icon: TrendingUp },
  { key: "nav.community", to: "/community", icon: Users },
  { key: "nav.projects", to: "/projects", icon: Rocket },
  { key: "nav.career", to: "/career", icon: Briefcase },
  { key: "nav.companion", to: "/companion", icon: MessageSquare },
  { key: "nav.notifications", to: "/notifications", icon: Bell },
  { key: "nav.profile", to: "/profile", icon: User },
  { key: "nav.settings", to: "/settings", icon: Settings }
];

const BOTTOM = ["nav.home", "nav.schedule", "nav.community", "nav.companion", "nav.profile"];

export default function AppShell() {
  const { t, dir, lang } = useI18n();
  const isAr = lang === "ar";
  const { profile, loading } = useProfile();
  const loc = useLocation();
  const nav = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = async () => {
    await base44.auth.logout();
    nav("/");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-9 h-9 border-4 border-zeus-gold/30 border-t-zeus-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile || profile.onboarding_step !== "done") {
    return <Navigate to="/onboarding" replace />;
  }

  const SidebarLink = ({ item }) => {
    const active = loc.pathname === item.to;
    const Icon = item.icon;
    return (
      <Link
        to={item.to}
        className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
          active
            ? "bg-zeus-gold/15 text-zeus-brightgold zeus-gold-border"
            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
        }`}
      >
        <Icon className={active ? "text-zeus-gold" : ""} style={{ width: 18, height: 18 }} />
        <span>{t(item.key)}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex overflow-x-hidden" dir={dir}>
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-e border-border/60 bg-card/40 backdrop-blur-xl">
        <div className="px-5 py-6">
          <Link to="/app"><Logo size={32} /></Link>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {NAV.map((item) => <SidebarLink key={item.key} item={item} />)}
        </nav>
        <div className="p-3 border-t border-border/60">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
            <LogOut style={{ width: 18, height: 18 }} />
            <span>{t("nav.logout")}</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8 h-16 border-b border-border/60 bg-background/80 backdrop-blur-xl">
          <div className="lg:hidden"><Logo size={28} /></div>
          <div className="hidden lg:block text-sm text-muted-foreground">
            {t("brand.tagline")}
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Link to="/notifications" className="relative p-2 rounded-full hover:bg-secondary/60 transition">
              <Bell style={{ width: 18, height: 18 }} className="text-muted-foreground" />
            </Link>
            <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-zeus-gold to-zeus-brightgold text-white font-bold flex items-center justify-center text-sm">
              {(profile.companion_name || "Z").charAt(0).toUpperCase()}
            </Link>
          </div>
        </header>

        <main className="flex-1 px-4 lg:px-8 py-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-card/90 backdrop-blur-xl border-t border-border/60" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex items-center justify-around px-2 h-16">
        {NAV.filter((n) => BOTTOM.includes(n.key)).map((item) => {
          const active = loc.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link key={item.key} to={item.to} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition ${active ? "text-zeus-brightgold" : "text-muted-foreground"}`}>
              <Icon style={{ width: 20, height: 20 }} className={active ? "text-zeus-gold" : ""} />
              <span>{t(item.key)}</span>
            </Link>
          );
        })}
        <button onClick={() => setMoreOpen(true)} className="flex flex-col items-center gap-0.5 px-2 py-1 text-muted-foreground">
          <Menu style={{ width: 20, height: 20 }} />
          <span className="text-[10px]">{isAr ? "المزيد" : "More"}</span>
        </button>
        </div>
      </nav>

      {/* More menu */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-center items-end" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
          <div className="relative w-full bg-card border-t border-border/60 rounded-t-3xl p-5 animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <Logo size={28} />
              <button onClick={() => setMoreOpen(false)} className="p-2 rounded-full hover:bg-secondary/60"><X style={{ width: 18, height: 18 }} /></button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {NAV.map((item) => {
                const Icon = item.icon;
                const active = loc.pathname === item.to;
                return (
                  <Link key={item.key} to={item.to} onClick={() => setMoreOpen(false)} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs ${active ? "bg-zeus-gold/15 text-zeus-brightgold" : "bg-secondary/40 text-muted-foreground"}`}>
                    <Icon style={{ width: 20, height: 20 }} />
                    <span>{t(item.key)}</span>
                  </Link>
                );
              })}
              <button onClick={handleLogout} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs bg-secondary/40 text-destructive">
                <LogOut style={{ width: 20, height: 20 }} />
                <span>{t("nav.logout")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}