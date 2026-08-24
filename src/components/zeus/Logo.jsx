import React from "react";
import { Image } from "@/components/ui/image";

const FULL_LOGO =
  "https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/53ce332f9_FIULL_LOGO-removebg-preview.png";
const ICON_ONLY =
  "https://media.base44.com/images/public/6a8c28083b820a6f17848b0c/23acdfe46_Screenshot_2026-08-24_042358-removebg-preview.png";

export default function Logo({ size = 34, withWordmark = true, withTagline = false, className = "" }) {
  if (withWordmark) {
    return (
      <Image
        src={FULL_LOGO}
        alt="ZEUS"
        fittingType="fit"
        originWidth={320}
        originHeight={100}
        className={className}
        style={{ height: size, width: "auto" }}
      />
    );
  }
  return (
    <Image
      src={ICON_ONLY}
      alt="ZEUS"
      fittingType="fit"
      className={className}
      style={{ width: size, height: size }}
    />
  );
}