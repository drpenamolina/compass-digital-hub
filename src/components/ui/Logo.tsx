export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="68" fill="none" stroke="#123A5E" strokeWidth="3.5" />
      <circle cx="100" cy="32" r="4.5" fill="#123A5E" />
      <circle cx="168" cy="100" r="4.5" fill="#123A5E" />
      <circle cx="100" cy="168" r="4.5" fill="#123A5E" />
      <circle cx="32" cy="100" r="4.5" fill="#123A5E" />
      <path d="M100,100 L156,44 L100,70 Z" fill="#123A5E" />
      <path d="M100,100 L130,100 L156,44 Z" fill="#123A5E" />
      <path d="M100,100 L44,156 L100,130 Z" fill="none" stroke="#123A5E" strokeWidth="3.5" strokeLinejoin="round" />
      <path d="M100,100 L70,100 L44,156 Z" fill="none" stroke="#123A5E" strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="100" cy="100" r="9" fill="#FFFFFF" />
      <circle cx="100" cy="100" r="4.5" fill="#123A5E" />
    </svg>
  );
}

export function LogoLockup({ className = "h-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 620 210" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="68" fill="none" stroke="#123A5E" strokeWidth="2" />
      <circle cx="100" cy="32" r="4" fill="#123A5E" />
      <circle cx="168" cy="100" r="4" fill="#123A5E" />
      <circle cx="100" cy="168" r="4" fill="#123A5E" />
      <circle cx="32" cy="100" r="4" fill="#123A5E" />
      <path d="M100,100 L156,44 L100,70 Z" fill="#123A5E" />
      <path d="M100,100 L130,100 L156,44 Z" fill="#123A5E" />
      <path d="M100,100 L44,156 L100,130 Z" fill="none" stroke="#123A5E" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M100,100 L70,100 L44,156 Z" fill="none" stroke="#123A5E" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="100" cy="100" r="8" fill="#FFFFFF" />
      <circle cx="100" cy="100" r="4" fill="#123A5E" />
      <text x="255" y="106" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="500" fontSize="46" letterSpacing="2" fill="#123A5E">
        COMPASS
      </text>
      <text x="256" y="134" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="400" fontSize="15" letterSpacing="1.5" fill="#5B6B7A">
        RESIDENT DIGITAL HUB
      </text>
    </svg>
  );
}
