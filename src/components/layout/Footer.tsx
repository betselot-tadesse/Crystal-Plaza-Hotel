import React from 'react';
import { HOTEL_CONFIG, getWhatsAppUrl, getAgodaUrl } from '../../data/hotelConfig';
import { Phone, Mail, MapPin, MessageCircle, Instagram, Facebook, Linkedin, ShieldCheck, ArrowUp, ExternalLink, Utensils } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenBooking: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071120] text-gray-400 pt-16 pb-24 sm:pb-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-14 border-b border-white/10">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <img
                src={HOTEL_CONFIG.LOGO_URL}
                alt="Crystal Plaza Hotel Logo"
                className="w-12 h-12 rounded-full object-cover border-2 border-[#C5A059] shadow-md flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white uppercase">
                  <span className="text-[#C5A059]">Crystal</span> Plaza Hotel
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium mt-0.5">
                  Al Qasimia • Sharjah • UAE
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Offering comfortable accommodation, convenient facilities, dining, and event spaces in the central heart of Sharjah, United Arab Emirates.
            </p>

            <div className="pt-2 flex items-center gap-2.5">
              <a
                href={HOTEL_CONFIG.INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Crystal Hospitality Group on Instagram"
                className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C5A059] hover:border-[#C5A059] cursor-pointer transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={HOTEL_CONFIG.LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Crystal Plaza Hotel on LinkedIn"
                className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C5A059] hover:border-[#C5A059] cursor-pointer transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={HOTEL_CONFIG.FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Crystal Plaza Hotel on Facebook"
                className="h-8 w-8 rounded-full border border-white/10 flex items-center justify-center text-gray-300 hover:text-[#C5A059] hover:border-[#C5A059] cursor-pointer transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={getWhatsAppUrl('general')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => analytics.trackWhatsAppClick('footer_social')}
                aria-label="Contact via WhatsApp"
                className="h-8 w-8 rounded-full border border-emerald-500/40 text-emerald-400 flex items-center justify-center hover:border-emerald-400 cursor-pointer transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-[0.15em] uppercase mb-5 flex items-center gap-2">
              <span className="text-[#C5A059] text-xs">●</span>
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs tracking-wide">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('rooms')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Rooms & Accommodation</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('dining')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Dining & Restaurant</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('events')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Events & Banquets</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>About Us</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contact')}
                  className="hover:text-[#C5A059] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Contact & Location</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-[0.15em] uppercase mb-5 flex items-center gap-2">
              <span className="text-[#C5A059] text-xs">●</span>
              Contact Information
            </h3>
            <ul className="space-y-3.5 text-xs">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C5A059] mt-0.5 flex-shrink-0" />
                <span className="text-gray-300">
                  {HOTEL_CONFIG.FULL_ADDRESS}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#C5A059] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Rooms & Hotel Inquiry:</span>
                  <a
                    href={HOTEL_CONFIG.PHONE_TEL}
                    onClick={() => analytics.trackPhoneClick('footer_phone')}
                    className="hover:text-[#C5A059] font-medium text-white transition-colors block"
                  >
                    {HOTEL_CONFIG.PHONE_NUMBER}
                  </a>
                  <a
                    href={getWhatsAppUrl('general')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analytics.trackWhatsAppClick('footer_rooms_whatsapp')}
                    className="hover:text-emerald-400 text-[11px] text-emerald-400 transition-colors flex items-center gap-1 mt-0.5"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                    <span>WhatsApp: {HOTEL_CONFIG.WHATSAPP_DISPLAY}</span>
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Utensils className="w-4 h-4 text-[#C5A059] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-semibold">Banquet Hall & Dining Inquiry:</span>
                  <a
                    href={HOTEL_CONFIG.EVENTS_DINING_TEL}
                    className="hover:text-[#C5A059] font-medium text-white transition-colors block"
                  >
                    {HOTEL_CONFIG.EVENTS_DINING_DISPLAY}
                  </a>
                  <a
                    href={getWhatsAppUrl('event')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => analytics.trackWhatsAppClick('footer_dining_whatsapp')}
                    className="hover:text-emerald-400 text-[11px] text-emerald-400 transition-colors flex items-center gap-1 mt-0.5"
                  >
                    <MessageCircle className="w-3 h-3 text-emerald-400" />
                    <span>WhatsApp: {HOTEL_CONFIG.EVENTS_DINING_DISPLAY}</span>
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <a
                  href={`mailto:${HOTEL_CONFIG.EMAIL}`}
                  className="hover:text-[#C5A059] transition-colors"
                >
                  {HOTEL_CONFIG.EMAIL}
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Enquiry CTA */}
          <div className="bg-[#0A192F] p-6 rounded-sm border border-[#C5A059]/20 space-y-4 shadow-xl">
            <h3 className="text-white font-semibold text-xs tracking-[0.15em] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              Agoda Live Booking
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Check live room availability, transparent rates, and reserve with instant confirmation directly on Agoda.
            </p>
            <button
              onClick={() => {
                analytics.trackBookNowClick('footer_agoda');
                window.open(getAgodaUrl(), '_blank', 'noopener,noreferrer');
              }}
              className="w-full py-2.5 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs uppercase tracking-wider rounded-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#0A192F]" />
              <span>Check Agoda Rates</span>
            </button>
            <a
              href={getWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.trackWhatsAppClick('footer_whatsapp_cta')}
              className="w-full py-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-500/30 font-semibold text-xs tracking-wider rounded-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Instant Chat</span>
            </a>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-gray-400 tracking-wider uppercase">
          <div>
            <p>© 2026 CRYSTAL PLAZA HOTEL. AL QASIMIA, SHARJAH, UAE.</p>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => handleNav('privacy-policy')}
              className="hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-gray-700">•</span>
            <button
              onClick={() => handleNav('terms-and-conditions')}
              className="hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              Terms & Conditions
            </button>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-sm bg-[#0A192F] border border-[#C5A059]/30 hover:border-[#C5A059] text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
