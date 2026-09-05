import React from 'react';
import { eventCategories, venueHalls, banquetHallGallery } from '../data/eventsData';
import { HOTEL_CONFIG, getWhatsAppUrl } from '../data/hotelConfig';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import { EventCard } from '../components/events/EventCard';
import { BanquetInquiryForm } from '../components/events/BanquetInquiryForm';
import { 
  HeartHandshake, 
  Briefcase, 
  Users, 
  Sparkles, 
  PartyPopper,
  MessageCircle
} from 'lucide-react';

interface EventsPageProps {
  onNavigate: (page: string, detail?: string) => void;
  onOpenEventEnquiry?: (eventName?: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigate }) => {
  const scrollToForm = () => {
    const el = document.getElementById('banquet-inquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-amber-600" />;
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-amber-600" />;
      case 'Users': return <Users className="w-5 h-5 text-amber-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
      case 'PartyPopper': return <PartyPopper className="w-5 h-5 text-amber-600" />;
      default: return <Users className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <Breadcrumbs
        items={[{ label: 'Events & Banquets', active: true }]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Hero Section */}
      <div className="bg-slate-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://i.ibb.co/6JvRNWrw/Whats-App-Image-2026-08-25-at-1-58-17-PM.jpg"
            alt="Crystal Plaza Hotel Banquet & Events Hall"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-500/30">
            Event Venues & Meeting Facilities
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold tracking-tight">
            Celebrate Your Moments With Us
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            From corporate gatherings to special celebrations, Crystal Plaza Hotel provides a convenient setting for memorable events.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={scrollToForm}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow cursor-pointer transition-all"
            >
              REQUEST A QUOTE
            </button>
            <a
              href={getWhatsAppUrl('event')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-emerald-400 font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Event Planner</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-20">
        {/* 1. EVENT TYPES & OCCASIONS */}
        <div>
          <SectionHeading
            badge="Occasions"
            title="Events We Host"
            subtitle="Explore how our flexible halls and banquet facilities cater to business and social gatherings."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventCategories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <h3 className="text-base font-bold font-serif-luxury text-slate-900 mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {cat.description}
                  </p>
                </div>

                <button
                  onClick={scrollToForm}
                  className="text-left text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider pt-2 border-t border-slate-100 flex items-center gap-1.5"
                >
                  <span>Inquire for this event</span>
                  <span>→</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. EVENT VENUE SECTION */}
        <div>
          <SectionHeading
            badge="Venue Specifications"
            title="Banquet & Event Hall"
            subtitle="Configurable seating configurations, modern audiovisual support, and dedicated catering packages."
          />

          <div className="max-w-3xl mx-auto">
            {venueHalls.map((venue) => (
              <EventCard
                key={venue.id}
                venue={venue}
                onEnquire={scrollToForm}
              />
            ))}
          </div>

          {/* Banquet Hall Gallery Grid */}
          <div className="mt-12 max-w-5xl mx-auto">
            <h3 className="text-center text-sm uppercase tracking-widest font-bold text-amber-700 mb-2">
              Hall Photography & Setups
            </h3>
            <p className="text-center text-xs text-slate-500 mb-6">
              View real photos of our banquet hall setups, dining arrangements, and staging in Sharjah
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              {banquetHallGallery.map((photo, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                    <p className="text-xs font-semibold">{photo.title}</p>
                    <p className="text-[10px] text-amber-300 line-clamp-1">{photo.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. EVENT ENQUIRY FORM - DIRECT ON PAGE (NO POPUP) */}
        <div className="max-w-4xl mx-auto">
          <BanquetInquiryForm source="events_page" />
        </div>
      </div>
    </div>
  );
};
