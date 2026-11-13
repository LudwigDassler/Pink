import React from 'react';
import type { CategoryIconKey } from '../config/siteConfig';

export interface CategoryIconProps {
  icon: CategoryIconKey;
  className?: string;
}

export function CategoryIcon({
  icon,
  className = 'w-7 h-7',
}: CategoryIconProps): React.JSX.Element {
  const sharedProps = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };

  switch (icon) {
    case 'motors':
      return (
        <svg {...sharedProps}>
          {/* Terminal box */}
          <rect x="16" y="9" width="12" height="6" rx="1" />
          <line x1="19.5" y1="12" x2="24.5" y2="12" />
          {/* Stator housing */}
          <rect x="10" y="15" width="24" height="20" rx="2.5" />
          {/* Cooling fins */}
          <line x1="13.5" y1="19.5" x2="30.5" y2="19.5" />
          <line x1="13.5" y1="23.5" x2="30.5" y2="23.5" />
          <line x1="13.5" y1="27.5" x2="30.5" y2="27.5" />
          <line x1="13.5" y1="31.5" x2="30.5" y2="31.5" />
          {/* Rear fan cowl */}
          <path d="M10 18H7.5A1.5 1.5 0 0 0 6 19.5v11A1.5 1.5 0 0 0 7.5 32H10" />
          {/* Drive end shield & shaft */}
          <path d="M34 17.5h2.5A1.5 1.5 0 0 1 38 19v12a1.5 1.5 0 0 1-1.5 1.5H34" />
          <rect x="38" y="23" width="6" height="4" rx="0.5" />
          {/* Mounting feet */}
          <path d="M14 35v4M30 35v4M10 39h24" />
        </svg>
      );

    case 'bearings':
      return (
        <svg {...sharedProps}>
          {/* Outer race */}
          <circle cx="24" cy="24" r="18" />
          <circle cx="24" cy="24" r="14.5" />
          {/* Inner race & shaft bore */}
          <circle cx="24" cy="24" r="9.5" />
          <circle cx="24" cy="24" r="5.5" />
          {/* Rolling elements */}
          <circle cx="24" cy="12" r="2" />
          <circle cx="32.5" cy="15.5" r="2" />
          <circle cx="36" cy="24" r="2" />
          <circle cx="32.5" cy="32.5" r="2" />
          <circle cx="24" cy="36" r="2" />
          <circle cx="15.5" cy="32.5" r="2" />
          <circle cx="12" cy="24" r="2" />
          <circle cx="15.5" cy="15.5" r="2" />
        </svg>
      );

    case 'transformers':
      return (
        <svg {...sharedProps}>
          {/* HV / LV bushings */}
          <line x1="17" y1="7" x2="17" y2="20" />
          <circle cx="17" cy="6.5" r="1.2" />
          <line x1="14" y1="11" x2="20" y2="11" />
          <line x1="13.5" y1="14" x2="20.5" y2="14" />
          <line x1="13" y1="17" x2="21" y2="17" />

          <line x1="31" y1="7" x2="31" y2="20" />
          <circle cx="31" cy="6.5" r="1.2" />
          <line x1="28" y1="11" x2="34" y2="11" />
          <line x1="27.5" y1="14" x2="34.5" y2="14" />
          <line x1="27" y1="17" x2="35" y2="17" />

          {/* Main tank & cover */}
          <line x1="7" y1="20" x2="41" y2="20" />
          <rect x="10" y="20" width="28" height="19" rx="1.5" />
          {/* Radiator side fins */}
          <path d="M10 23H6.5v13H10M38 23h3.5v13H38" />
          {/* Tank cooling ribs */}
          <line x1="16" y1="24" x2="16" y2="35" />
          <line x1="21.3" y1="24" x2="21.3" y2="35" />
          <line x1="26.7" y1="24" x2="26.7" y2="35" />
          <line x1="32" y1="24" x2="32" y2="35" />
          {/* Base skid */}
          <line x1="8" y1="39" x2="40" y2="39" />
          <line x1="13" y1="39" x2="13" y2="42" />
          <line x1="35" y1="39" x2="35" y2="42" />
        </svg>
      );

    case 'valves':
      return (
        <svg {...sharedProps}>
          {/* Handwheel & stem */}
          <ellipse cx="24" cy="9.5" rx="9.5" ry="2.5" />
          <line x1="16" y1="9.5" x2="32" y2="9.5" />
          <line x1="24" y1="12" x2="24" y2="17" />
          {/* Bonnet */}
          <rect x="19.5" y="17" width="9" height="4" rx="1" />
          {/* Left & right flanges */}
          <rect x="6" y="21" width="4" height="18" rx="1" />
          <rect x="38" y="21" width="4" height="18" rx="1" />
          {/* Valve body */}
          <path d="M10 25h6.5l3-4h9l3 4H38" />
          <path d="M10 35h6.5l3 4h9l3-4H38" />
          <circle cx="24" cy="30" r="4.5" />
        </svg>
      );

    case 'pipes':
      return (
        <svg {...sharedProps}>
          {/* Front cross-sections of 3 stacked tubes */}
          <circle cx="13.5" cy="34" r="5.5" />
          <circle cx="13.5" cy="34" r="2.6" />

          <circle cx="25" cy="34" r="5.5" />
          <circle cx="25" cy="34" r="2.6" />

          <circle cx="19.25" cy="24" r="5.5" />
          <circle cx="19.25" cy="24" r="2.6" />

          {/* Isometric receding barrel lines */}
          <line x1="16" y1="19.5" x2="30" y2="11.5" />
          <line x1="23.8" y1="20.9" x2="37.8" y2="12.9" />
          <path d="M30 11.5a5.5 5.5 0 0 1 7.8 1.4" />

          <line x1="29.5" y1="30.8" x2="41.5" y2="23.8" />
          <line x1="28.2" y1="38.5" x2="40.2" y2="31.5" />
          <path d="M37.8 12.9a5.5 5.5 0 0 1 0.8 6.8" />
          <path d="M41.5 23.8a5.5 5.5 0 0 1-1.3 7.7" />
        </svg>
      );

    case 'cables':
      return (
        <svg {...sharedProps}>
          {/* Bare conductor tips */}
          <line x1="18.5" y1="13" x2="18.5" y2="7.5" />
          <line x1="24" y1="12" x2="24" y2="6.5" />
          <line x1="29.5" y1="13" x2="29.5" y2="7.5" />
          {/* Core insulation */}
          <rect x="16.8" y="13" width="3.4" height="6" rx="0.8" />
          <rect x="22.3" y="12" width="3.4" height="7" rx="0.8" />
          <rect x="27.8" y="13" width="3.4" height="6" rx="0.8" />
          {/* Steel tape armor collar */}
          <rect x="15" y="19" width="18" height="5.5" rx="1" />
          <line x1="19" y1="19" x2="17" y2="24.5" />
          <line x1="25" y1="19" x2="23" y2="24.5" />
          <line x1="31" y1="19" x2="29" y2="24.5" />
          {/* Outer protective jacket */}
          <rect x="13" y="24.5" width="22" height="17.5" rx="2" />
          <line x1="17" y1="29.5" x2="31" y2="29.5" />
          <line x1="17" y1="34" x2="27" y2="34" />
        </svg>
      );

    case 'fasteners':
      return (
        <svg {...sharedProps}>
          {/* Hex bolt head & flange */}
          <rect x="9" y="8" width="18" height="6" rx="1" />
          <line x1="14" y1="8" x2="14" y2="14" />
          <line x1="22" y1="8" x2="22" y2="14" />
          <line x1="7" y1="14" x2="29" y2="14" />
          {/* Bolt shank & threads */}
          <path d="M14 14v23.5l2 2.5h4l2-2.5V14" />
          <line x1="14" y1="22" x2="22" y2="20.5" />
          <line x1="14" y1="26.5" x2="22" y2="25" />
          <line x1="14" y1="31" x2="22" y2="29.5" />
          <line x1="14" y1="35.5" x2="22" y2="34" />
          {/* Hex nut front CAD view */}
          <polygon points="35,23 41.5,26.8 41.5,34.2 35,38 28.5,34.2 28.5,26.8" />
          <circle cx="35" cy="30.5" r="3.2" />
        </svg>
      );

    case 'cylinders':
      return (
        <svg {...sharedProps}>
          {/* Top valve handwheel & outlet */}
          <line x1="20" y1="6.5" x2="28" y2="6.5" />
          <line x1="24" y1="6.5" x2="24" y2="11" />
          <path d="M26.5 9.5h4v2.2h-4" />
          {/* Neck ring */}
          <rect x="21" y="11" width="6" height="3.5" rx="0.8" />
          {/* High-pressure vessel body */}
          <path d="M16 22.5a8 8 0 0 1 16 0V39a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V22.5Z" />
          {/* Shoulder & inspection lines */}
          <line x1="16" y1="23" x2="32" y2="23" />
          <line x1="19" y1="28" x2="29" y2="28" />
          <line x1="14.5" y1="41" x2="33.5" y2="41" />
        </svg>
      );

    case 'generic':
    default:
      return (
        <svg {...sharedProps}>
          <polygon points="24,7 40,16 40,32 24,41 8,32 8,16" />
          <polyline points="8,16 24,25 40,16" />
          <line x1="24" y1="25" x2="24" y2="41" />
          <line x1="16" y1="11.5" x2="32" y2="20.5" />
        </svg>
      );
  }
}
