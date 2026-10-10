import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/zeus/Logo";
import ThemeToggle from "@/components/zeus/ThemeToggle";

const LINKS = [
  { label: "Platform", id: "platform" },
  { label: "For Learners", id: "audiences" },
  { label: "For Organizations", id: "audiences" },
  { label: "Partnerships", id: "partnerships" },
  { label: "About ZEUS", id: "why" }
];

export default function LandingNav({ onStart, onPartner, scrollTo }) {
  const [open, setOpen] = useState(false);
  const go = (id) => { setOpen(false); scrollTo(id); };
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/75 border-b border-border/40">
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <button onClick={() => scrollTo("top")} aria-label="ZEUS home"><Logo size={30} /></button>
        <nav className="hidden lg:flex items-center gap-1">
          {LINKS.map((l) => (
            <button key={l.label} onClick={() => go(l.id)} className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-zeus-gold">{l.label}</button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={onPartner} className="hidden md:inline-flex px-4 py-2 rounded-full border border-border text-sm font-medium hover:border-zeus-gold/60 transition">Partner With Us</button>
          <button onClick={onStart} className="hidden sm:inline-flex px-4 py-2 rounded-full bg-zeus-gold text-zeus-midnight text-sm font-semibold hover:bg-zeus-brightgold transition">Get Started</button>
          <button onClick={() => setOpen(!open)} className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center border border-border/60" aria-label="Menu" aria-expanded={open}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border/40 bg-background px-5 py-4 space-y-1">
          {LINKS.map((l) => <button key={l.label} onClick={() => go(l.id)} className="block w-full text-start py-2.5 text-sm">{l.label}</button>)}
          <div className="flex gap-2 pt-3">
            <button onClick={() => { setOpen(false); onStart(); }} className="flex-1 py-2.5 rounded-full bg-zeus-gold text-zeus-midnight text-sm font-semibold">Get Started</button>
            <button onClick={() => { setOpen(false); onPartner(); }} className="flex-1 py-2.5 rounded-full border border-border text-sm">Partner With Us</button>
          </div>
        </div>
      )}
    </header>
  );
}