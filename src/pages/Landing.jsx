import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import PartnerMarquee from "@/components/landing/PartnerMarquee";
import ProblemSolution from "@/components/landing/ProblemSolution";
import HowItWorks from "@/components/landing/HowItWorks";
import Audiences from "@/components/landing/Audiences";
import Partnerships from "@/components/landing/Partnerships";
import ProductPreview from "@/components/landing/ProductPreview";
import WhyTrust from "@/components/landing/WhyTrust";
import FinalCTAFooter from "@/components/landing/FinalCTAFooter";
import PartnerDialog from "@/components/landing/PartnerDialog";

export default function Landing() {
  const nav = useNavigate();
  const [partner, setPartner] = useState({ open: false, type: "general" });

  useEffect(() => {
    base44.auth.isAuthenticated().then((authed) => { if (authed) nav("/app", { replace: true }); });
  }, [nav]);

  const start = async () => {
    const authed = await base44.auth.isAuthenticated();
    nav(authed ? "/app" : "/register");
  };
  const openPartner = (type = "general") => setPartner({ open: true, type });
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div dir="ltr" className="min-h-screen overflow-x-hidden">
      <LandingNav onStart={start} onPartner={() => openPartner()} scrollTo={scrollTo} />
      <Hero onStart={start} onPartner={() => openPartner()} />
      <PartnerMarquee />
      <ProblemSolution />
      <HowItWorks />
      <Audiences onStart={start} onPartner={openPartner} />
      <Partnerships onPartner={openPartner} />
      <ProductPreview onStart={start} />
      <WhyTrust />
      <FinalCTAFooter onStart={start} onPartner={openPartner} scrollTo={scrollTo} />
      <PartnerDialog open={partner.open} type={partner.type} onClose={() => setPartner({ ...partner, open: false })} />
    </div>
  );
}