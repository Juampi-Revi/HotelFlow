import React from 'react';

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const WifiIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M3 10c4.5-4 13.5-4 18 0" />
    <path d="M6 13c3-2.5 9-2.5 12 0" />
    <path d="M9 16c1.5-1.2 4.5-1.2 6 0" />
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const SnowflakeIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M12 3v18" />
    <path d="M5 7l14 10" />
    <path d="M19 7L5 17" />
    <path d="M7 5l10 14" />
    <path d="M17 5L7 19" />
  </svg>
);

const BalconyIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="5" y="4" width="14" height="10" rx="2" />
    <path d="M5 14h14" />
    <path d="M6 18h12" />
  </svg>
);

const CoffeeIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M4 8h11a3 3 0 0 1 0 6H4V8z" />
    <path d="M15 10h2a2 2 0 0 1 0 4h-2" />
    <path d="M6 16v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1" />
  </svg>
);

const WaterIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M3 15c2 1 4 1 6 0s4-1 6 0 4 1 6 0" />
    <path d="M3 19c2 1 4 1 6 0s4-1 6 0 4 1 6 0" />
  </svg>
);

const PawIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <circle cx="8" cy="8" r="2" />
    <circle cx="16" cy="8" r="2" />
    <circle cx="9" cy="12" r="2" />
    <circle cx="15" cy="12" r="2" />
    <path d="M12 14c-2 0-3 2-3 3s1.5 2 3 2 3-1 3-2-1-3-3-3z" />
  </svg>
);

const DumbbellIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="3" y="9" width="3" height="6" />
    <rect x="18" y="9" width="3" height="6" />
    <rect x="7" y="10" width="10" height="4" />
  </svg>
);

const SpaIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M12 12c2-3 1-6-2-7 1 3-1 5-4 5 2 1 4 3 4 6 1-2 2-3 2-4z" />
    <path d="M12 12c-2-3-1-6 2-7-1 3 1 5 4 5-2 1-4 3-4 6-1-2-2-3-2-4z" />
  </svg>
);

const VanIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="3" y="8" width="13" height="7" rx="1" />
    <path d="M16 10h3l2 3v2h-5" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="18" cy="17" r="2" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v5l3 2" />
  </svg>
);

const WheelchairIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <circle cx="9" cy="5" r="2" />
    <path d="M9 7l1 4h4l2 6" />
    <circle cx="10" cy="18" r="3" />
  </svg>
);

const CarIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M3 13l2-4h10l2 4" />
    <rect x="4" y="13" width="14" height="4" rx="1" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);

const TvIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="4" y="6" width="16" height="12" rx="2" />
    <path d="M8 3l4 3 4-3" />
  </svg>
);

const WineIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M7 4h10l-1 5a5 5 0 0 1-8 0L7 4z" />
    <path d="M12 9v5" />
    <path d="M9 20h6" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="6" y="10" width="12" height="9" rx="2" />
    <path d="M9 10V7a3 3 0 0 1 6 0v3" />
  </svg>
);

const BellIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M12 3a4 4 0 0 1 4 4v3c0 2 1 3 2 4H6c1-1 2-2 2-4V7a4 4 0 0 1 4-4z" />
    <path d="M10 18a2 2 0 0 0 4 0" />
  </svg>
);

const TshirtIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M9 4l3 2 3-2 3 3-3 2v9H9V9L6 7 3 4l3-3 3 3z" />
  </svg>
);

const PoolIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <circle cx="6" cy="8" r="2" />
    <path d="M8 9l3 2 3-1" />
    <path d="M3 16c2 1 4 1 6 0s4-1 6 0 4 1 6 0" />
  </svg>
);

const LeafIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M5 13c5-7 11-7 14-6-1 6-7 10-12 9-1 0-2-1-2-3z" />
    <path d="M6 12c2 1 3 2 4 4" />
  </svg>
);

const MountainIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M3 19l6-10 3 5 3-4 6 9H3z" />
  </svg>
);

const CityIcon = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="4" y="8" width="4" height="8" />
    <rect x="10" y="5" width="4" height="11" />
    <rect x="16" y="10" width="4" height="6" />
  </svg>
);

const MinibarIcon = WineIcon;
const SafeIcon = LockIcon;
const RoomServiceIcon = BellIcon;

export function renderFeatureIcon(token, className = 'h-5 w-5') {
  const map = {
    wifi: WifiIcon,
    air_conditioning: SnowflakeIcon,
    balcony: BalconyIcon,
    breakfast: CoffeeIcon,
    ocean_view: WaterIcon,
    pet_friendly: PawIcon,
    gym: DumbbellIcon,
    spa: SpaIcon,
    shuttle: VanIcon,
    late_checkout: ClockIcon,
    accessible: WheelchairIcon,
    parking: CarIcon,
    tv: TvIcon,
    minibar: MinibarIcon,
    safe: SafeIcon,
    room_service: RoomServiceIcon,
    laundry: TshirtIcon,
    pool: PoolIcon,
    garden_view: LeafIcon,
    mountain_view: MountainIcon,
    city_view: CityIcon,
    coffee: CoffeeIcon,
  };
  const Cmp = map[token];
  return Cmp ? <Cmp className={className} /> : null;
}