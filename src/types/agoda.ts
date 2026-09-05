/**
 * Agoda Live Pricing & Integration Types
 * 
 * Strict policy:
 * - Real API integration server-side
 * - No fake or hardcoded prices displayed as live
 * - Currency is AED
 * - Clear breakdowns when provided by Agoda
 */

export interface AgodaPriceBreakdown {
  roomRate?: number; // Base room rate before taxes
  taxes?: number;    // Government / municipality taxes
  fees?: number;     // Service charges / resort fees
  totalPrice?: number;
  displayedPrice: number;
  currency: string;
  pricePeriod: 'nightly' | 'total' | 'starting';
  isDateSpecific: boolean;
}

export interface AgodaRoomPriceResult {
  roomSlug: string;
  roomName: string;
  agodaRoomTypeId?: string;
  isAvailable: boolean;
  priceBreakdown?: AgodaPriceBreakdown;
  agodaBookingUrl: string;
}

export interface AgodaPricingApiResponse {
  configured: boolean;
  livePricingAvailable: boolean;
  message: string;
  disclaimer: string;
  searchParams?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    nights?: number;
  };
  rooms: Record<string, AgodaRoomPriceResult>;
  fallbackBookingUrl: string;
}

export interface AgodaRoomMappingConfig {
  hotelRoomSlug: string;
  hotelRoomName: string;
  agodaRoomTypeId?: string;
  agodaRoomName: string;
  defaultCapacity: number;
}
