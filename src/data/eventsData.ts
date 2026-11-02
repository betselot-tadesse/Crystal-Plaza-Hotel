import { EventVenue } from '../types/database';
import { getSafeImageUrl } from '../services/imageService';

export const eventCategories = [
  {
    id: 'weddings',
    title: 'Weddings & Receptions',
    description: 'Intimate and memorable wedding celebrations tailored with elegant banquet seating, customized catering menus, stage setup, and warm hospitality.',
    icon: 'HeartHandshake',
    image: getSafeImageUrl('/images/hotel/Whats_App_Image_2026_08_25_at_1_58_22_PM.jpg', 'banquet_hero')
  },
  {
    id: 'corporate',
    title: 'Corporate Meetings & Seminars',
    description: 'Professional meeting spaces equipped with modern audiovisual systems, high-speed Wi-Fi, presentation screens, and dedicated coffee break services.',
    icon: 'Briefcase',
    image: getSafeImageUrl('/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg', 'banquet_stage')
  },
  {
    id: 'conferences',
    title: 'Conferences & Workshops',
    description: 'Flexible theater or classroom layouts providing comfortable seating, high clarity sound reinforcement, and dedicated on-site technical assistance.',
    icon: 'Users',
    image: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_19_PM.jpg'
  },
  {
    id: 'birthdays',
    title: 'Birthdays & Private Celebrations',
    description: 'A vibrant, convenient venue in Al Qasimia for anniversary dinners, milestone birthdays, and family reunions with custom buffet options.',
    icon: 'Sparkles',
    image: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_19_PM.jpg'
  },
  {
    id: 'social',
    title: 'Social & Community Events',
    description: 'Spacious event halls designed to host community gatherings, award ceremonies, and seasonal cultural gatherings in Sharjah.',
    icon: 'PartyPopper',
    image: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg'
  }
];

export const banquetHallGallery = [
  {
    url: getSafeImageUrl('/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg', 'banquet_hero'),
    title: 'Crystal Banquet Hall & Reception',
    caption: 'Spacious banquet hall arrangement for weddings, celebrations, and conferences'
  },
  {
    url: getSafeImageUrl('/images/hotel/Whats_App_Image_2026_08_25_at_1_58_19_PM.jpg', 'banquet_stage'),
    title: 'Banquet Hall Stage & Event Layout',
    caption: 'Flexible layout with elevated stage and formal seating'
  },
  {
    url: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_22_PM.jpg',
    title: 'Banquet Celebration Setting',
    caption: 'Atmospheric banquet hall setting with warm illumination'
  },
  {
    url: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_19_PM.jpg',
    title: 'Banquet Hall Seating Arrangement',
    caption: 'Wide dining and guest seating setup with chandeliers and carpet'
  },
  {
    url: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg',
    title: 'Banquet Hall Interior View',
    caption: 'Full panoramic perspective of the banquet hall ready for events'
  }
];

export const venueHalls: EventVenue[] = [
  {
    id: 'crystal-ballroom',
    name: 'Crystal Banquet Hall',
    description: 'The premier event hall at Crystal Plaza Hotel featuring adaptable partition layouts, chandelier lighting, and a spacious foyer. Perfect for grand dinners, corporate galas, and wedding receptions.',
    image: getSafeImageUrl('/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg', 'banquet_hero'),
    images: [
      getSafeImageUrl('/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg', 'banquet_hero'),
      getSafeImageUrl('/images/hotel/Whats_App_Image_2026_08_25_at_1_58_19_PM.jpg', 'banquet_stage'),
      '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_22_PM.jpg'
    ],
    capacity: {
      people: 'Up to 150 People Capacity',
      classroom: 50
    },
    facilities: [
      'High-Definition Projector & Motorized Screen',
      'Professional PA Sound System & Wireless Mics',
      'Customized Stage & Podium Setup',
      'High-Speed Wi-Fi for Attendees',
      'Flexible Ambient Lighting Controls',
      'Dedicated Foyer for Registration & Buffet',
      'Dedicated Event Coordinator on Site'
    ],
    package_details: [
      'Customizable Multi-Cousined Buffet Options',
      'Welcome Drinks & Tea/Coffee Service',
      'Table Linens & Chair Covers with Color Accents',
      'Complimentary Stage & Podium'
    ],
    is_active: true,
    sort_order: 1
  }
];
