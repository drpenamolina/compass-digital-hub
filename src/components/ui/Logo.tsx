export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="68" fill="none" stroke="#123A5E" strokeWidth="4" />
      <polygon points="100,36 87,94 113,94" fill="#123A5E" />
      <polygon points="100,164 87,106 113,106" fill="none" stroke="#123A5E" strokeWidth="4" />
      <rect x="89" y="97" width="22" height="6" fill="#123A5E" />
      <rect x="97" y="89" width="6" height="22" fill="#123A5E" />
    </svg>
  );
}

export function LogoLockup({ className = "h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 620 210" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="68" fill="none" stroke="#123A5E" strokeWidth="2" />
      <polygon points="100,36 87,94 113,94" fill="#123A5E" />
      <polygon points="100,164 87,106 113,106" fill="none" stroke="#123A5E" strokeWidth="2" />
      <rect x="89" y="97" width="22" height="6" fill="#123A5E" />
      <rect x="97" y="89" width="6" height="22" fill="#123A5E" />
      <text x="255" y="106" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="500" fontSize="46" letterSpacing="2" fill="#123A5E">
        COMPASS
      </text>
      <text x="256" y="134" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" fontSize="15" letterSpacing="1.5" fill="#5B6B7A">
        RESIDENT DIGITAL HUB
      </text>
    </svg>
  );
}
