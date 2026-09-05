import { HotelFacility } from '../types/database';

export const hotelFacilities: HotelFacility[] = [
  {
    id: 'fac-reception',
    name: '24-Hour Front Desk',
    description: 'Round-the-clock reception team ready to assist with check-in, local enquiries, and guest requests.',
    icon: 'Clock',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'fac-wifi',
    name: 'High-Speed Wi-Fi',
    description: 'Complimentary wireless internet access across all guest rooms, public lobbies, and event spaces.',
    icon: 'Wifi',
    is_active: true,
    sort_order: 2
  },
  {
    id: 'fac-dining',
    name: 'On-Site Restaurant & Café',
    description: 'Daily buffet breakfast, lunch, and dinner offering flavorful international and Middle Eastern cuisines.',
    icon: 'UtensilsCrossed',
    is_active: true,
    sort_order: 3
  },
  {
    id: 'fac-events',
    name: 'Banquet & Meeting Facilities',
    description: 'Versatile event halls and meeting rooms for business conferences, private parties, and receptions.',
    icon: 'Users',
    is_active: true,
    sort_order: 4
  },
  {
    id: 'fac-fitness',
    name: 'Fitness Centre',
    description: 'Equipped exercise room with cardio and strength equipment for guest health and wellness.',
    icon: 'Dumbbell',
    is_active: true,
    sort_order: 5
  },
  {
    id: 'fac-concierge',
    name: 'Concierge & Luggage Assistance',
    description: 'Assistance with transport bookings, luggage storage, and local Sharjah recommendations.',
    icon: 'Luggage',
    is_active: true,
    sort_order: 6
  },
  {
    id: 'fac-housekeeping',
    name: 'Housekeeping and Cleaning',
    description: 'Dedicated daily housekeeping, professional sanitization, and attentive room cleaning for a comfortable stay.',
    icon: 'Sparkles',
    is_active: true,
    sort_order: 7
  },
  {
    id: 'fac-location',
    name: 'Convenient Al Qasimia Location',
    description: 'Easy walking and driving access to retail centers, dining spots, and cultural landmarks of Sharjah.',
    icon: 'MapPin',
    is_active: true,
    sort_order: 8
  }
];
