export type EnquiryType = 'ROOM_BOOKING' | 'EVENT' | 'DINING' | 'GENERAL';

export type EnquiryStatus = 'new' | 'in_progress' | 'contacted' | 'resolved' | 'archived';

export interface Room {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  price?: number; // Optional: Only set if verified
  currency: string;
  capacity: number; // e.g., 2 adults, 1 child
  capacityLabel?: string;
  bed_type: string;
  size?: string; // e.g. "28 sq.m"
  amenities: string[];
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface Offer {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  category: 'stay' | 'dining' | 'events';
  price?: string;
  valid_from?: string;
  valid_until?: string;
  terms?: string[];
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface DiningItem {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'breakfast' | 'main_course' | 'arabic_specialties' | 'desserts' | 'beverages';
  price?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventVenue {
  id: string;
  name: string;
  description: string;
  image: string;
  images?: string[];
  capacity: {
    theater?: number;
    banquet?: number;
    classroom?: number;
    u_shape?: number;
    reception?: number;
    people?: string;
  };
  facilities: string[];
  package_details?: string[];
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface HotelFacility {
  id: string;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  is_active: boolean;
  sort_order: number;
}

export interface GalleryItem {
  id: string;
  image: string;
  category: 'all' | 'hotel' | 'rooms' | 'dining' | 'events' | 'facilities';
  title: string;
  alt_text: string;
  is_active: boolean;
  sort_order: number;
}

export interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  phone: string;
  email: string;
  subject?: string;
  event_type?: string;
  event_date?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  rooms?: number;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}
