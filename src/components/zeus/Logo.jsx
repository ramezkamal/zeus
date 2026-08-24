import React from "react";

export default function Logo({ size = 34, withWordmark = true, withTagline = false, boxed = false, className = "" }) {
  const Z = (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className="shrink-0 drop-shadow-[0_4px_14px_rgba(255,193,7,0.35)]">
      <defs>
        <linearGradient id="zeusZgrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="55%" stopColor="#FFC107" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      {boxed && <rect width="64" height="64" rx="14" fill="#0D1426" />}
      <path d="M50 10 H14 V22 H38 L14 42 V54 H50 V42 H26 L50 22 Z" fill="url(#zeusZgrad)" />
    </svg>
  );

  if (!withWordmark) return <div className={`flex items-center ${className}`}>{Z}</div>;

  const w = size * 0.62;
  const E = (
    <svg className="inline-block align-middle" style={{ width: w * 0.62, height: w * 0.92, margin: `0 ${w * 0.06}px ${w * 0.04}px 0` }} viewBox="0 0 28 40" fill="none">
      <rect x="0" y="0" width="24" height="6.5" rx="1.5" fill="currentColor" />
      <rect x="0" y="16.75" width="24" height="6.5" rx="1.5" fill="#FFC107" />
      <rect x="0" y="33.5" width="24" height="6.5" rx="1.5" fill="currentColor" />
      <rect x="0" y="0" width="6.5" height="40" rx="1.5" fill="currentColor" />
    </svg>
  );

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {Z}
      <div className="flex flex-col leading-none">
        <span className="font-heading font-extrabold tracking-tight text-zeus-cloud" style={{ fontSize: w }}>
          Z{E}US
        </span>
        {withTagline && (
          <span className="font-heading font-medium tracking-[0.32em] text-zeus-cloud/70 mt-1.5" style={{ fontSize: size * 0.155 }}>
            LEARN. <span className="text-zeus-gold">GROW.</span> ACHIEVE.
          </span>
        )}
      </div>
    </div>
  );
}