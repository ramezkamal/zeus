import React from "react";

export default function Logo({ size = 34, withWordmark = true, className = "" }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="drop-shadow-[0_4px_14px_rgba(245,183,0,0.35)]">
        <rect width="64" height="64" rx="15" fill="#0B1020" stroke="rgba(245,183,0,0.35)" />
        <path d="M36 6 16 36h12l-4 22 24-32H34l4-20z" fill="#F5B700" />
        <path d="M34 6 14 36h12l-4 22 24-32H32l2-20z" fill="#FFD84D" opacity="0.85" />
      </svg>
      {withWordmark && (
        <span className="font-heading font-extrabold tracking-tight text-2xl zeus-gold-text leading-none">ZEUS</span>
      )}
    </div>
  );
}