import { GalleryItem } from '../types/database';
import { getSafeImageUrl } from '../services/imageService';

export const galleryData: GalleryItem[] = [
  {
    id: 'gal-lobby-1',
    image: getSafeImageUrl('/images/hotel/Whats_App_Image_2026_09_04_at_5_21_07_PM.jpg', 'lobby_foyer'),
    category: 'hotel',
    title: 'Hotel Lobby & Front Desk Reception',
    alt_text: 'Crystal Plaza Hotel elegant welcoming lobby and 24/7 reception desk',
    is_active: true,
    sort_order: 1
  },
  {
    id: 'gal-lobby-2',
    image: '/images/hotel/Whats_App_Image_2026_09_04_at_5_21_07_PM.jpg',
    category: 'hotel',
    title: 'Crystal Plaza Hotel Main Foyer',
    alt_text: 'Crystal Plaza Hotel spacious ground floor entrance and foyer',
    is_active: true,
    sort_order: 2
  },
  {
    id: 'gal-king',
    image: getSafeImageUrl('/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png', 'room_king'),
    category: 'rooms',
    title: 'Standard King Size Room',
    alt_text: 'Crystal Plaza Hotel Standard King guest room with large king bed',
    is_active: true,
    sort_order: 3
  },
  {
    id: 'gal-twin',
    image: getSafeImageUrl('/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png', 'room_twin'),
    category: 'rooms',
    title: 'Standard Twin Room',
    alt_text: 'Crystal Plaza Hotel Twin guest room with two single beds',
    is_active: true,
    sort_order: 4
  },
  {
    id: 'gal-triple',
    image: getSafeImageUrl('/images/hotel/Chat_GPT_Image_Sep_5_2026_10_26_13_AM_pn.png', 'room_triple'),
    category: 'rooms',
    title: 'Standard Triple Room',
    alt_text: 'Standard Triple guest room with comfortable bedding arrangement',
    is_active: true,
    sort_order: 5
  },
  {
    id: 'gal-suite',
    image: getSafeImageUrl('/images/hotel/Chat_GPT_Image_Sep_5_2026_10_46_59_AM_pn.png', 'room_suite'),
    category: 'rooms',
    title: 'Executive Suite',
    alt_text: 'Spacious Executive Suite bedroom and relaxation area',
    is_active: true,
    sort_order: 6
  },
  {
    id: 'gal-bath',
    image: '/images/hotel/0224512000l1c4xc78C50_W_1280_853_R5_webp.webp',
    category: 'rooms',
    title: 'En-Suite Guest Bathroom',
    alt_text: 'Clean, modern guest bathroom with en-suite shower and amenities',
    is_active: true,
    sort_order: 7
  },
  {
    id: 'gal-banquet-1',
    image: getSafeImageUrl('/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg', 'banquet_hero'),
    category: 'events',
    title: 'Crystal Banquet Hall & Reception',
    alt_text: 'Crystal Plaza Hotel elegant banquet hall and dining venue setup',
    is_active: true,
    sort_order: 8
  },
  {
    id: 'gal-banquet-2',
    image: getSafeImageUrl('/images/hotel/Whats_App_Image_2026_08_25_at_1_58_19_PM.jpg', 'banquet_stage'),
    category: 'events',
    title: 'Banquet Hall Stage & Event Layout',
    alt_text: 'Elevated presentation stage and formal seating in banquet hall',
    is_active: true,
    sort_order: 9
  },
  {
    id: 'gal-banquet-3',
    image: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_22_PM.jpg',
    category: 'events',
    title: 'Banquet Celebration Setting',
    alt_text: 'Atmospheric banquet hall setting with warm illumination',
    is_active: true,
    sort_order: 10
  },
  {
    id: 'gal-banquet-4',
    image: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_19_PM.jpg',
    category: 'events',
    title: 'Banquet Hall Seating Arrangement',
    alt_text: 'Wide dining and guest seating setup with chandeliers and carpet',
    is_active: true,
    sort_order: 11
  },
  {
    id: 'gal-banquet-5',
    image: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_17_PM.jpg',
    category: 'events',
    title: 'Banquet Hall Interior View',
    alt_text: 'Full panoramic perspective of the banquet hall ready for events',
    is_active: true,
    sort_order: 12
  },
  {
    id: 'gal-meeting',
    image: '/images/hotel/Whats_App_Image_2026_08_25_at_1_58_22_PM.jpg',
    category: 'events',
    title: 'Meeting Room & Boardroom',
    alt_text: 'Dedicated meeting room and boardroom setup with presentation screen',
    is_active: true,
    sort_order: 13
  },
  {
    id: 'gal-dining-1',
    image: getSafeImageUrl('/images/hotel/Whats_App_Image_2026_09_04_at_5_04_54_PM.jpg', 'dining_hero'),
    category: 'dining',
    title: 'Crystal Dining Restaurant',
    alt_text: 'Crystal Plaza Hotel dining hall and seating',
    is_active: true,
    sort_order: 14
  },
  {
    id: 'gal-dining-2',
    image: '/images/hotel/Whats_App_Image_2026_09_04_at_5_04_54_PM.jpg',
    category: 'dining',
    title: 'Restaurant Dining Space',
    alt_text: 'Crystal Plaza Hotel restaurant tables and warm ambiance',
    is_active: true,
    sort_order: 15
  },
  {
    id: 'gal-gym-1',
    image: getSafeImageUrl('/images/hotel/gym2_jpg.jpg', 'gym_fitness'),
    category: 'facilities',
    title: 'Fitness Gym & Exercise Center',
    alt_text: 'Equipped hotel fitness room with workout machines and equipment',
    is_active: true,
    sort_order: 16
  },
  {
    id: 'gal-gym-2',
    image: '/images/hotel/gym2_jpg.jpg',
    category: 'facilities',
    title: 'Gym & Cardio Equipment',
    alt_text: 'Cardio workout and exercise machines for hotel guests',
    is_active: true,
    sort_order: 17
  }
];
