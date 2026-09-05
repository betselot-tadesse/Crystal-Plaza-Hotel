import React from 'react';
import { Calendar, Users, RefreshCw, Loader2, Info } from 'lucide-react';

interface AgodaDateSelectorProps {
  checkIn: string;
  checkOut: string;
  guests: number;
  onDatesChange: (params: { checkIn: string; checkOut: string; guests: number }) => void;
  isLoading?: boolean;
  livePricingAvailable?: boolean;
  disclaimer?: string;
  variant?: 'compact' | 'bar';
}

export const AgodaDateSelector: React.FC<AgodaDateSelectorProps> = ({
  checkIn,
  checkOut,
  guests,
  onDatesChange,
  isLoading = false,
  livePricingAvailable = false,
  disclaimer,
  variant = 'bar'
}) => {
  // Format today's minimum selectable date YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckIn = e.target.value;
    let newCheckOut = checkOut;
    // Ensure checkOut is at least 1 day after checkIn
    if (new Date(newCheckOut) <= new Date(newCheckIn)) {
      const nextDay = new Date(newCheckIn);
      nextDay.setDate(nextDay.getDate() + 1);
      newCheckOut = nextDay.toISOString().split('T')[0];
    }
    onDatesChange({ checkIn: newCheckIn, checkOut: newCheckOut, guests });
  };

  const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCheckOut = e.target.value;
    onDatesChange({ checkIn, checkOut: newCheckOut, guests });
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onDatesChange({ checkIn, checkOut, guests: parseInt(e.target.value, 10) });
  };

  if (variant === 'compact') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Select Dates for Agoda Rates</span>
          </span>
          {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#C5A059]" />}
        </div>

        <div className="space-y-2.5">
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
              Check-In Date
            </label>
            <input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={handleCheckInChange}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#C5A059] text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
              Check-Out Date
            </label>
            <input
              type="date"
              min={checkIn || todayStr}
              value={checkOut}
              onChange={handleCheckOutChange}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#C5A059] text-gray-800"
            />
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
              Guests
            </label>
            <select
              value={guests}
              onChange={handleGuestsChange}
              className="w-full text-xs py-1.5 px-2.5 bg-white border border-gray-300 rounded-sm focus:outline-none focus:border-[#C5A059] text-gray-800"
            >
              <option value={1}>1 Adult</option>
              <option value={2}>2 Adults</option>
              <option value={3}>3 Adults</option>
              <option value={4}>4 Adults</option>
            </select>
          </div>
        </div>

        {disclaimer && (
          <p className="text-[10px] text-gray-400 leading-tight flex items-start gap-1 pt-1">
            <Info className="w-3 h-3 text-[#C5A059] flex-shrink-0 mt-0.5" />
            <span>{disclaimer}</span>
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-5 rounded-sm border border-gray-200 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#C5A059]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Check Agoda Date-Based Pricing
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          {isLoading ? (
            <span className="flex items-center gap-1 text-[#C5A059]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Querying Agoda...</span>
            </span>
          ) : livePricingAvailable ? (
            <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Live Rates Active
            </span>
          ) : (
            <span className="text-[11px] text-gray-500">
              Live prices updated directly on Agoda
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Check-In
          </label>
          <div className="relative">
            <input
              type="date"
              min={todayStr}
              value={checkIn}
              onChange={handleCheckInChange}
              className="w-full text-xs py-2 px-3 bg-stone-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] text-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Check-Out
          </label>
          <div className="relative">
            <input
              type="date"
              min={checkIn || todayStr}
              value={checkOut}
              onChange={handleCheckOutChange}
              className="w-full text-xs py-2 px-3 bg-stone-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] text-gray-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Guests
          </label>
          <div className="relative">
            <select
              value={guests}
              onChange={handleGuestsChange}
              className="w-full text-xs py-2 px-3 bg-stone-50 border border-gray-200 rounded-sm focus:outline-none focus:border-[#C5A059] text-gray-800"
            >
              <option value={1}>1 Adult</option>
              <option value={2}>2 Adults</option>
              <option value={3}>3 Adults</option>
              <option value={4}>4 Adults</option>
            </select>
          </div>
        </div>
      </div>

      {disclaimer && (
        <div className="pt-2 border-t border-gray-100 flex items-start gap-1.5 text-[11px] text-gray-500">
          <Info className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0 mt-0.5" />
          <p className="leading-tight">{disclaimer}</p>
        </div>
      )}
    </div>
  );
};
