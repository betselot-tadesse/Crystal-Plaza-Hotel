import React from 'react';
import { Room } from '../../types/database';
import { AgodaRoomPriceResult } from '../../types/agoda';
import { BedDouble, Users, Maximize2, Check, ArrowRight, ExternalLink, Info, Loader2 } from 'lucide-react';
import { analytics } from '../../utils/analytics';
import { getAgodaUrl } from '../../data/hotelConfig';

interface RoomCardProps {
  room: Room;
  priceResult?: AgodaRoomPriceResult;
  isLoadingPrice?: boolean;
  searchParams?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
  };
  onViewDetails: (slug: string) => void;
  onBookNow?: (slug: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({
  room,
  priceResult,
  isLoadingPrice = false,
  searchParams,
  onViewDetails,
  onBookNow
}) => {
  const hasLivePrice = Boolean(priceResult?.priceBreakdown && priceResult.isAvailable);
  const breakdown = priceResult?.priceBreakdown;

  const targetAgodaUrl = priceResult?.agodaBookingUrl || getAgodaUrl({
    checkIn: searchParams?.checkIn,
    checkOut: searchParams?.checkOut,
    adults: searchParams?.guests
  });

  const handleAgodaClick = () => {
    analytics.trackBookNowClick('room_card_agoda', room.slug);
    window.open(targetAgodaUrl, '_blank', 'noopener,noreferrer');
    if (onBookNow) {
      onBookNow(room.slug);
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-md hover:shadow-xl border border-gray-200 overflow-hidden flex flex-col transition-all duration-300 group hover:border-[#C5A059]/60">
      {/* Room Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A192F]">
        <img
          src={room.images[0]}
          alt={room.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/80 via-transparent to-transparent"></div>
        
        {/* Room Size Tag */}
        {room.size && (
          <div className="absolute top-3 right-3 bg-[#0A192F]/90 backdrop-blur-sm text-white text-[11px] font-semibold px-2.5 py-1 rounded-sm border border-[#C5A059]/30 flex items-center gap-1.5">
            <Maximize2 className="w-3 h-3 text-[#C5A059]" />
            <span>{room.size}</span>
          </div>
        )}

        {/* Room Category Name Banner */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-xl font-serif font-bold text-white drop-shadow-sm group-hover:text-[#C5A059] transition-colors">
            {room.name}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Key Specs Bar */}
          <div className="flex items-center gap-4 text-xs text-gray-600 pb-3 mb-3 border-b border-gray-100">
            <div className="flex items-center gap-1.5 font-medium">
              <BedDouble className="w-4 h-4 text-[#C5A059]" />
              <span>{room.bed_type}</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <Users className="w-4 h-4 text-[#C5A059]" />
              <span>{room.capacityLabel || `${room.capacity} Guests`}</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
            {room.description}
          </p>

          {/* Amenities Preview */}
          <div className="space-y-1.5 mb-5">
            {room.amenities.slice(0, 4).map((amenity, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] text-gray-700">
                <Check className="w-3 h-3 text-[#C5A059] flex-shrink-0" />
                <span className="truncate">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Notice & Action Buttons */}
        <div className="pt-4 border-t border-gray-100 space-y-3">
          {/* Live Price or Fallback State */}
          {isLoadingPrice ? (
            <div className="flex items-center justify-between py-1 text-xs text-gray-500 animate-pulse">
              <span className="flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />
                Checking Agoda rates...
              </span>
              <span className="w-20 h-4 bg-gray-200 rounded"></span>
            </div>
          ) : hasLivePrice && breakdown ? (
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between">
                <div className="text-xs text-gray-500 font-medium">
                  {breakdown.isDateSpecific ? (
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Based on your selected dates
                    </span>
                  ) : (
                    <span>From</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-base font-bold text-[#0A192F]">
                    {breakdown.currency} {breakdown.displayedPrice}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">
                    {breakdown.pricePeriod === 'total' ? 'total' : '/ night'}
                  </span>
                </div>
              </div>

              {/* Price Transparency Breakdown (if Agoda provides rate/taxes/fees) */}
              {(breakdown.taxes !== undefined || breakdown.fees !== undefined) && (
                <div className="text-[10px] text-gray-500 flex items-center justify-end gap-1.5 pt-0.5">
                  <Info className="w-3 h-3 text-[#C5A059]" />
                  <span>
                    Rate: {breakdown.currency} {breakdown.roomRate || '-'}
                    {breakdown.taxes ? ` • Taxes: ${breakdown.taxes}` : ''}
                    {breakdown.fees ? ` • Fees: ${breakdown.fees}` : ''}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-stone-50 border border-stone-200/80 rounded-sm p-2 text-center">
              <p className="text-[11px] text-gray-600 font-medium">
                Prices and availability are updated on Agoda.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                analytics.trackRoomView(room.name, room.slug);
                onViewDetails(room.slug);
              }}
              className="w-full py-2.5 px-3 rounded-sm border border-[#0A192F]/30 hover:border-[#0A192F] text-[#0A192F] font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Room</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
            </button>

            <button
              onClick={handleAgodaClick}
              className="w-full py-2.5 px-3 rounded-sm bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs uppercase tracking-wider shadow-sm active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title={hasLivePrice ? 'Book this room on Agoda' : 'Check availability and prices on Agoda'}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{hasLivePrice ? 'Book on Agoda' : 'Book on Agoda'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
