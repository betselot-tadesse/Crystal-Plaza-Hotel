import React, { useState } from 'react';
import { roomsData } from '../data/roomsData';
import { RoomCard } from '../components/rooms/RoomCard';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { Filter, ExternalLink, MessageCircle, ShieldCheck } from 'lucide-react';
import { getAgodaUrl, getWhatsAppUrl } from '../data/hotelConfig';
import { useAgodaPrices } from '../hooks/useAgodaPrices';
import { AgodaDateSelector } from '../components/rooms/AgodaDateSelector';

interface RoomsPageProps {
  onNavigate: (page: string, detail?: string) => void;
  onOpenBooking: (roomType?: string) => void;
}

export const RoomsPage: React.FC<RoomsPageProps> = ({ onNavigate, onOpenBooking }) => {
  const [selectedCapacity, setSelectedCapacity] = useState<string>('all');

  // Dates for date-based Agoda pricing
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

  const [searchDates, setSearchDates] = useState({
    checkIn: tomorrow.toISOString().split('T')[0],
    checkOut: dayAfterTomorrow.toISOString().split('T')[0],
    guests: 2
  });

  // Query Agoda live prices via server-side endpoint
  const {
    isLoading,
    livePricingAvailable,
    disclaimer,
    fallbackBookingUrl,
    getRoomPrice,
    refreshPrices
  } = useAgodaPrices(searchDates);

  const filteredRooms = roomsData.filter((room) => {
    if (selectedCapacity === 'all') return true;
    if (selectedCapacity === '2') return room.capacity === 2;
    if (selectedCapacity === '3+') return room.capacity >= 3;
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      {/* Breadcrumb Bar */}
      <Breadcrumbs
        items={[{ label: 'Rooms & Accommodation', active: true }]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Hero Section */}
      <div className="bg-slate-950 text-white py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://i.ibb.co/b542Q4xz/Chat-GPT-Image-Sep-5-2026-10-38-32-AM.png"
            alt="Crystal Plaza Hotel Rooms"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-sm bg-[#C5A059]/20 text-[#C5A059] text-xs font-semibold tracking-wider uppercase border border-[#C5A059]/30">
            Accommodation in Al Qasimia, Sharjah
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            Rooms & Suites
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Comfortable, well-appointed guest rooms in the heart of Sharjah. Live rates and reservations are powered directly by Agoda.
          </p>
        </div>
      </div>

      {/* Main Content & Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Date-Based Agoda Pricing Selector */}
        <AgodaDateSelector
          checkIn={searchDates.checkIn}
          checkOut={searchDates.checkOut}
          guests={searchDates.guests}
          onDatesChange={(newParams) => setSearchDates(newParams)}
          isLoading={isLoading}
          livePricingAvailable={livePricingAvailable}
          disclaimer={disclaimer}
          variant="bar"
        />

        {/* Filter Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-sm border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Filter className="w-4 h-4 text-[#C5A059]" />
            <span>Filter By Occupancy:</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setSelectedCapacity('all')}
              className={`px-3.5 py-1.5 rounded-sm font-semibold transition-colors cursor-pointer ${
                selectedCapacity === 'all'
                  ? 'bg-[#0A192F] text-[#C5A059]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Rooms ({roomsData.length})
            </button>
            <button
              onClick={() => setSelectedCapacity('2')}
              className={`px-3.5 py-1.5 rounded-sm font-semibold transition-colors cursor-pointer ${
                selectedCapacity === '2'
                  ? 'bg-[#0A192F] text-[#C5A059]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Solo / Couples (2 Guests)
            </button>
            <button
              onClick={() => setSelectedCapacity('3+')}
              className={`px-3.5 py-1.5 rounded-sm font-semibold transition-colors cursor-pointer ${
                selectedCapacity === '3+'
                  ? 'bg-[#0A192F] text-[#C5A059]'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Families & Suites (3+ Guests)
            </button>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              priceResult={getRoomPrice(room.slug)}
              isLoadingPrice={isLoading}
              searchParams={searchDates}
              onViewDetails={(slug) => onNavigate('room-details', slug)}
              onBookNow={(slug) => onOpenBooking(slug)}
            />
          ))}
        </div>

        {/* Transparency & Booking Assurance Banner */}
        <div className="bg-white border border-gray-200 rounded-sm p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                Official Booking Partner
              </span>
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0A192F]">
              Live Availability & Instant Confirmation on Agoda
            </h3>
            <p className="text-xs text-gray-600 max-w-xl leading-relaxed">
              Crystal Plaza Hotel reservations are finalized directly on Agoda with transparent rates and instant booking confirmation. For large group enquiries or banquet venues, contact our hotel front desk directly.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                const agodaUrl = getAgodaUrl({
                  checkIn: searchDates.checkIn,
                  checkOut: searchDates.checkOut,
                  adults: searchDates.guests
                });
                window.open(agodaUrl, '_blank', 'noopener,noreferrer');
              }}
              className="px-6 py-3.5 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-sm shadow transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ExternalLink className="w-4 h-4 text-[#0A192F]" />
              <span>Check Availability on Agoda</span>
            </button>

            <a
              href={getWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-[#0A192F] hover:bg-[#152a4a] text-white font-semibold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#C5A059]" />
              <span>Group Enquiry</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
