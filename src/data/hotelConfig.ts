/**
 * Crystal Plaza Hotel - Centralized Configuration
 * 
 * IMPORTANT BRANDING RULE:
 * Customer-facing brand name is ALWAYS "Crystal Plaza Hotel".
 * Never display internal codes (CPH1, CPH2, etc.).
 * 
 * All contact info and social URLs are centralized here to allow instant updating
 * without editing multiple components.
 */

export const HOTEL_CONFIG = {
  // Verified Brand Information
  NAME: 'Crystal Plaza Hotel',
  TAGLINE: 'Comfort • Convenience • Value • Hospitality',
  LOCATION: 'Al Qasimia, Sharjah, United Arab Emirates',
  ADDRESS_LINE_1: 'Al Qasimia District',
  CITY: 'Sharjah',
  COUNTRY: 'United Arab Emirates',
  FULL_ADDRESS: 'Al Qasimia, Sharjah, United Arab Emirates',

  // Centralized Contact Configuration (Configurable hotel contact points)
  // Rooms & General Hotel Inquiry
  PHONE_NUMBER: '055 283 3583',
  PHONE_TEL: 'tel:0552833583',
  WHATSAPP_NUMBER: '971552833583', // International format for wa.me API
  WHATSAPP_DISPLAY: '055 283 3583',

  // Banquet Hall & Dining Inquiry
  EVENTS_DINING_PHONE: '056 973 2183',
  EVENTS_DINING_TEL: 'tel:0569732183',
  EVENTS_DINING_WHATSAPP: '971569732183',
  EVENTS_DINING_DISPLAY: '056 973 2183',

  // Room Service Hotline (alias for dining)
  ROOM_SERVICE_PHONE: '056 973 2183',
  ROOM_SERVICE_RAW: '0569732183',
  ROOM_SERVICE_TEL: 'tel:0569732183',
  ROOM_SERVICE_WHATSAPP: '971569732183',
  ROOM_SERVICE_DISPLAY: '056 973 2183',

  // Hotel Logo Avatar
  LOGO_URL: 'https://i.ibb.co/W4VpJdWZ/Whats-App-Image-2026-08-08-at-5-34-39-PM.jpg',

  // Email
  EMAIL: 'info@crystalplazahotel.com',
  EMAIL_ADDRESS: 'info@crystalplazahotel.com',
  EMAIL_MAILTO: 'mailto:info@crystalplazahotel.com',
  RESERVATIONS_EMAIL: 'reservations@crystalplazahotel.com',
  EVENTS_EMAIL: 'events@crystalplazahotel.com',

  // Google Maps
  GOOGLE_MAPS_URL: 'https://maps.google.com/?q=Crystal+Plaza+Hotel+Al+Qasimia+Sharjah',
  GOOGLE_MAPS_EMBED_QUERY: 'Crystal+Plaza+Hotel+Al+Qasimia+Sharjah+UAE',

  // Official Agoda Booking & Live Availability Link
  AGODA_URL: 'https://www.agoda.com/crystal-plaza-hotel/hotel/sharjah-ae.html',
  AGODA_HOTEL_NAME: 'Crystal Plaza Hotel Sharjah',

  // Social Channels
  INSTAGRAM_URL: 'https://instagram.com/crystalplazahotel',
  FACEBOOK_URL: 'https://facebook.com/crystalplazahotel',
  LINKEDIN_URL: 'https://linkedin.com/company/crystalplazahotel',
  SOCIAL_LINKS: {
    instagram: 'https://instagram.com/crystalplazahotel',
    facebook: 'https://facebook.com/crystalplazahotel',
    linkedin: 'https://linkedin.com/company/crystalplazahotel'
  },

  // Standard Hotel Policies (Editable placeholders)
  CHECK_IN_TIME: '2:00 PM',
  CHECK_OUT_TIME: '12:00 PM',

  // Hospitality Value Pillars
  PILLARS: [
    {
      title: 'Comfort',
      description: 'Well-appointed, clean, and spacious rooms designed for restful stays.',
    },
    {
      title: 'Convenience',
      description: 'Centrally situated in Al Qasimia, Sharjah, offering easy access to business & leisure hubs.',
    },
    {
      title: 'Value',
      description: 'Competitive room rates, thoughtful guest amenities, and honest hospitality.',
    },
    {
      title: 'Hospitality',
      description: 'Dedicated team committed to attentive, professional, and friendly 24/7 service.',
    }
  ]
} as const;

/**
 * Helper to build contextual WhatsApp URLs
 */
export function getWhatsAppUrl(context: 'general' | 'room' | 'event' | 'dining' | string, detail?: string): string {
  let message = '';
  switch (context) {
    case 'room':
      message = detail
        ? `Hello Crystal Plaza Hotel, I would like to enquire about ${detail}.`
        : 'Hello Crystal Plaza Hotel, I would like to enquire about room bookings.';
      break;
    case 'event':
      message = detail
        ? `Hello Crystal Plaza Hotel, I would like to enquire about hosting an event (${detail}).`
        : 'Hello Crystal Plaza Hotel, I would like to enquire about hosting an event in the Banquet Hall.';
      return `https://wa.me/${HOTEL_CONFIG.EVENTS_DINING_WHATSAPP}?text=${encodeURIComponent(message)}`;
    case 'dining':
      message = detail
        ? `Hello Crystal Plaza Hotel, I would like to order room service / enquire about dining (${detail}).`
        : 'Hello Crystal Plaza Hotel, I would like to enquire about dining and restaurant services.';
      return `https://wa.me/${HOTEL_CONFIG.EVENTS_DINING_WHATSAPP}?text=${encodeURIComponent(message)}`;
    case 'general':
    default:
      message = 'Hello Crystal Plaza Hotel, I would like to make an enquiry.';
      break;
  }

  return `https://wa.me/${HOTEL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Helper to build Agoda availability and booking URLs with optional search parameters
 */
export function getAgodaUrl(params?: {
  checkIn?: string;
  checkOut?: string;
  adults?: string | number;
  rooms?: string | number;
}): string {
  const baseUrl = HOTEL_CONFIG.AGODA_URL;
  try {
    const url = new URL(baseUrl);
    if (params?.checkIn) {
      url.searchParams.set('checkIn', params.checkIn);
    }
    if (params?.checkOut) {
      url.searchParams.set('checkOut', params.checkOut);
      if (params.checkIn) {
        const start = new Date(params.checkIn).getTime();
        const end = new Date(params.checkOut).getTime();
        const diffDays = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
        if (!isNaN(diffDays)) {
          url.searchParams.set('los', String(diffDays));
        }
      }
    }
    if (params?.adults) {
      url.searchParams.set('adults', String(params.adults));
    }
    if (params?.rooms) {
      url.searchParams.set('rooms', String(params.rooms));
    }
    return url.toString();
  } catch {
    return baseUrl;
  }
}
