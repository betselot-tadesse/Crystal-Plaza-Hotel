import React, { useState } from 'react';
import { Calendar, Users, Home, ExternalLink } from 'lucide-react';
import { roomsData } from '../../data/roomsData';
import { analytics } from '../../utils/analytics';
import { getAgodaUrl } from '../../data/hotelConfig';

interface BookingBarProps {
  onCheckAvailability?: (params: {
    checkIn: string;
    checkOut: string;
    guests: string;
    roomType: string;
  }) => void;
  className?: string;
}

export const BookingBar: React.FC<BookingBarProps> = ({
  onCheckAvailability,
  className = ''
}) => {
  // Default dates: tomorrow to +2 days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date(tomorrow);
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(formatDate(tomorrow));
  const [checkOut, setCheckOut] = useState(formatDate(dayAfter));
  const [guests, setGuests] = useState('2');
  const [roomType, setRoomType] = useState(roomsData[0]?.slug || 'standard-king-room');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analytics.trackBookNowClick('booking_bar_agoda', roomType);
    
    // Open live availability on Agoda with selected dates and guests
    const agodaUrl = getAgodaUrl({
      checkIn,
      checkOut,
      adults: guests,
      rooms: 1
    });

    window.open(agodaUrl, '_blank', 'noopener,noreferrer');

    if (onCheckAvailability) {
      onCheckAvailability({
        checkIn,
        checkOut,
        guests,
        roomType
      });
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto bg-white rounded-sm shadow-2xl border border-[#C5A059]/30 p-6 sm:p-8 text-[#0A192F] ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-gray-100 text-xs text-gray-500 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-[#0A192F] tracking-wide uppercase text-[11px]">Live Availability on Agoda</span>
          <span className="hidden md:inline text-gray-400">• Real-time room rates & instant confirmation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#0A192F] text-[#C5A059] text-[10px] font-bold uppercase tracking-wider rounded-sm">
            Book via Agoda
          </span>
          <span className="text-gray-400 hidden sm:inline">•</span>
          <span className="text-[#C5A059] font-medium tracking-wider text-[11px] uppercase">Al Qasimia, Sharjah</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
        {/* Check-In */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Check-in</span>
          </label>
          <div className="border-b border-gray-200 py-1.5 font-medium transition-colors focus-within:border-[#C5A059]">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="w-full text-xs font-semibold text-[#0A192F] bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Check-Out */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Check-out</span>
          </label>
          <div className="border-b border-gray-200 py-1.5 font-medium transition-colors focus-within:border-[#C5A059]">
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="w-full text-xs font-semibold text-[#0A192F] bg-transparent focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Guests</span>
          </label>
          <div className="border-b border-gray-200 py-1.5 font-medium transition-colors focus-within:border-[#C5A059]">
            <select
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="w-full text-xs font-semibold text-[#0A192F] bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Guests (Triple Room)</option>
              <option value="4">4 Guests (Executive Suite)</option>
            </select>
          </div>
        </div>

        {/* Room Category */}
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Room Type</span>
          </label>
          <div className="border-b border-gray-200 py-1.5 font-medium transition-colors focus-within:border-[#C5A059]">
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full text-xs font-semibold text-[#0A192F] bg-transparent focus:outline-none cursor-pointer truncate"
            >
              {roomsData.map((room) => (
                <option key={room.id} value={room.slug}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="w-full h-12 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all rounded-sm cursor-pointer shadow-md active:scale-95"
          >
            <ExternalLink className="w-4 h-4 text-[#0A192F]" />
            <span>Check on Agoda</span>
          </button>
        </div>
      </form>
    </div>
  );
};
