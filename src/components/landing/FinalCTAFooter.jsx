import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/zeus/Logo";

export default function FinalCTAFooter({ onStart, onPartner, scrollTo }) {
  const col = (title, links) => (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-foreground mb-3">{title}</div>
      <ul className="space-y-2">{links.map(([l, fn]) => <li key={l}><button onClick={fn} className="text-sm text-muted-foreground hover:text-zeus-gold transition">{l}</button></li>)}</ul>
    </div>
  );
  return (
    <>
      <section className="py-24 border-t border-border/40">
        <div className="max-w-4xl mx-auto px-5">
          <div className="relative rounded-3xl border border-zeus-gold/30 p-10 sm:p-14 text-center overflow-hidden bg-gradient-to-b from-zeus-gold/10 to-transparent">
            <Logo withWordmark={false} size={56} className="mx-auto mb-6" />
            <h2 className="font-heading font-bold text-3xl lg:text-4xl">Your Next Step Starts With ZEUS.</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Whether you're building your skills, developing your team, or exploring a partnership, ZEUS aims to turn learning into a clearer path toward opportunity.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button onClick={onStart} className="px-6 py-3.5 rounded-full bg-zeus-gold text-zeus-midnight font-semibold hover:bg-zeus-brightgold transition">Start Your Journey</button>
              <button onClick={() => onPartner()} className="px-6 py-3.5 rounded-full border border-border font-medium hover:border-zeus-gold/60 transition">Partner With ZEUS</button>
            </div>
          </div>
        </div>
      </section>
      <footer className="border-t border-border/40 py-14">
        <div className="max-w-6xl mx-auto px-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Logo size={30} />
            <div className="mt-3 text-sm text-zeus-gold font-medium">Think Fast. Think Smart.</div>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">AI-powered adaptive learning and career development — from learning goals to career readiness.</p>
          </div>
          {col("Platform", [["Platform", () => scrollTo("platform")], ["Why ZEUS", () => scrollTo("why")], ["Ecosystem", () => scrollTo("ecosystem")]])}
          {col("Learners", [["Get Started", onStart], ["For Learners", () => scrollTo("audiences")]])}
          {col("Organizations", [["Partnerships", () => scrollTo("partnerships")], ["Partner With Us", () => onPartner()]])}
        </div>
        <div className="max-w-6xl mx-auto px-5 mt-10 pt-6 border-t border-border/40 flex flex-wrap justify-between gap-3 text-xs text-muted-foreground">
          <span>© 2026 ZEUS. All rights reserved.</span>
          <Link to="/login" className="hover:text-zeus-gold">Sign in</Link>
        </div>
      </footer>
    </>
  );
}