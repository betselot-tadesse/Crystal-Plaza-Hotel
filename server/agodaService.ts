import { AgodaPricingApiResponse, AgodaRoomPriceResult } from '../src/types/agoda';
import { AGODA_ROOM_MAPPINGS } from '../src/data/agodaRoomMapping';

/**
 * Server-side Agoda Integration Service
 * 
 * Centralized Configuration:
 * - AGODA_BOOKING_URL
 * - AGODA_API_ENDPOINT
 * - AGODA_PROPERTY_ID
 * - AGODA_API_KEY
 * 
 * CRITICAL RULE:
 * LIVE AGODA PRICES ARE ONLY ALLOWED IF THEY COME FROM AN AUTHORIZED, RELIABLE AGODA DATA SOURCE.
 * Never scrape, guess, cache indefinitely, or fabricate Agoda prices.
 * Keep all credentials/API keys server-side and NEVER expose them in frontend code.
 */

export const AGODA_CONFIG = {
  BOOKING_URL: process.env.AGODA_BOOKING_URL || 'https://www.agoda.com/crystal-plaza-hotel/hotel/sharjah-ae.html',
  API_ENDPOINT: process.env.AGODA_API_ENDPOINT || '',
  PROPERTY_ID: process.env.AGODA_PROPERTY_ID || '',
  API_KEY: process.env.AGODA_API_KEY || ''
};

export interface FetchPricesParams {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

/**
 * Helper to construct the official Agoda booking URL with search parameters
 */
export function buildAgodaBookingUrl(params?: FetchPricesParams, roomSlug?: string): string {
  const baseUrl = AGODA_CONFIG.BOOKING_URL;
  try {
    const url = new URL(baseUrl);
    if (params?.checkIn) url.searchParams.set('checkIn', params.checkIn);
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
    if (params?.guests) url.searchParams.set('adults', String(params.guests));
    return url.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * Fetch live room pricing from authorized Agoda API endpoint
 */
export async function fetchAgodaLivePrices(params: FetchPricesParams): Promise<AgodaPricingApiResponse> {
  const fallbackUrl = buildAgodaBookingUrl(params);
  const disclaimer = "Prices are subject to Agoda's current availability, taxes, fees, promotions and booking conditions.";

  // Check if official credentials exist
  const isConfigured = Boolean(
    AGODA_CONFIG.API_ENDPOINT &&
    AGODA_CONFIG.API_KEY &&
    AGODA_CONFIG.PROPERTY_ID
  );

  // If no authorized Agoda API credentials provided by hotel, do NOT invent or pretend
  if (!isConfigured) {
    return {
      configured: false,
      livePricingAvailable: false,
      message: "Prices and availability are updated on Agoda.",
      disclaimer,
      searchParams: {
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        guests: params.guests,
      },
      rooms: {},
      fallbackBookingUrl: fallbackUrl
    };
  }

  // Authorized endpoint is configured - call Agoda Partner/Affiliate API server-side
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const requestUrl = new URL(AGODA_CONFIG.API_ENDPOINT);
    requestUrl.searchParams.set('propertyId', AGODA_CONFIG.PROPERTY_ID);
    if (params.checkIn) requestUrl.searchParams.set('checkIn', params.checkIn);
    if (params.checkOut) requestUrl.searchParams.set('checkOut', params.checkOut);
    if (params.guests) requestUrl.searchParams.set('guests', String(params.guests));

    const response = await fetch(requestUrl.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${AGODA_CONFIG.API_KEY}`,
        'x-api-key': AGODA_CONFIG.API_KEY,
        'User-Agent': 'CrystalPlazaHotel-Integration/1.0'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[Agoda API] Response status ${response.status}: ${response.statusText}`);
      return {
        configured: true,
        livePricingAvailable: false,
        message: "Prices and availability are updated on Agoda.",
        disclaimer,
        searchParams: params,
        rooms: {},
        fallbackBookingUrl: fallbackUrl
      };
    }

    const data = await response.json();
    const roomsResult: Record<string, AgodaRoomPriceResult> = {};

    // Map the returned Agoda rooms to website room types
    // Support standard Agoda response structures (e.g., data.rooms or data.rates)
    const agodaRoomsList = Array.isArray(data.rooms) ? data.rooms : (Array.isArray(data.rates) ? data.rates : []);

    for (const mapping of AGODA_ROOM_MAPPINGS) {
      const roomSlug = mapping.hotelRoomSlug;
      const matchedAgodaRoom = agodaRoomsList.find((r: any) => 
        (mapping.agodaRoomTypeId && (r.roomTypeId === mapping.agodaRoomTypeId || r.id === mapping.agodaRoomTypeId)) ||
        (r.roomName && r.roomName.toLowerCase().includes(mapping.hotelRoomName.toLowerCase()))
      );

      if (matchedAgodaRoom && matchedAgodaRoom.price !== undefined) {
        // Distinguish between room rate, taxes, fees, total price where provided by Agoda
        const roomRate = typeof matchedAgodaRoom.roomRate === 'number' ? matchedAgodaRoom.roomRate : undefined;
        const taxes = typeof matchedAgodaRoom.taxes === 'number' ? matchedAgodaRoom.taxes : undefined;
        const fees = typeof matchedAgodaRoom.fees === 'number' ? matchedAgodaRoom.fees : undefined;
        const totalPrice = typeof matchedAgodaRoom.totalPrice === 'number' ? matchedAgodaRoom.totalPrice : undefined;
        const displayedPrice = Number(matchedAgodaRoom.displayedPrice || matchedAgodaRoom.price || totalPrice || 0);

        roomsResult[roomSlug] = {
          roomSlug,
          roomName: mapping.hotelRoomName,
          agodaRoomTypeId: mapping.agodaRoomTypeId,
          isAvailable: matchedAgodaRoom.available ?? true,
          agodaBookingUrl: matchedAgodaRoom.bookingUrl || fallbackUrl,
          priceBreakdown: {
            roomRate,
            taxes,
            fees,
            totalPrice,
            displayedPrice,
            currency: matchedAgodaRoom.currency || 'AED',
            pricePeriod: params.checkIn && params.checkOut ? 'total' : 'nightly',
            isDateSpecific: Boolean(params.checkIn && params.checkOut)
          }
        };
      }
    }

    return {
      configured: true,
      livePricingAvailable: Object.keys(roomsResult).length > 0,
      message: Object.keys(roomsResult).length > 0 
        ? "Live prices retrieved from Agoda." 
        : "Prices and availability are updated on Agoda.",
      disclaimer,
      searchParams: params,
      rooms: roomsResult,
      fallbackBookingUrl: fallbackUrl
    };

  } catch (error: any) {
    console.error("[Agoda API] Error retrieving live pricing:", error?.message || error);
    return {
      configured: true,
      livePricingAvailable: false,
      message: "Prices and availability are updated on Agoda.",
      disclaimer,
      searchParams: params,
      rooms: {},
      fallbackBookingUrl: fallbackUrl
    };
  }
}
