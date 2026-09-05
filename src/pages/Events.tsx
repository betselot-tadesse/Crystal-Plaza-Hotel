import React, { useState } from 'react';
import { eventCategories, venueHalls, banquetHallGallery } from '../data/eventsData';
import { HOTEL_CONFIG, getWhatsAppUrl } from '../data/hotelConfig';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import { EventCard } from '../components/events/EventCard';
import { 
  HeartHandshake, 
  Briefcase, 
  Users, 
  Sparkles, 
  PartyPopper, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  MessageCircle, 
  Calendar,
  User,
  Mail
} from 'lucide-react';
import { analytics } from '../utils/analytics';

interface EventsPageProps {
  onNavigate: (page: string, detail?: string) => void;
  onOpenEventEnquiry: (eventName?: string) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({ onNavigate, onOpenEventEnquiry }) => {
  // Inline Quote Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [eventType, setEventType] = useState('Wedding / Reception');
  const [eventDate, setEventDate] = useState('');
  const [guestCount, setGuestCount] = useState('50');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

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

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !phone.trim() || !email.trim() || !eventDate) {
      setFormError('Please fill in all required fields (Name, Phone, Email, Event Date).');
      return;
    }

    setIsSubmitting(true);
    try {
      analytics.trackEnquirySubmit('EVENT_QUOTE', {
        name: fullName,
        eventType,
        eventDate,
        guestCount,
        budget
      });

      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
    } catch (err) {
      setFormError('Failed to send enquiry. Please contact our events department directly.');
    } finally {
      setIsSubmitting(false);
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
            <a
              href="#quote-form"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow"
            >
              REQUEST A QUOTE
            </a>
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
                  onClick={() => onOpenEventEnquiry(cat.title)}
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
                onEnquire={(name) => onOpenEventEnquiry(name)}
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

        {/* 3. EVENT ENQUIRY FORM - REQUEST A QUOTE */}
        <div id="quote-form" className="scroll-mt-24 max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-6 sm:p-8 text-white border-b border-slate-800">
            <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-500/30 mb-2">
              Banquets & Meetings
            </div>
            <h2 className="text-2xl font-serif-luxury font-bold text-white">
              Request an Event Quote
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Tell us about your planned gathering in Sharjah. Our event coordinator will prepare a tailored proposal with venue options and menu packages.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
              <span className="text-amber-400 font-semibold uppercase tracking-wider text-[11px]">
                Direct Inquiry:
              </span>
              <a
                href={HOTEL_CONFIG.EVENTS_DINING_TEL}
                className="inline-flex items-center gap-1.5 text-white hover:text-amber-400 font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Call {HOTEL_CONFIG.EVENTS_DINING_DISPLAY}</span>
              </a>
              <span className="text-slate-600">|</span>
              <a
                href={getWhatsAppUrl('event')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp {HOTEL_CONFIG.EVENTS_DINING_DISPLAY}</span>
              </a>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {isSubmitted ? (
              <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold font-serif-luxury text-slate-900">
                  Thank you. Your enquiry has been received. Our team will contact you shortly.
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  We have logged your request for the {eventType} on {eventDate}. Our events manager will review the requirements and reach out via telephone and email.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={getWhatsAppUrl('event', `${eventType} for ${guestCount} guests on ${eventDate}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </a>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-lg"
                  >
                    Submit Another Enquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                {formError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Contact person"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 pl-8 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Contact Phone *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="e.g. +971 50 123 4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 pl-8 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 pl-8 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Event Type *
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Wedding / Reception">Wedding / Reception</option>
                      <option value="Corporate Meeting">Corporate Meeting</option>
                      <option value="Conference / Workshop">Conference / Workshop</option>
                      <option value="Birthday Celebration">Birthday Celebration</option>
                      <option value="Private Dinner">Private Dinner</option>
                      <option value="Social Event">Social Event</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Event Date *
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Number of Guests *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 50"
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      min="10"
                      required
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Budget (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="in AED"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message / Venue Requirements
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Specific seating layout, catering preferences, or technical audio/visual equipment..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting Event Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>SEND ENQUIRY</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
