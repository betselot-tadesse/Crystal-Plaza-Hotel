import { Room } from '../types/database';

/**
 * Crystal Plaza Hotel - Rooms & Accommodation Data Layer
 * 
 * Note: Pricing is kept configurable. If actual dynamic prices are not provided,
 * the UI displays "Contact us for current rates" to adhere to the strict no-fake-pricing mandate.
 */
export const roomsData: Room[] = [
  {
    id: 'room-std-king',
    name: 'Standard King',
    slug: 'standard-king-room',
    description: 'A well-designed room featuring a comfortable king-size bed, workstation, en-suite bathroom, and contemporary amenities tailored for solo business travellers and couples.',
    images: [
      'https://i.ibb.co/b542Q4xz/Chat-GPT-Image-Sep-5-2026-10-38-32-AM.png',
      'https://i.ibb.co/PZLChhFp/Chat-GPT-Image-Sep-5-2026-10-34-26-AM.png',
      'https://i.ibb.co/KcmqW3RL/Chat-GPT-Image-Sep-5-2026-10-42-15-AM.png',
      'https://ak-d.tripcdn.com/images/0220112000k69or5o7A72_W_1280_853_R5.webp',
      'https://ak-d.tripcdn.com/images/0224512000l1c4xc78C50_W_1280_853_R5.webp'
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
      'https://i.ibb.co/G4tFqPs0/Chat-GPT-Image-Sep-5-2026-10-19-21-AM.png',
      'https://i.ibb.co/7x7YnNbc/Chat-GPT-Image-Sep-5-2026-10-16-30-AM.png',
      'https://i.ibb.co/FkkktTRy/Chat-GPT-Image-Sep-5-2026-10-20-39-AM.png',
      'https://ak-d.tripcdn.com/images/0220112000k69or5o7A72_W_1280_853_R5.webp',
      'https://ak-d.tripcdn.com/images/0224512000l1c4xc78C50_W_1280_853_R5.webp'
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
      'https://i.ibb.co/tThnhpYW/Chat-GPT-Image-Sep-5-2026-10-26-13-AM.png',
      'https://i.ibb.co/9mVPK2k5/Chat-GPT-Image-Sep-5-2026-10-27-12-AM.png',
      'https://i.ibb.co/RGTd5p8p/Chat-GPT-Image-Sep-5-2026-10-29-17-AM.png',
      'https://ak-d.tripcdn.com/images/0220112000k69or5o7A72_W_1280_853_R5.webp',
      'https://ak-d.tripcdn.com/images/0224512000l1c4xc78C50_W_1280_853_R5.webp'
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
      'https://i.ibb.co/pB6BWFgN/Chat-GPT-Image-Sep-5-2026-10-48-05-AM.png',
      'https://i.ibb.co/fV6NK0SJ/Chat-GPT-Image-Sep-5-2026-10-46-59-AM.png',
      'https://i.ibb.co/Q5rrL05/Chat-GPT-Image-Sep-5-2026-10-51-06-AM.png',
      'https://i.ibb.co/BWB3jhs/Chat-GPT-Image-Sep-5-2026-10-50-10-AM.png',
      'https://ak-d.tripcdn.com/images/0224512000l1c4xc78C50_W_1280_853_R5.webp'
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
