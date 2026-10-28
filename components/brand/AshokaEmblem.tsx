'use client';

import React from 'react';

export interface AshokaEmblemProps {
  className?: string;
  size?: number;
  variant?: 'light' | 'dark' | 'auto';
}

export function AshokaEmblem({ className = '', size = 38 }: AshokaEmblemProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 130"
      width={size}
      height={(size * 130) / 100}
      className={`shrink-0 transition-all ${className}`}
      aria-label="State Emblem of India - Ashoka Lion Capital"
      fill="currentColor"
    >
      {/* Central Lion Head */}
      <path
        d="M50 12 C44 12, 38 16, 38 23 C38 28, 41 33, 44 36 L43 43 C42 45, 39 46, 39 48 C39 52, 45 53, 50 53 C55 53, 61 52, 61 48 C61 46, 58 45, 57 43 L56 36 C59 33, 62 28, 62 23 C62 16, 56 12, 50 12 Z"
        className="text-slate-800 dark:text-amber-100/90"
      />
      {/* Central Lion Mane Details */}
      <path
        d="M45 19 C47 16, 53 16, 55 19 C52 21, 48 21, 45 19 Z M43 24 C41 27, 43 31, 47 31 C45 28, 45 25, 43 24 Z M57 24 C55 25, 55 28, 53 31 C57 31, 59 27, 57 24 Z"
        className="text-amber-600 dark:text-amber-400"
      />
      {/* Central Lion Snout & Chin */}
      <path
        d="M47 34 L53 34 L52 38 C52 40, 48 40, 48 38 Z"
        className="text-slate-900 dark:text-white"
      />

      {/* Left Lion Profile */}
      <path
        d="M38 23 C33 21, 26 23, 23 28 C20 33, 21 39, 25 43 L23 48 C22 51, 24 54, 29 54 C33 54, 37 50, 39 45 L38 36 C36 33, 37 27, 38 23 Z"
        className="text-slate-700 dark:text-amber-100/80"
      />
      <circle cx="27" cy="30" r="1.5" className="text-slate-900 dark:text-white" />

      {/* Right Lion Profile */}
      <path
        d="M62 23 C67 21, 74 23, 77 28 C80 33, 79 39, 75 43 L77 48 C78 51, 76 54, 71 54 C67 54, 63 50, 61 45 L62 36 C64 33, 63 27, 62 23 Z"
        className="text-slate-700 dark:text-amber-100/80"
      />
      <circle cx="73" cy="30" r="1.5" className="text-slate-900 dark:text-white" />

      {/* Middle Pillar / Torso support */}
      <path
        d="M36 53 L64 53 L62 68 L38 68 Z"
        className="text-slate-800 dark:text-amber-200/75"
      />

      {/* Capital Abacus Frieze (Horizontal Band) */}
      <rect
        x="18"
        y="68"
        width="64"
        height="12"
        rx="2"
        className="text-slate-800 dark:text-amber-300"
      />

      {/* Central Ashoka Chakra in Abacus */}
      <circle cx="50" cy="74" r="5" className="text-slate-100 dark:text-slate-950" />
      <circle cx="50" cy="74" r="4.2" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-blue-600 dark:text-sky-400" />
      <circle cx="50" cy="74" r="1" className="text-blue-700 dark:text-sky-300" />
      {/* Spoke marks */}
      <path
        d="M50 70 L50 78 M46 74 L54 74 M47.2 71.2 L52.8 76.8 M47.2 76.8 L52.8 71.2"
        stroke="currentColor"
        strokeWidth="0.6"
        className="text-blue-600 dark:text-sky-400"
      />

      {/* Galloping Horse (Left of Chakra) */}
      <path
        d="M26 73 C28 71, 31 72, 33 74 L32 76 C30 76, 28 75, 26 76 Z"
        className="text-slate-200 dark:text-slate-900"
      />

      {/* Indian Bull (Right of Chakra) */}
      <path
        d="M66 73 C68 71, 71 72, 73 74 L72 76 C70 76, 68 75, 66 76 Z"
        className="text-slate-200 dark:text-slate-900"
      />

      {/* Inverted Lotus Base (Padma) */}
      <path
        d="M22 81 C22 81, 35 90, 50 90 C65 90, 78 81, 78 81 L74 95 C68 98, 58 100, 50 100 C42 100, 32 98, 26 95 Z"
        className="text-slate-800 dark:text-amber-200/90"
      />
      {/* Lotus Petal Grooves */}
      <path
        d="M34 83 C38 90, 42 95, 42 97 M50 85 L50 99 M66 83 C62 90, 58 95, 58 97"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        className="text-slate-900 dark:text-amber-400"
      />

      {/* Base Plinth */}
      <rect
        x="24"
        y="100"
        width="52"
        height="4"
        rx="1"
        className="text-slate-800 dark:text-amber-300"
      />

      {/* Motto: "सत्यमेव जयते" (Satyameva Jayate) */}
      <text
        x="50"
        y="118"
        textAnchor="middle"
        fontFamily="'Noto Sans Devanagari', sans-serif"
        fontSize="9.5"
        fontWeight="700"
        letterSpacing="0.05em"
        className="fill-slate-900 dark:fill-amber-100 select-none"
      >
        सत्यमेव जयते
      </text>
    </svg>
  );
}

export default AshokaEmblem;

