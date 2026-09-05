import React, { useState } from 'react';
import { roomsData, getRoomBySlug } from '../data/roomsData';
import { HOTEL_CONFIG, getWhatsAppUrl, getAgodaUrl } from '../data/hotelConfig';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { MobileStickyCTA } from '../components/layout/MobileStickyCTA';
import { 
  BedDouble, 
  Users, 
  Maximize2, 
  Check, 
  CalendarCheck, 
  MessageCircle, 
  Phone, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  ArrowLeft,
  Info,
  Loader2
} from 'lucide-react';
import { analytics } from '../utils/analytics';
import { useAgodaPrices } from '../hooks/useAgodaPrices';
import { AgodaDateSelector } from '../components/rooms/AgodaDateSelector';

interface RoomDetailsPageProps {
  roomSlug: string;
  onNavigate: (page: string, detail?: string) => void;
  onOpenBooking: (roomType?: string) => void;
}

export const RoomDetailsPage: React.FC<RoomDetailsPageProps> = ({
  roomSlug,
  onNavigate,
  onOpenBooking
}) => {
  const room = getRoomBySlug(roomSlug) || roomsData[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Search dates for date-based pricing
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

  const [searchDates, setSearchDates] = useState({
    checkIn: tomorrow.toISOString().split('T')[0],
    checkOut: dayAfterTomorrow.toISOString().split('T')[0],
    guests: Math.min(room.capacity, 2)
  });

  const {
    isLoading,
    livePricingAvailable,
    disclaimer,
    getRoomPrice,
    getRoomBookingUrl
  } = useAgodaPrices(searchDates);

  const priceResult = getRoomPrice(room.slug);
  const breakdown = priceResult?.priceBreakdown;
  const hasLivePrice = Boolean(breakdown && priceResult?.isAvailable);

  const bookingUrl = getRoomBookingUrl(room.slug);

  const handleBookOnAgoda = () => {
    analytics.trackBookNowClick('room_details_book_on_agoda', room.slug);
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
    if (onOpenBooking) {
      onOpenBooking(room.slug);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-20 lg:pb-12">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Rooms & Accommodation', onClick: () => onNavigate('rooms') },
          { label: room.name, active: true }
        ]}
        onHomeClick={() => onNavigate('home')}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('rooms')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Rooms</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Gallery & Details (7-8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Main Image Stage */}
            <div className="space-y-3">
              <div className="relative aspect-[16/10] rounded-sm overflow-hidden shadow-lg bg-slate-950">
                <img
                  src={room.images[selectedImageIndex] || room.images[0]}
                  alt={`${room.name} interior photography`}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-slate-950/85 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-sm border border-white/10">
                  {room.name}
                </div>
              </div>

              {/* Thumbnails Row */}
              {room.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {room.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-[16/10] rounded-sm overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-[#C5A059] scale-[1.02] shadow'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${room.name} thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Room Title & Specifications */}
            <div className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-sm space-y-6">
              <div className="border-b border-gray-100 pb-5">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mb-3">
                  {room.name}
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {room.description}
                </p>
              </div>

              {/* Key Specs Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 rounded-sm border border-stone-100 text-xs">
                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold mb-1">
                    Bed Type
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <BedDouble className="w-4 h-4 text-[#C5A059]" />
                    <span>{room.bed_type}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold mb-1">
                    Occupancy
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Users className="w-4 h-4 text-[#C5A059]" />
                    <span>{room.capacityLabel || `${room.capacity} Guests`}</span>
                  </div>
                </div>

                {room.size && (
                  <div>
                    <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold mb-1">
                      Room Size
                    </span>
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Maximize2 className="w-4 h-4 text-[#C5A059]" />
                      <span>{room.size}</span>
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 uppercase tracking-wider text-[10px] block font-semibold mb-1">
                    Check-in / Out
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                    <span>{HOTEL_CONFIG.CHECK_IN_TIME} / {HOTEL_CONFIG.CHECK_OUT_TIME}</span>
                  </div>
                </div>
              </div>

              {/* In-Room Amenities Checklist */}
              <div>
                <h3 className="text-base font-bold font-serif text-slate-900 mb-4">
                  Room Amenities & Comforts
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {room.amenities.map((amenity, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700">
                      <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-200 text-[#C5A059] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Pricing & Booking CTAs (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-lg space-y-6 sticky top-28">
              {/* Date Selector Widget for Date-Specific Agoda Price */}
              <AgodaDateSelector
                checkIn={searchDates.checkIn}
                checkOut={searchDates.checkOut}
                guests={searchDates.guests}
                onDatesChange={(newParams) => setSearchDates(newParams)}
                isLoading={isLoading}
                livePricingAvailable={livePricingAvailable}
                disclaimer={disclaimer}
                variant="compact"
              />

              {/* Price Display Area */}
              <div className="border-t border-b border-gray-100 py-4 space-y-2">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider block">
                  Agoda Room Rate
                </span>

                {isLoading ? (
                  <div className="flex items-center gap-2 text-xs text-gray-500 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                    <span>Checking current rate on Agoda...</span>
                  </div>
                ) : hasLivePrice && breakdown ? (
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between">
                      <div>
                        {breakdown.isDateSpecific ? (
                          <div className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>Based on your selected dates</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-500">Starting from</span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-[#0A192F] font-serif">
                          {breakdown.currency} {breakdown.displayedPrice}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          {breakdown.pricePeriod === 'total' ? 'total' : '/ night'}
                        </span>
                      </div>
                    </div>

                    {/* Price Transparency Breakdown (if provided by Agoda) */}
                    {(breakdown.roomRate !== undefined || breakdown.taxes !== undefined || breakdown.fees !== undefined) && (
                      <div className="bg-stone-50 p-2.5 rounded-sm border border-stone-200 text-xs space-y-1 text-gray-600">
                        <div className="font-semibold text-slate-800 text-[11px] pb-1 border-b border-stone-200">
                          Price Breakdown (from Agoda)
                        </div>
                        {breakdown.roomRate !== undefined && (
                          <div className="flex justify-between text-[11px]">
                            <span>Room Rate:</span>
                            <span className="font-medium">{breakdown.currency} {breakdown.roomRate}</span>
                          </div>
                        )}
                        {breakdown.taxes !== undefined && (
                          <div className="flex justify-between text-[11px]">
                            <span>Taxes:</span>
                            <span className="font-medium">{breakdown.currency} {breakdown.taxes}</span>
                          </div>
                        )}
                        {breakdown.fees !== undefined && (
                          <div className="flex justify-between text-[11px]">
                            <span>Fees:</span>
                            <span className="font-medium">{breakdown.currency} {breakdown.fees}</span>
                          </div>
                        )}
                        {breakdown.totalPrice !== undefined && (
                          <div className="flex justify-between text-xs font-bold text-[#0A192F] pt-1 border-t border-stone-200">
                            <span>Total Price:</span>
                            <span>{breakdown.currency} {breakdown.totalPrice}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Fallback State */
                  <div className="bg-stone-50 border border-stone-200 rounded-sm p-3 text-center space-y-1">
                    <p className="text-xs text-gray-700 font-semibold">
                      Prices and availability are updated on Agoda.
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Select your dates to view real-time pricing and room options directly on Agoda.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* 1. Primary Agoda CTA */}
                <button
                  onClick={handleBookOnAgoda}
                  className="w-full py-3.5 px-4 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs uppercase tracking-widest rounded-sm shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4 text-[#0A192F]" />
                  <span>Book on Agoda</span>
                </button>

                {/* 2. Direct WhatsApp Support */}
                <a
                  href={getWhatsAppUrl('room', room.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.trackWhatsAppClick('room_details', room.name)}
                  className="w-full py-3 px-4 bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/40 text-emerald-700 font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Assistance</span>
                </a>

                {/* 3. Front Desk Phone */}
                <a
                  href={HOTEL_CONFIG.PHONE_TEL}
                  onClick={() => analytics.trackPhoneClick('room_details')}
                  className="w-full py-2.5 px-4 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 font-medium text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Front Desk: {HOTEL_CONFIG.PHONE_NUMBER}</span>
                </a>
              </div>

              {/* Disclaimer */}
              <div className="pt-2 text-[10px] text-gray-400 text-center leading-relaxed">
                {disclaimer || "Prices are subject to Agoda's current availability, taxes, fees, promotions and booking conditions."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile CTA Bar specifically tailored for Room Details */}
      <MobileStickyCTA
        onOpenBooking={() => onOpenBooking(room.slug)}
        context="room"
        contextDetail={room.name}
      />
    </div>
  );
};
