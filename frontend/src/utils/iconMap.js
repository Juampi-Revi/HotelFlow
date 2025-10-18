// Tokens and default labels for feature icons.
export const ICON_DEFINITIONS = [
  { token: 'wifi', label: 'Wi‑Fi' },
  { token: 'air_conditioning', label: 'Air conditioning' },
  { token: 'balcony', label: 'Balcony' },
  { token: 'breakfast', label: 'Breakfast' },
  { token: 'ocean_view', label: 'Ocean view' },
  { token: 'pet_friendly', label: 'Pet friendly' },
  { token: 'gym', label: 'Gym' },
  { token: 'spa', label: 'Spa' },
  { token: 'shuttle', label: 'Shuttle' },
  { token: 'late_checkout', label: 'Late checkout' },
  { token: 'accessible', label: 'Accessible' },
  { token: 'parking', label: 'Parking' },
  { token: 'tv', label: 'TV' },
  { token: 'minibar', label: 'Minibar' },
  { token: 'safe', label: 'Safe' },
  { token: 'room_service', label: 'Room service' },
  { token: 'laundry', label: 'Laundry' },
  { token: 'pool', label: 'Pool' },
  { token: 'garden_view', label: 'Garden view' },
  { token: 'mountain_view', label: 'Mountain view' },
  { token: 'city_view', label: 'City view' },
  { token: 'coffee', label: 'Coffee' },
];

export const ICON_LABELS = ICON_DEFINITIONS.reduce((acc, { token, label }) => {
  acc[token] = label;
  return acc;
}, {});