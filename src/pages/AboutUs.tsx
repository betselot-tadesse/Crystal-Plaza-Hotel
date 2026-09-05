import React from 'react';
import { HOTEL_CONFIG, getWhatsAppUrl } from '../data/hotelConfig';
import { hotelFacilities } from '../data/facilitiesData';
import { galleryData } from '../data/galleryData';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import { 
  MapPin, 
  Clock, 
  Wifi, 
  UtensilsCrossed, 
  Users, 
  Dumbbell, 
  Luggage, 
  Sparkles, 
  ArrowRight,
  MessageCircle,
  Phone
} from 'lucide-react';

interface AboutUsPageProps {
  onNavigate: (page: string, detail?: string) => void;
  onOpenBooking: () => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({ onNavigate, onOpenBooking }) => {
  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return <Clock className="w-5 h-5 text-amber-600" />;
      case 'Wifi': return <Wifi className="w-5 h-5 text-amber-600" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-amber-600" />;
      case 'Users': return <Users className="w-5 h-5 text-amber-600" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-amber-600" />;
      case 'Luggage': return <Luggage className="w-5 h-5 text-amber-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-600" />;
      default: return <MapPin className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <Breadcrumbs
        items={[{ label: 'About Us', active: true }]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Hero Section */}
      <div className="bg-slate-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://i.ibb.co/jPTbsb33/Whats-App-Image-2026-09-04-at-5-14-38-PM.jpg"
            alt="Crystal Plaza Hotel Entrance and Lobby"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-500/30">
            About Crystal Plaza Hotel
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold tracking-tight">
            Comfort & Convenience in Sharjah
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A welcoming destination situated in Al Qasimia, dedicated to providing dependable hospitality, comfortable stays, and practical facilities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-20">
        {/* 1. ABOUT CRYSTAL PLAZA HOTEL & OUR HOSPITALITY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              badge="Our Identity"
              title="About Crystal Plaza Hotel"
              subtitle="Providing warm hospitality and comfortable accommodation in Al Qasimia, Sharjah."
              centered={false}
            />

            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Crystal Plaza Hotel welcomes business travellers, holidaymakers, and families to the emirate of Sharjah. Positioned centrally in the Al Qasimia district, our hotel emphasizes genuine guest service, clean and well-appointed rooms, and practical guest facilities.
              </p>
              <p>
                Our philosophy centers around four core commitments: <strong>Comfort</strong> through restful guest rooms and quality bedding; <strong>Convenience</strong> via our central urban location and responsive 24-hour service; <strong>Value</strong> through competitive pricing and transparent communication; and <strong>Hospitality</strong> driven by our courteous and professional team.
              </p>
              <p>
                Whether arriving for a short city stopover, a business trip, a wedding banquet, or an event gathering, Crystal Plaza Hotel ensures every guest receives attentive care from the moment of check-in until departure.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              {HOTEL_CONFIG.PILLARS.map((p, idx) => (
                <div key={idx} className="space-y-1">
                  <h4 className="text-xs font-bold uppercase text-slate-900">{p.title}</h4>
                  <p className="text-[11px] text-slate-500">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 gap-4">
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-slate-900">
              <img
                src="https://i.ibb.co/N21YsLpF/Whats-App-Image-2026-09-04-at-5-21-07-PM.jpg"
                alt="Hotel Reception and Lobby Foyer"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3] bg-slate-900">
              <img
                src="https://i.ibb.co/pB6BWFgN/Chat-GPT-Image-Sep-5-2026-10-48-05-AM.png"
                alt="Crystal Plaza Hotel Suite Room"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* 2. GUEST EXPERIENCE & FACILITIES */}
        <div>
          <SectionHeading
            badge="Services & Amenities"
            title="Hotel Facilities"
            subtitle="Thoughtful features provided to enhance your comfort and ease during your stay."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotelFacilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-white border border-slate-200/80 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center mb-4">
                  {getFacilityIcon(fac.icon)}
                </div>
                <h3 className="text-base font-bold font-serif-luxury text-slate-900 mb-2">
                  {fac.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {fac.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. LOCATION & SHARJAH ACCESSIBILITY */}
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold uppercase tracking-wider border border-amber-500/30">
                <MapPin className="w-3.5 h-3.5" />
                <span>Al Qasimia District, Sharjah</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                In the Centre of Al Qasimia
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Al Qasimia is one of Sharjah’s established urban districts, offering easy connections to major commercial avenues, traditional souqs, modern hypermarkets, medical centers, and transport corridors. Guests staying at Crystal Plaza Hotel benefit from swift transit times to both Sharjah and Dubai destinations.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href={HOTEL_CONFIG.GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  View on Google Maps
                </a>
                <button
                  onClick={() => onNavigate('contact')}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
                >
                  Contact Reception
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800/80 p-6 rounded-xl border border-slate-700 space-y-3 text-xs">
              <h3 className="font-bold text-amber-400 uppercase tracking-wider text-xs">
                Hotel Location Highlights
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Central Al Qasimia neighbourhood in Sharjah, UAE</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Direct road links to Sharjah City Centre and heritage areas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Surrounded by local restaurants, retail stores, and amenities</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>Straightforward access to Sharjah International Airport</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. HOTEL GALLERY */}
        <div>
          <SectionHeading
            badge="Moments"
            title="Hotel Gallery"
            subtitle="Take a tour through our guest accommodations, dining room, and events spaces."
          />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryData.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-slate-900"
              >
                <img
                  src={item.image}
                  alt={item.alt_text}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white">
                  <p className="text-xs font-semibold">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-3xl mx-auto">
          <h3 className="text-xl font-bold font-serif-luxury text-slate-900">
            Have Questions About Your Stay?
          </h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Our front desk is available 24/7 to provide information on room availability, banquet bookings, or travel directions.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenBooking}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow"
            >
              BOOK YOUR STAY
            </button>
            <a
              href={getWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-slate-900 text-emerald-400 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
