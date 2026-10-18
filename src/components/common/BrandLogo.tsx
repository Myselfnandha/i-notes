import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 36 }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-xl bg-[#FAF6F0] border border-[#E5DEC9] p-1.5 flex items-center justify-center shadow-resting flex-shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-full h-full text-ink-primary"
      >
        <path
          d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"
          stroke="#1C1B1A"
          strokeWidth="1.5"
          fill="#FFFFFF"
        />
        <path
          d="M6 2v20"
          stroke="#D97706"
          strokeWidth="1.5"
          strokeDasharray="2 2"
        />
        <path
          d="M9 7h7M9 11h7M9 15h4"
          stroke="#8A9A86"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M16 2v6l-2-1.5L12 8V2"
          fill="#D97706"
          stroke="#D97706"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};
