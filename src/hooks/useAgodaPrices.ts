import { useState, useEffect, useCallback } from 'react';
import { AgodaPricingApiResponse, AgodaRoomPriceResult } from '../types/agoda';
import { HOTEL_CONFIG, getAgodaUrl } from '../data/hotelConfig';

export interface UseAgodaPricesParams {
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

export function useAgodaPrices(params?: UseAgodaPricesParams) {
  const [data, setData] = useState<AgodaPricingApiResponse>({
    configured: false,
    livePricingAvailable: false,
    message: 'Prices and availability are updated on Agoda.',
    disclaimer: "Prices are subject to Agoda's current availability, taxes, fees, promotions and booking conditions.",
    rooms: {},
    fallbackBookingUrl: getAgodaUrl({
      checkIn: params?.checkIn,
      checkOut: params?.checkOut,
      adults: params?.guests
    })
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const query = new URLSearchParams();
    if (params?.checkIn) query.set('checkIn', params.checkIn);
    if (params?.checkOut) query.set('checkOut', params.checkOut);
    if (params?.guests) query.set('guests', String(params.guests));

    try {
      const response = await fetch(`/api/agoda/prices?${query.toString()}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const json: AgodaPricingApiResponse = await response.json();
      setData(json);
    } catch (err: any) {
      console.warn('Could not retrieve Agoda live prices:', err?.message);
      setError('Unable to fetch live prices from Agoda.');
      setData(prev => ({
        ...prev,
        livePricingAvailable: false,
        fallbackBookingUrl: getAgodaUrl({
          checkIn: params?.checkIn,
          checkOut: params?.checkOut,
          adults: params?.guests
        })
      }));
    } finally {
      setIsLoading(false);
    }
  }, [params?.checkIn, params?.checkOut, params?.guests]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  /**
   * Helper to get price result for a specific room slug
   */
  const getRoomPrice = (slug: string): AgodaRoomPriceResult | undefined => {
    return data.rooms[slug];
  };

  /**
   * Helper to build the direct Agoda booking link for a room
   */
  const getRoomBookingUrl = (slug: string): string => {
    const roomResult = data.rooms[slug];
    if (roomResult?.agodaBookingUrl) {
      return roomResult.agodaBookingUrl;
    }
    return getAgodaUrl({
      checkIn: params?.checkIn,
      checkOut: params?.checkOut,
      adults: params?.guests
    });
  };

  return {
    isLoading,
    error,
    isConfigured: data.configured,
    livePricingAvailable: data.livePricingAvailable,
    message: data.message,
    disclaimer: data.disclaimer,
    roomsPrices: data.rooms,
    fallbackBookingUrl: data.fallbackBookingUrl,
    getRoomPrice,
    getRoomBookingUrl,
    refreshPrices: fetchPrices
  };
}
