import React, { useState, useEffect } from 'react';
import { HOTEL_CONFIG, getWhatsAppUrl, getAgodaUrl } from '../../data/hotelConfig';
import { Phone, MessageCircle, Menu, X, CalendarCheck, ExternalLink, Utensils } from 'lucide-react';
import { analytics } from '../../utils/analytics';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string, detail?: string) => void;
  onOpenBooking: (roomType?: string) => void;
  isTransparentHero?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenBooking,
  isTransparentHero = false
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'HOME' },
    { id: 'rooms', label: 'ROOMS' },
    { id: 'dining', label: 'DINING' },
    { id: 'events', label: 'EVENTS' },
    { id: 'about', label: 'ABOUT' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isSolid = isScrolled || !isTransparentHero;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? 'bg-[#0A192F] text-white shadow-xl border-b border-[#C5A059]/20 py-3'
          : 'bg-gradient-to-b from-[#0A192F]/95 via-[#0A192F]/70 to-transparent text-white py-3.5 sm:py-4.5'
      }`}
    >
      {/* Top Utility Bar (visible on desktop) */}
      <div className="hidden lg:block border-b border-[#C5A059]/15 pb-2 mb-2 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-6 text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]"></span>
              Al Qasimia, Sharjah, United Arab Emirates
            </span>
            <a
              href={HOTEL_CONFIG.PHONE_TEL}
              onClick={() => analytics.trackPhoneClick('top_bar')}
              className="flex items-center gap-1.5 hover:text-[#C5A059] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{HOTEL_CONFIG.PHONE_NUMBER}</span>
            </a>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={HOTEL_CONFIG.ROOM_SERVICE_TEL}
              className="flex items-center gap-1.5 hover:text-[#C5A059] transition-colors"
              title="Room Service & Dining Orders"
            >
              <Utensils className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Room Service: <strong className="text-white font-semibold">{HOTEL_CONFIG.ROOM_SERVICE_DISPLAY}</strong></span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={getWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => analytics.trackWhatsAppClick('top_bar')}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: {HOTEL_CONFIG.WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex flex-col text-left group focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-sm"
          aria-label="Crystal Plaza Hotel - Home"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">
              <span className="text-[#C5A059]">Crystal</span> Plaza Hotel
            </span>
          </div>
          <span className="text-[10px] tracking-[0.25em] text-slate-300 uppercase font-light">
            Al Qasimia • Sharjah
          </span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-8 text-xs font-semibold tracking-[0.1em] uppercase">
          {navLinks.map((link) => {
            const isActive = currentPage === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 transition-colors uppercase ${
                  isActive
                    ? 'text-[#C5A059] font-bold'
                    : 'text-slate-200 hover:text-[#C5A059]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Desktop Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Secondary CTA: WhatsApp Us */}
          <a
            href={getWhatsAppUrl('general')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => analytics.trackWhatsAppClick('header_button')}
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold tracking-wider uppercase text-emerald-400 border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/50 rounded-sm transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* Primary CTA: Book Your Stay */}
          <button
            onClick={() => {
              analytics.trackBookNowClick('header_primary');
              window.open(getAgodaUrl(), '_blank', 'noopener,noreferrer');
            }}
            className="inline-flex items-center gap-2 bg-[#C5A059] text-[#0A192F] px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#B38E47] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-[#0A192F]" />
            <span>Check Agoda Rates</span>
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={() => {
              analytics.trackBookNowClick('header_mobile_icon');
              window.open(getAgodaUrl(), '_blank', 'noopener,noreferrer');
            }}
            className="sm:hidden px-3 py-1.5 text-xs font-bold uppercase bg-[#C5A059] text-[#0A192F] rounded-sm font-sans"
          >
            Agoda
          </button>
          
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-200 hover:text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0A192F] border-b border-[#C5A059]/20 px-4 py-6 text-white shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-2 mb-6">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left py-2.5 px-3 rounded-sm text-xs font-semibold tracking-[0.1em] uppercase flex items-center justify-between ${
                    isActive
                      ? 'bg-[#071120] text-[#C5A059] font-bold border-l-2 border-[#C5A059]'
                      : 'text-slate-300 hover:bg-[#071120]/60 hover:text-[#C5A059]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="text-xs text-[#C5A059]">•</span>}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#C5A059]/20 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.trackBookNowClick('mobile_menu_agoda');
                window.open(getAgodaUrl(), '_blank', 'noopener,noreferrer');
              }}
              className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs tracking-wider uppercase rounded-sm text-center flex items-center justify-center gap-2 shadow"
            >
              <ExternalLink className="w-4 h-4 text-[#0A192F]" />
              <span>Check Agoda Rates</span>
            </button>

            <a
              href={getWhatsAppUrl('general')}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.trackWhatsAppClick('mobile_menu');
              }}
              className="w-full py-2.5 bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 font-semibold text-xs tracking-wide rounded-sm text-center flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WHATSAPP US</span>
            </a>

            <a
              href={HOTEL_CONFIG.PHONE_TEL}
              onClick={() => {
                setMobileMenuOpen(false);
                analytics.trackPhoneClick('mobile_menu');
              }}
              className="w-full py-2.5 bg-[#071120] border border-slate-700 text-slate-200 font-medium text-xs tracking-wide rounded-sm text-center flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-[#C5A059]" />
              <span>CALL {HOTEL_CONFIG.PHONE_NUMBER}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
