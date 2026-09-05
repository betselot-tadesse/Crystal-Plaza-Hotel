import React, { useState } from 'react';
import { EventVenue } from '../../types/database';
import { Users, Check, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface EventCardProps {
  venue: EventVenue;
  onEnquire: (venueName: string) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ venue, onEnquire }) => {
  const images = venue.images && venue.images.length > 0 ? venue.images : [venue.image];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-slate-200/80 overflow-hidden flex flex-col transition-all duration-300">
      {/* Image Container with Multi-Photo Switcher */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 group">
        <img
          src={images[activeImageIdx]}
          alt={`${venue.name} photo ${activeImageIdx + 1}`}
          className="w-full h-full object-cover object-center transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none"></div>

        {/* Multi-photo controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous photo"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next photo"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white flex items-center justify-center transition-all cursor-pointer shadow-md backdrop-blur-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-sm border border-white/20 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-amber-400" />
              <span>{activeImageIdx + 1} / {images.length}</span>
            </div>

            {/* Thumbnail dots */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`inline-block h-1.5 rounded-full transition-all ${
                    activeImageIdx === idx ? 'w-5 bg-amber-400' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        <div className="absolute bottom-3 left-3 right-3 pointer-events-none">
          <h3 className="text-xl font-bold font-serif-luxury text-white">
            {venue.name}
          </h3>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            {venue.description}
          </p>

          {/* Capacities Grid */}
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg mb-4">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              <span>Seating Capacities</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {venue.capacity.theater && (
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">{venue.capacity.theater}</span> Theater
                </div>
              )}
              {venue.capacity.banquet && (
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">{venue.capacity.banquet}</span> Banquet
                </div>
              )}
              {venue.capacity.classroom && (
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">{venue.capacity.classroom}</span> Classroom
                </div>
              )}
              {venue.capacity.reception && (
                <div className="text-slate-600">
                  <span className="font-semibold text-slate-900">{venue.capacity.reception}</span> Reception
                </div>
              )}
            </div>
          </div>

          {/* Facilities preview */}
          <div className="space-y-1.5 mb-5">
            <h4 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Key Venue Features
            </h4>
            {venue.facilities.slice(0, 3).map((facility, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-600">
                <Check className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span className="truncate">{facility}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button
            onClick={() => {
              analytics.trackEvent('event_venue_enquire', { venue: venue.name });
              onEnquire(venue.name);
            }}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <span>REQUEST VENUE QUOTE</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
