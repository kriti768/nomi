'use client';

import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'gradient' | 'monochrome' | 'white' | 'dark';
  withWordmark?: boolean;
  wordmarkClassName?: string;
  className?: string;
}

export const NomiLogo: React.FC<Props> = ({
  size = 'md',
  variant = 'gradient',
  withWordmark = false,
  wordmarkClassName = '',
  className = '',
}) => {
  const pixelSize = typeof size === 'number' ? size : {
    sm: 30,
    md: 38,
    lg: 48,
    xl: 58,
  }[size];

  const primaryGradientId = React.useId();
  const secondaryGradientId = React.useId();
  const shadowFilterId = React.useId();

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Abstract Form Card / Conversational Sheet Symbol */}
      <svg
        width={pixelSize}
        height={pixelSize}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200 hover:scale-105"
        aria-hidden="true"
      >
        <defs>
          {/* Main Brand Gradient */}
          <linearGradient id={primaryGradientId} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E05B8C" />
            <stop offset="50%" stopColor="#C65A87" />
            <stop offset="100%" stopColor="#7E68B8" />
          </linearGradient>

          {/* Secondary Layer Sheet Gradient */}
          <linearGradient id={secondaryGradientId} x1="12" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9C82CF" />
            <stop offset="100%" stopColor="#6C53A2" />
          </linearGradient>

          {/* Soft Ambient Shadow */}
          <filter id={shadowFilterId} x="0" y="2" width="40" height="38" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#7E68B8" floodOpacity="0.25" />
          </filter>
        </defs>

        <g filter={`url(#${shadowFilterId})`}>
          {/* Background Card Sheet (Slight tilt) */}
          <rect
            x="7"
            y="6"
            width="25"
            height="27"
            rx="6"
            transform="rotate(-5 19.5 19.5)"
            fill={variant === 'white' ? 'rgba(255, 255, 255, 0.35)' : `url(#${secondaryGradientId})`}
            opacity="0.85"
          />

          {/* Foreground Primary Sheet with folded top-right accent */}
          <path
            d="M 12 8 
               L 26 8 
               L 32 14 
               L 32 30 
               A 6 6 0 0 1 26 36 
               L 12 36 
               A 6 6 0 0 1 6 30 
               L 6 14 
               A 6 6 0 0 1 12 8 Z"
            fill={variant === 'white' ? '#FFFFFF' : variant === 'dark' ? '#241734' : `url(#${primaryGradientId})`}
          />

          {/* Folded Corner Triangle */}
          <path
            d="M 26 8 L 26 14 L 32 14 Z"
            fill={variant === 'white' ? 'rgba(255, 255, 255, 0.8)' : '#FF9BBF'}
            opacity="0.9"
          />

          {/* Conversational Content Lines / Abstract 'N' Dynamic Bars */}
          {variant === 'white' ? (
            <>
              <rect x="11" y="15" width="10" height="2.5" rx="1.25" fill="#7E68B8" opacity="0.9" />
              <rect x="11" y="20.5" width="15" height="2.5" rx="1.25" fill="#7E68B8" opacity="0.9" />
              <rect x="11" y="26" width="7" height="2.5" rx="1.25" fill="#7E68B8" opacity="0.9" />
            </>
          ) : (
            <>
              <rect x="11" y="15" width="10" height="2.5" rx="1.25" fill="#FFFFFF" opacity="0.95" />
              <rect x="11" y="20.5" width="15" height="2.5" rx="1.25" fill="#FFFFFF" opacity="0.95" />
              <rect x="11" y="26" width="7" height="2.5" rx="1.25" fill="#FFFFFF" opacity="0.95" />
            </>
          )}

          {/* Active Conversational Indicator Pulse */}
          <circle cx="27" cy="27" r="2.2" fill={variant === 'white' ? '#C65A87' : '#FFFFFF'} />
        </g>
      </svg>

      {/* Wordmark */}
      {withWordmark && (
        <span
          className={`font-black tracking-tight leading-none text-2xl sm:text-3xl ${
            variant === 'white' ? 'text-white' : 'text-slate-900 dark:text-slate-100'
          } ${wordmarkClassName}`}
        >
          Nomi
        </span>
      )}
    </div>
  );
};
