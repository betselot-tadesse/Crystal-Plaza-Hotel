import { Room } from '../types/database';
import { getSafeImageUrl } from '../services/imageService';

/**
 * Crystal Plaza Hotel - Rooms & Accommodation Data Layer
 * Self-hosted local assets to prevent broken links from external image services like imgbb.
 */
export const roomsData: Room[] = [
  {
    id: 'room-std-king',
    name: 'Standard King',
    slug: 'standard-king-room',
    description: 'A well-designed room featuring a comfortable king-size bed, workstation, en-suite bathroom, and contemporary amenities tailored for solo business travellers and couples.',
    images: [
      getSafeImageUrl('/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png', 'room_king'),
      '/images/hotel/0220112000k69or5o7A72_W_1280_853_R5_webp.webp',
      '/images/hotel/0224512000l1c4xc78C50_W_1280_853_R5_webp.webp'
    ],
    currency: 'AED',
    capacity: 2,
    capacityLabel: '2 Adults',
    bed_type: '1 King Bed',
    size: '26 sq.m',
    amenities: [
      'Complimentary High-Speed Wi-Fi',
      'Individual Air Conditioning',
      'Flat-Screen Satellite TV',
      'Tea & Coffee Making Facilities',
      'En-suite Bathroom with Shower',
      'In-Room Safe',
      'Work Desk with Ergonomic Chair',
      'Mini Refrigerator'
    ],
    is_active: true,
    sort_order: 1
  },
  {
    id: 'room-std-twin',
    name: 'Standard Twin',
    slug: 'standard-twin-room',
    description: 'Designed for colleagues, friends, or family members seeking practical comfort in Sharjah with two twin beds, ample natural light, and modern in-room conveniences.',
    images: [
      getSafeImageUrl('/images/hotel/Chat_GPT_Image_Sep_5_2026_10_38_32_AM_pn.png', 'room_twin'),
      '/images/hotel/0220112000k69or5o7A72_W_1280_853_R5_webp.webp',
      '/images/hotel/0224512000l1c4xc78C50_W_1280_853_R5_webp.webp'
    ],
    currency: 'AED',
    capacity: 2,
    capacityLabel: '2 Adults',
    bed_type: '2 Twin Single Beds',
    size: '28 sq.m',
    amenities: [
      'Complimentary High-Speed Wi-Fi',
      'Individual Air Conditioning',
      'Flat-Screen Satellite TV',
      'Coffee & Tea Maker',
      'En-suite Bathroom',
      'Work Desk',
      'In-Room Electronic Safe',
      'Wardrobe with Luggage Rack'
    ],
    is_active: true,
    sort_order: 2
  },
  {
    id: 'room-std-triple',
    name: 'Standard Triple Room',
    slug: 'standard-triple-room',
    description: 'Generously proportioned accommodation accommodating three guests comfortably with flexible bedding configurations, dedicated workspace, and upgraded amenities.',
    images: [
      getSafeImageUrl('/images/hotel/Chat_GPT_Image_Sep_5_2026_10_26_13_AM_pn.png', 'room_triple'),
      '/images/hotel/0220112000k69or5o7A72_W_1280_853_R5_webp.webp',
      '/images/hotel/0224512000l1c4xc78C50_W_1280_853_R5_webp.webp'
    ],
    currency: 'AED',
    capacity: 3,
    capacityLabel: '3 Adults',
    bed_type: '3 Single Beds or 1 King + 1 Single',
    size: '34 sq.m',
    amenities: [
      'Complimentary High-Speed Wi-Fi',
      'Smart TV with Satellite Channels',
      'Sitting Area with Armchairs',
      'Mini Bar / Fridge',
      'Premium Bedding & Linens',
      'Spacious Bathroom with Hairdryer',
      'Direct Dial Telephone',
      'Complimentary Bottled Water'
    ],
    is_active: true,
    sort_order: 3
  },
  {
    id: 'room-exec-suite',
    name: 'Executive Suite',
    slug: 'executive-suite',
    description: 'A distinguished suite featuring a separate living room with plush sofas, a private master bedroom, and dedicated workspace ideal for corporate executives and extended family visits.',
    images: [
      getSafeImageUrl('/images/hotel/Chat_GPT_Image_Sep_5_2026_10_46_59_AM_pn.png', 'room_suite'),
      '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_50_10_AM_pn.png',
      '/images/hotel/Chat_GPT_Image_Sep_5_2026_10_51_06_AM_pn.png',
      '/images/hotel/0224512000l1c4xc78C50_W_1280_853_R5_webp.webp'
    ],
    currency: 'AED',
    capacity: 4,
    capacityLabel: 'Up to 4 Guests',
    bed_type: '1 King Bed & Sofa Bed',
    size: '48 sq.m',
    amenities: [
      'Separate Living Room & Bedroom',
      'High-Speed High-Bandwidth Wi-Fi',
      'Two Flat-Screen TVs',
      'Executive Working Desk',
      'Dining / Meeting Table for 4',
      'Luxury Bathroom with Bathtub & Shower',
      'Bathrobes & Slippers',
      'Espresso & Tea Station'
    ],
    is_active: true,
    sort_order: 4
  }
];

export function getRoomBySlug(slug: string): Room | undefined {
  return roomsData.find(room => room.slug === slug);
}
