import React, { useState, useEffect } from 'react';
import { HOTEL_CONFIG } from '../../data/hotelConfig';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
  currentPage?: string;
  activePage?: string;
  onNavigate: (page: string, detail?: string) => void;
  onOpenBooking?: (roomType?: string) => void;
  isTransparentHero?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  activePage,
  onNavigate,
  isTransparentHero = false
}) => {
  const current = currentPage || activePage || 'home';
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
          ? 'bg-[#0A192F] text-white shadow-xl border-b border-[#C5A059]/20 py-3.5'
          : 'bg-gradient-to-b from-[#0A192F]/95 via-[#0A192F]/70 to-transparent text-white py-4 sm:py-5'
      }`}
    >
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo & Avatar */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-[#C5A059] rounded-sm cursor-pointer"
          aria-label="Crystal Plaza Hotel - Home"
        >
          <img
            src={HOTEL_CONFIG.LOGO_URL}
            alt="Crystal Plaza Hotel Logo"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#C5A059] shadow-md flex-shrink-0 group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
              <span className="text-[#C5A059]">Crystal</span> Plaza Hotel
            </span>
            <span className="text-[10px] tracking-[0.25em] text-slate-300 uppercase font-light">
              Al Qasimia • Sharjah
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold tracking-[0.1em] uppercase">
          {navLinks.map((link) => {
            const isActive = current === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-1 transition-colors uppercase cursor-pointer ${
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

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-200 hover:text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059] cursor-pointer"
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
        <div className="lg:hidden bg-[#0A192F] border-b border-[#C5A059]/20 px-4 py-5 text-white shadow-2xl animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = current === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left py-3 px-3 rounded-sm text-xs font-semibold tracking-[0.1em] uppercase flex items-center justify-between cursor-pointer ${
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
        </div>
      )}
    </header>
  );
};
