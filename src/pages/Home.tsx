import React from 'react';
import { HOTEL_CONFIG, getWhatsAppUrl, getAgodaUrl } from '../data/hotelConfig';
import { roomsData } from '../data/roomsData';
import { venueHalls } from '../data/eventsData';
import { diningConfig, diningGalleryImages } from '../data/diningData';
import { galleryData } from '../data/galleryData';
import { hotelFacilities } from '../data/facilitiesData';
import { BookingBar } from '../components/forms/BookingBar';
import { SectionHeading } from '../components/ui/SectionHeading';
import { RoomCard } from '../components/rooms/RoomCard';
import { EventCard } from '../components/events/EventCard';
import { useAgodaPrices } from '../hooks/useAgodaPrices';
import { 
  ArrowRight, 
  MapPin, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  Clock, 
  Wifi, 
  UtensilsCrossed, 
  Users, 
  Dumbbell, 
  Luggage, 
  Sparkles,
  CalendarCheck,
  ExternalLink
} from 'lucide-react';
import { analytics } from '../utils/analytics';

interface HomePageProps {
  onNavigate: (page: string, detail?: string) => void;
  onOpenBooking: (roomType?: string) => void;
  onOpenEventEnquiry: (eventName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenBooking,
  onOpenEventEnquiry
}) => {
  const { isLoading: isLoadingPrices, getRoomPrice } = useAgodaPrices();
  const [galleryCategory, setGalleryCategory] = React.useState<string>('all');

  const filteredGallery = galleryCategory === 'all'
    ? galleryData
    : galleryData.filter((item) => item.category === galleryCategory);

  // Facility icon map
  const getFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Clock': return <Clock className="w-5 h-5 text-[#C5A059]" />;
      case 'Wifi': return <Wifi className="w-5 h-5 text-[#C5A059]" />;
      case 'UtensilsCrossed': return <UtensilsCrossed className="w-5 h-5 text-[#C5A059]" />;
      case 'Users': return <Users className="w-5 h-5 text-[#C5A059]" />;
      case 'Dumbbell': return <Dumbbell className="w-5 h-5 text-[#C5A059]" />;
      case 'Luggage': return <Luggage className="w-5 h-5 text-[#C5A059]" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#C5A059]" />;
      default: return <MapPin className="w-5 h-5 text-[#C5A059]" />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0A192F]">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-[#0A192F] text-white pt-24 pb-20 px-4 sm:px-6">
        {/* Hero Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'linear-gradient(rgba(10, 25, 47, 0.65), rgba(10, 25, 47, 0.75)), url("https://i.ibb.co/ksP8W5H1/Whats-App-Image-2026-09-04-at-4-18-08-PM-1.jpg")'
          }}
        ></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 pt-8 pb-14">
          {/* Welcome Subtitle */}
          <h2 className="text-[#C5A059] font-medium tracking-[0.4em] uppercase text-xs sm:text-sm mb-4">
            Welcome to Al Qasimia, Sharjah
          </h2>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif leading-[1.1] mb-6 text-white font-normal">
            Stay Comfortably in the <br className="hidden sm:inline" />
            <span className="italic text-[#C5A059]">Heart of Sharjah</span>
          </h1>

          <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-xl mx-auto mb-8 font-light">
            Discover comfortable accommodation, convenient facilities, and authentic dining experiences tailored for the discerning business and leisure traveller.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                analytics.trackBookNowClick('hero_primary');
                window.open(getAgodaUrl(), '_blank', 'noopener,noreferrer');
              }}
              className="w-full sm:w-auto bg-[#C5A059] text-[#0A192F] px-8 py-3.5 text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-[#B38E47] transition-all shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-[#0A192F]" />
              <span>Check Agoda Rates</span>
            </button>

            <button
              onClick={() => onNavigate('rooms')}
              className="w-full sm:w-auto border border-white/30 bg-white/5 hover:bg-white/10 px-8 py-3.5 text-xs font-semibold uppercase tracking-widest backdrop-blur-sm transition-all text-white rounded-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Rooms</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>

        {/* 2. BOOKING / ENQUIRY BAR (Integrated into lower Hero) */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-1/2 z-20 px-4 sm:px-6">
          <BookingBar
            onCheckAvailability={(params) => {
              onOpenBooking(params.roomType);
            }}
          />
        </div>
      </section>

      {/* Spacer for overlapping Booking Bar */}
      <div className="h-32 sm:h-24 bg-stone-50/70"></div>

      {/* 3. HOTEL INTRODUCTION */}
      <section className="py-20 bg-stone-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                badge="Hospitality in Sharjah"
                title="Welcome to Crystal Plaza Hotel"
                subtitle="Comfort, convenience, and dependable service in the vibrant district of Al Qasimia."
                centered={false}
              />

              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Crystal Plaza Hotel is situated in Al Qasimia, offering guests a welcoming retreat within Sharjah. Whether visiting for business meetings, leisure travel, or hosting special family occasions, our hotel provides practical amenities, well-maintained rooms, and attentive staff available 24 hours a day.
                </p>
                <p>
                  Our location allows effortless travel to key cultural heritage sites, commercial zones, retail centers, and government offices across Sharjah and neighboring emirates. Enjoy fresh international dining at our in-house restaurant, host successful conferences or wedding receptions in our event halls, and unwind in thoughtfully appointed guest rooms.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                {HOTEL_CONFIG.PILLARS.map((pillar, idx) => (
                  <div key={idx} className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A192F] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
                      {pillar.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-snug">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={() => onNavigate('about')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A192F] hover:bg-[#152a4a] text-[#C5A059] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  <span>Discover More</span>
                  <ArrowRight className="w-4 h-4 text-[#C5A059]" />
                </button>
                
                <a
                  href={getWhatsAppUrl('general')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-[#0A192F]/30 hover:border-[#0A192F] text-[#0A192F] text-xs font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Intro Visual Mosaic */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-sm overflow-hidden shadow-lg aspect-[4/5] bg-[#0A192F] border border-[#C5A059]/20">
                  <img
                    src="https://i.ibb.co/b542Q4xz/Chat-GPT-Image-Sep-5-2026-10-38-32-AM.png"
                    alt="Crystal Plaza Hotel King Bed guest room"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 bg-white rounded-sm border border-gray-200 shadow-sm text-center">
                  <p className="font-serif text-2xl font-bold text-[#0A192F]">24/7</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Front Desk & Service</p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="p-4 bg-[#0A192F] text-white rounded-sm shadow-sm text-center border border-[#C5A059]/30">
                  <p className="font-serif text-2xl font-bold text-[#C5A059]">Al Qasimia</p>
                  <p className="text-[10px] text-gray-300 uppercase tracking-widest font-semibold">Prime Sharjah Location</p>
                </div>
                <div className="rounded-sm overflow-hidden shadow-lg aspect-[4/5] bg-[#0A192F] border border-[#C5A059]/20">
                  <img
                    src="https://i.ibb.co/fz8CHH3x/Whats-App-Image-2026-09-04-at-5-06-41-PM.jpg"
                    alt="Crystal Plaza Hotel dining atmosphere"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED ROOMS */}
      <section className="py-20 bg-white border-y border-[#C5A059]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            badge="Accommodation"
            title="Rooms Designed for Your Comfort"
            subtitle="Choose from thoughtfully furnished rooms equipped with comfortable bedding, modern bathrooms, and practical in-room amenities."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomsData.slice(0, 3).map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                priceResult={getRoomPrice(room.slug)}
                isLoadingPrice={isLoadingPrices}
                onViewDetails={(slug) => onNavigate('room-details', slug)}
                onBookNow={(slug) => onOpenBooking(slug)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('rooms')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0A192F] hover:bg-[#152a4a] text-white font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer shadow-md"
            >
              <span>View All Rooms & Rates</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. WHY STAY WITH US / HOTEL FACILITIES */}
      <section className="py-20 bg-[#0A192F] text-white border-y border-[#C5A059]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            badge="Hotel Amenities"
            title="Why Stay With Us"
            subtitle="Essential facilities and thoughtful conveniences designed to make your Sharjah visit hassle-free."
            light={true}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hotelFacilities.map((fac) => (
              <div
                key={fac.id}
                className="bg-[#071120] border border-[#C5A059]/20 p-6 rounded-sm hover:border-[#C5A059] transition-all group shadow-lg"
              >
                <div className="w-12 h-12 rounded-sm bg-[#0A192F] border border-[#C5A059]/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  {getFacilityIcon(fac.icon)}
                </div>
                <h3 className="text-base font-bold font-serif text-white mb-2">
                  {fac.name}
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {fac.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DINING SECTION */}
      <section className="py-20 bg-stone-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <SectionHeading
                badge="Dining Experience"
                title="Dining at Crystal Plaza Hotel"
                subtitle="Enjoy delicious dining in a comfortable setting at Crystal Plaza Hotel."
                centered={false}
              />

              <p className="text-sm text-gray-600 leading-relaxed">
                {diningConfig.description}
              </p>

              <div className="space-y-2.5">
                {diningConfig.highlights.slice(0, 4).map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs text-[#0A192F] font-medium">
                    <CheckCircle className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('dining')}
                  className="px-6 py-3 bg-[#0A192F] hover:bg-[#152a4a] text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Restaurant & Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={HOTEL_CONFIG.ROOM_SERVICE_TEL}
                  className="px-5 py-3 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Phone className="w-4 h-4 text-[#0A192F]" />
                  <span>Room Service: {HOTEL_CONFIG.ROOM_SERVICE_DISPLAY}</span>
                </a>

                <a
                  href={getWhatsAppUrl('dining')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 border border-[#0A192F]/30 hover:border-[#0A192F] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Dining Enquiry</span>
                </a>
              </div>
            </div>

            {/* Dining Visual Grid */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              {diningGalleryImages.slice(0, 4).map((img, idx) => (
                <div key={idx} className="rounded-sm overflow-hidden shadow-md aspect-[4/3] bg-[#0A192F] border border-[#C5A059]/20 group">
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. EVENTS & BANQUETS */}
      <section className="py-20 bg-white border-y border-[#C5A059]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            badge="Events & Banquets"
            title="Celebrate Your Moments With Us"
            subtitle="From wedding receptions to private family banquets and celebrations, Crystal Banquet Hall provides a prestigious setting."
          />

          <div className="max-w-2xl mx-auto">
            {venueHalls.map((venue) => (
              <EventCard
                key={venue.id}
                venue={venue}
                onEnquire={(name) => onOpenEventEnquiry(name)}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => onNavigate('events')}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs uppercase tracking-widest rounded-sm shadow-md transition-all cursor-pointer"
            >
              <span>Explore Venue & Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 8. HOTEL GALLERY */}
      <section className="py-20 bg-white border-t border-[#C5A059]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <SectionHeading
            badge="Photography"
            title="A Glimpse into Crystal Plaza Hotel"
            subtitle="Browse through our hotel rooms, banquet halls, dining restaurant, and fitness spaces."
          />

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'all', label: 'All Photos' },
              { id: 'hotel', label: 'Lobby & Reception' },
              { id: 'rooms', label: 'Guest Rooms' },
              { id: 'events', label: 'Banquet & Events' },
              { id: 'dining', label: 'Dining' },
              { id: 'facilities', label: 'Gym & Facilities' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setGalleryCategory(tab.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  galleryCategory === tab.id
                    ? 'bg-[#0A192F] text-[#C5A059] shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredGallery.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-[4/3] rounded-sm overflow-hidden shadow-sm bg-[#0A192F] border border-[#C5A059]/20"
              >
                <img
                  src={item.image}
                  alt={item.alt_text}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#0A192F]/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 text-white">
                  <span className="text-[10px] text-[#C5A059] uppercase tracking-wider font-bold mb-0.5">
                    {item.category}
                  </span>
                  <p className="text-xs font-semibold leading-tight">{item.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. LOCATION & MAP */}
      <section className="py-20 bg-stone-50/70 border-t border-[#C5A059]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <SectionHeading
                badge="Sharjah Destination"
                title="Convenient Al Qasimia Location"
                subtitle="Easily reachable in the heart of Sharjah, United Arab Emirates."
                centered={false}
              />

              <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                <p>
                  Located in the Al Qasimia district, Crystal Plaza Hotel offers guests straightforward accessibility to commercial areas, shopping centers, cultural attractions, and dining venues across Sharjah.
                </p>
                <div className="p-4 bg-white rounded-sm border border-gray-200 shadow-sm space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#C5A059] mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-[#0A192F]">Hotel Address</p>
                      <p className="text-xs text-gray-600">{HOTEL_CONFIG.FULL_ADDRESS}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={HOTEL_CONFIG.GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#0A192F] hover:bg-[#152a4a] text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors text-center cursor-pointer"
                >
                  Get Directions in Google Maps
                </a>

                <button
                  onClick={() => onNavigate('contact')}
                  className="px-5 py-3 border border-[#0A192F]/30 hover:border-[#0A192F] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-sm transition-colors text-center cursor-pointer"
                >
                  Contact Details
                </button>
              </div>
            </div>

            {/* Interactive / Clean Google Map Container */}
            <div className="lg:col-span-7 h-[380px] rounded-sm overflow-hidden shadow-lg border border-[#C5A059]/20 bg-[#0A192F]">
              <iframe
                title="Crystal Plaza Hotel Sharjah Map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(HOTEL_CONFIG.GOOGLE_MAPS_EMBED_QUERY)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <section className="py-20 bg-[#0A192F] text-white relative overflow-hidden border-t border-[#C5A059]/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-white">
            Plan Your Stay with <span className="italic text-[#C5A059]">Crystal Plaza Hotel</span>
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
            Experience comfortable accommodation, attentive guest care, and convenient access to Sharjah’s best destinations. Contact our team today for enquiries and bookings.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                analytics.trackBookNowClick('final_cta');
                window.open(getAgodaUrl(), '_blank', 'noopener,noreferrer');
              }}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs uppercase tracking-widest rounded-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4 text-[#0A192F]" />
              <span>Check Agoda Rates</span>
            </button>

            <a
              href={getWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.trackWhatsAppClick('final_cta')}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href={HOTEL_CONFIG.PHONE_TEL}
              onClick={() => analytics.trackPhoneClick('final_cta')}
              className="w-full sm:w-auto px-6 py-3.5 bg-[#071120] hover:bg-[#071120]/80 text-gray-200 border border-slate-700 font-bold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>Call Now</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
