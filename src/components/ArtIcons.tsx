import React from 'react';
import { Choice } from '../game/rules';

interface ArtIconProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

/**
 * Bespoke Cyber-Viper Snake SVG Emblem
 */
export const SnakeArt: React.FC<ArtIconProps> = ({ className = '', size = 96, glow = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className} ${glow ? 'filter drop-shadow-[0_0_12px_rgba(16,185,129,0.7)]' : ''}`}
      aria-label="Snake emblem"
    >
      <defs>
        <linearGradient id="snakeGrad" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="60%" stopColor="#059669" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>
        <linearGradient id="snakeGlow" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a7f3d0" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>

      {/* Outer Hex / Shield Silhouette */}
      <polygon
        points="50,6 88,28 88,72 50,94 12,72 12,28"
        stroke="#10b981"
        strokeWidth="2"
        strokeOpacity="0.4"
        fill="#042f2e"
        fillOpacity="0.35"
      />

      {/* Serpentine Body Curve */}
      <path
        d="M 50 16 
           C 65 16, 76 26, 76 38 
           C 76 52, 60 56, 50 62 
           C 38 70, 32 78, 38 86 
           C 42 92, 54 92, 60 86 
           C 66 80, 68 76, 76 74"
        stroke="url(#snakeGrad)"
        strokeWidth="11"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner Scale Highlights */}
      <path
        d="M 50 18 C 62 18, 72 26, 72 36 C 72 48, 58 53, 49 59"
        stroke="#6ee7b7"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 6"
        fill="none"
      />

      {/* Viper Head */}
      <path
        d="M 50 14 L 38 26 L 42 34 L 58 34 L 62 26 Z"
        fill="url(#snakeGlow)"
        stroke="#34d399"
        strokeWidth="2"
      />

      {/* Glowing Venom Eyes */}
      <circle cx="43" cy="25" r="2.5" fill="#fef08a" />
      <circle cx="57" cy="25" r="2.5" fill="#fef08a" />
      <circle cx="43.5" cy="25" r="1.2" fill="#854d0e" />
      <circle cx="57.5" cy="25" r="1.2" fill="#854d0e" />

      {/* Forked Tongue */}
      <path
        d="M 50 14 L 50 6 M 50 6 L 46 2 M 50 6 L 54 2"
        stroke="#f43f5e"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Fangs */}
      <polygon points="44,34 46,38 48,34" fill="#ffffff" />
      <polygon points="52,34 54,38 56,34" fill="#ffffff" />
    </svg>
  );
};

/**
 * Hydro-Vortex Water SVG Emblem
 */
export const WaterArt: React.FC<ArtIconProps> = ({ className = '', size = 96, glow = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className} ${glow ? 'filter drop-shadow-[0_0_12px_rgba(6,182,212,0.7)]' : ''}`}
      aria-label="Water emblem"
    >
      <defs>
        <linearGradient id="waterGrad" x1="15" y1="15" x2="85" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="50%" stopColor="#0891b2" />
          <stop offset="100%" stopColor="#164e63" />
        </linearGradient>
        <radialGradient id="dropletGlow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#cffafe" />
          <stop offset="70%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0e7490" />
        </radialGradient>
      </defs>

      {/* Outer Hex / Shield Silhouette */}
      <polygon
        points="50,6 88,28 88,72 50,94 12,72 12,28"
        stroke="#06b6d4"
        strokeWidth="2"
        strokeOpacity="0.4"
        fill="#083344"
        fillOpacity="0.35"
      />

      {/* Main Hydro Droplet */}
      <path
        d="M 50 14 
           C 50 14, 76 48, 76 66 
           C 76 80, 64 88, 50 88 
           C 36 88, 24 80, 24 66 
           C 24 48, 50 14, 50 14 Z"
        fill="url(#dropletGlow)"
        stroke="#22d3ee"
        strokeWidth="2.5"
      />

      {/* Dynamic Wave Swirls inside droplet */}
      <path
        d="M 33 66 C 39 58, 47 72, 54 64 C 61 56, 67 62, 71 64"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.75"
        fill="none"
      />
      <path
        d="M 38 74 C 44 68, 52 78, 58 72 C 63 67, 66 70, 68 72"
        stroke="#a5f3fc"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Droplet Highlight Sheen */}
      <ellipse cx="40" cy="46" rx="6" ry="12" transform="rotate(-30 40 46)" fill="#ffffff" fillOpacity="0.6" />
      <circle cx="36" cy="36" r="2.5" fill="#ffffff" fillOpacity="0.8" />

      {/* Floating Mini Orbs */}
      <circle cx="26" cy="36" r="3.5" fill="#67e8f9" />
      <circle cx="74" cy="38" r="3" fill="#67e8f9" />
      <circle cx="50" cy="8" r="2.5" fill="#a5f3fc" />
    </svg>
  );
};

/**
 * Cyber-Railgun / Energy Blaster SVG Emblem
 */
export const GunArt: React.FC<ArtIconProps> = ({ className = '', size = 96, glow = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-300 ${className} ${glow ? 'filter drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]' : ''}`}
      aria-label="Gun emblem"
    >
      <defs>
        <linearGradient id="gunGrad" x1="10" y1="20" x2="90" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="45%" stopColor="#9333ea" />
          <stop offset="100%" stopColor="#4c1d95" />
        </linearGradient>
        <linearGradient id="plasmaCore" x1="20" y1="36" x2="80" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e879f9" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
      </defs>

      {/* Outer Hex / Shield Silhouette */}
      <polygon
        points="50,6 88,28 88,72 50,94 12,72 12,28"
        stroke="#a855f7"
        strokeWidth="2"
        strokeOpacity="0.4"
        fill="#3b0764"
        fillOpacity="0.35"
      />

      {/* Futuristic Pistol Frame */}
      {/* Top Slide & Barrel */}
      <rect x="22" y="28" width="56" height="15" rx="3" fill="url(#gunGrad)" stroke="#d8b4fe" strokeWidth="2" />
      {/* Muzzle Tip */}
      <rect x="78" y="31" width="8" height="9" rx="1" fill="#c084fc" />

      {/* Plasma Barrel Heat Vents */}
      <rect x="28" y="32" width="6" height="7" rx="1" fill="#2e1065" />
      <rect x="38" y="32" width="6" height="7" rx="1" fill="#2e1065" />
      <rect x="48" y="32" width="6" height="7" rx="1" fill="#2e1065" />
      <line x1="26" y1="40" x2="74" y2="40" stroke="url(#plasmaCore)" strokeWidth="2" />

      {/* Ergonomic Grip */}
      <path
        d="M 28 43 L 38 84 L 54 82 L 48 43 Z"
        fill="#581c87"
        stroke="#a855f7"
        strokeWidth="2"
      />
      {/* Grip Texture lines */}
      <line x1="33" y1="52" x2="47" y2="50" stroke="#c084fc" strokeWidth="1.5" />
      <line x1="35" y1="62" x2="49" y2="60" stroke="#c084fc" strokeWidth="1.5" />
      <line x1="37" y1="72" x2="51" y2="70" stroke="#c084fc" strokeWidth="1.5" />

      {/* Trigger Guard & Trigger */}
      <path
        d="M 48 44 C 54 44, 58 52, 54 58 L 46 58"
        stroke="#c084fc"
        strokeWidth="2"
        fill="none"
      />
      <path d="M 46 48 C 48 50, 48 54, 45 54" stroke="#f43f5e" strokeWidth="2.5" fill="none" />

      {/* Plasma Power Indicator Cell */}
      <circle cx="34" cy="48" r="3.5" fill="#38bdf8" />
      <circle cx="34" cy="48" r="1.5" fill="#ffffff" />

      {/* Laser Sight / Blast Flash Ray */}
      <path d="M 86 35.5 L 94 35.5" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
};

export const ChoiceArt: React.FC<{ choice: Choice; size?: number; glow?: boolean; className?: string }> = ({
  choice,
  size = 96,
  glow = false,
  className = '',
}) => {
  switch (choice) {
    case 'snake':
      return <SnakeArt size={size} glow={glow} className={className} />;
    case 'water':
      return <WaterArt size={size} glow={glow} className={className} />;
    case 'gun':
      return <GunArt size={size} glow={glow} className={className} />;
  }
};
