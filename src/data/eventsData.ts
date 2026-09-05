import { EventVenue } from '../types/database';

export const eventCategories = [
  {
    id: 'weddings',
    title: 'Weddings & Receptions',
    description: 'Intimate and memorable wedding celebrations tailored with elegant banquet seating, customized catering menus, stage setup, and warm hospitality.',
    icon: 'HeartHandshake',
    image: 'https://i.ibb.co/4Rcjw4Hk/Whats-App-Image-2026-08-25-at-1-58-22-PM.jpg'
  },
  {
    id: 'corporate',
    title: 'Corporate Meetings & Seminars',
    description: 'Professional meeting spaces equipped with modern audiovisual systems, high-speed Wi-Fi, presentation screens, and dedicated coffee break services.',
    icon: 'Briefcase',
    image: 'https://i.ibb.co/Wv8YjnbL/MEETING-ROOM.jpg'
  },
  {
    id: 'conferences',
    title: 'Conferences & Workshops',
    description: 'Flexible theater or classroom layouts providing comfortable seating, high clarity sound reinforcement, and dedicated on-site technical assistance.',
    icon: 'Users',
    image: 'https://i.ibb.co/xSLWpww1/Whats-App-Image-2026-08-25-at-1-58-12-PM.jpg'
  },
  {
    id: 'birthdays',
    title: 'Birthdays & Private Celebrations',
    description: 'A vibrant, convenient venue in Al Qasimia for anniversary dinners, milestone birthdays, and family reunions with custom buffet options.',
    icon: 'Sparkles',
    image: 'https://i.ibb.co/994kcxnM/Whats-App-Image-2026-08-25-at-1-58-19-PM.jpg'
  },
  {
    id: 'social',
    title: 'Social & Community Events',
    description: 'Spacious event halls designed to host community gatherings, award ceremonies, and seasonal cultural gatherings in Sharjah.',
    icon: 'PartyPopper',
    image: 'https://i.ibb.co/6JvRNWrw/Whats-App-Image-2026-08-25-at-1-58-17-PM.jpg'
  }
];

export const banquetHallGallery = [
  {
    url: 'https://i.ibb.co/6JvRNWrw/Whats-App-Image-2026-08-25-at-1-58-17-PM.jpg',
    title: 'Crystal Banquet Hall & Reception',
    caption: 'Spacious banquet hall arrangement for weddings, celebrations, and conferences'
  },
  {
    url: 'https://i.ibb.co/xSLWpww1/Whats-App-Image-2026-08-25-at-1-58-12-PM.jpg',
    title: 'Banquet Hall Stage & Event Layout',
    caption: 'Flexible layout with elevated stage and formal seating'
  },
  {
    url: 'https://i.ibb.co/4Rcjw4Hk/Whats-App-Image-2026-08-25-at-1-58-22-PM.jpg',
    title: 'Banquet Celebration Setting',
    caption: 'Atmospheric banquet hall setting with warm illumination'
  },
  {
    url: 'https://i.ibb.co/994kcxnM/Whats-App-Image-2026-08-25-at-1-58-19-PM.jpg',
    title: 'Banquet Hall Seating Arrangement',
    caption: 'Wide dining and guest seating setup with chandeliers and carpet'
  },
  {
    url: 'https://i.ibb.co/ZRyNTJj4/Whats-App-Image-2026-08-08-at-4-47-57-PM.jpg',
    title: 'Banquet Hall Interior View',
    caption: 'Full panoramic perspective of the banquet hall ready for events'
  }
];

export const venueHalls: EventVenue[] = [
  {
    id: 'crystal-ballroom',
    name: 'Crystal Banquet Hall',
    description: 'The premier event hall at Crystal Plaza Hotel featuring adaptable partition layouts, chandelier lighting, and a spacious foyer. Perfect for grand dinners, corporate galas, and wedding receptions.',
    image: 'https://i.ibb.co/6JvRNWrw/Whats-App-Image-2026-08-25-at-1-58-17-PM.jpg',
    images: [
      'https://i.ibb.co/6JvRNWrw/Whats-App-Image-2026-08-25-at-1-58-17-PM.jpg',
      'https://i.ibb.co/xSLWpww1/Whats-App-Image-2026-08-25-at-1-58-12-PM.jpg',
      'https://i.ibb.co/4Rcjw4Hk/Whats-App-Image-2026-08-25-at-1-58-22-PM.jpg',
      'https://i.ibb.co/994kcxnM/Whats-App-Image-2026-08-25-at-1-58-19-PM.jpg',
      'https://i.ibb.co/ZRyNTJj4/Whats-App-Image-2026-08-08-at-4-47-57-PM.jpg'
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
