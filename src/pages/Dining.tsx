import React, { useState } from 'react';
import { diningConfig, sampleMenuCategories, diningGalleryImages } from '../data/diningData';
import { HOTEL_CONFIG, getWhatsAppUrl } from '../data/hotelConfig';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import { DiningCard } from '../components/dining/DiningCard';
import { Clock, Utensils, MessageCircle, Phone, CalendarCheck, BellRing } from 'lucide-react';
import { analytics } from '../utils/analytics';

interface DiningPageProps {
  onNavigate: (page: string, detail?: string) => void;
  onOpenDiningEnquiry: (mealType?: string) => void;
}

export const DiningPage: React.FC<DiningPageProps> = ({ onNavigate, onOpenDiningEnquiry }) => {
  const [activeMenuTab, setActiveMenuTab] = useState('breakfast');

  const currentCategory = sampleMenuCategories.find(c => c.id === activeMenuTab) || sampleMenuCategories[0];

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[{ label: 'Dining', active: true }]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Hero Section */}
      <div className="bg-slate-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://i.ibb.co/fz8CHH3x/Whats-App-Image-2026-09-04-at-5-06-41-PM.jpg"
            alt="Crystal Plaza Hotel Dining Restaurant"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-500/30">
            Restaurant & Culinary Service
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold tracking-tight">
            Dining at Crystal Plaza Hotel
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Enjoy delicious dining in a comfortable setting at Crystal Plaza Hotel.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href={HOTEL_CONFIG.ROOM_SERVICE_TEL}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <span>Room Service: {HOTEL_CONFIG.ROOM_SERVICE_DISPLAY}</span>
            </a>
            <button
              onClick={() => onOpenDiningEnquiry('Table Reservation')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              Table Reservation
            </button>
            <a
              href={getWhatsAppUrl('dining')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-slate-900 border border-slate-700 hover:border-slate-500 text-emerald-400 font-semibold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Dining Desk</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-20">
        {/* 1. RESTAURANT INTRODUCTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <SectionHeading
              badge="About Our Restaurant"
              title={diningConfig.restaurantName}
              subtitle="Fresh flavors, warm hospitality, and versatile dining for resident guests and visitors."
              centered={false}
            />

            <p className="text-sm text-slate-600 leading-relaxed">
              {diningConfig.description}
            </p>

            {/* Service Hours */}
            <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Service Hours</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="font-semibold text-slate-800">Breakfast Buffet:</span> {diningConfig.serviceHours.breakfast}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Lunch Dining:</span> {diningConfig.serviceHours.lunch}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Dinner Service:</span> {diningConfig.serviceHours.dinner}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">In-Room Dining:</span> {diningConfig.serviceHours.roomService}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {diningGalleryImages.map((img, idx) => (
              <div key={idx} className="rounded-xl overflow-hidden shadow-md aspect-[4/3] bg-slate-900 group">
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

        {/* 2. MENU SECTION */}
        <div>
          <SectionHeading
            badge="Culinary Selections"
            title="Explore Our Menu"
            subtitle="Browse sample offerings from our breakfast counter, Middle Eastern grills, and continental specialties."
          />

          {/* Menu Category Switcher */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
            {sampleMenuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveMenuTab(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
                  activeMenuTab === cat.id
                    ? 'bg-slate-900 text-amber-400 shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Active Menu Items */}
          <div className="max-w-4xl mx-auto">
            <DiningCard
              title={currentCategory.title}
              items={currentCategory.items}
            />
          </div>

          <div className="text-center mt-8">
            <p className="text-xs text-slate-500 mb-4">
              * Special dietary requirements, vegetarian requests, or group banquet catering menus can be coordinated with our kitchen.
            </p>
            <button
              onClick={() => onOpenDiningEnquiry(currentCategory.title)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors"
            >
              <Utensils className="w-4 h-4" />
              <span>ENQUIRE FOR TABLE OR CATERING</span>
            </button>
          </div>
        </div>

        {/* 3. IN-ROOM DINING & ROOM SERVICE */}
        <div className="bg-gradient-to-br from-slate-900 via-[#0A192F] to-slate-900 text-white rounded-2xl p-8 sm:p-12 border border-[#C5A059]/30 shadow-xl">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-semibold tracking-wider uppercase border border-[#C5A059]/30">
                <BellRing className="w-3.5 h-3.5" />
                <span>In-Room Dining Hotline</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white">
                Craving Delicious Food in Your Room?
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Enjoy hot breakfast favorites, fresh snacks, comforting Middle Eastern specialties, and refreshing drinks delivered straight to your door. Call or WhatsApp our kitchen directly.
              </p>
              <div className="flex items-center gap-3 text-sm text-amber-300 font-semibold pt-1">
                <Clock className="w-4 h-4 text-[#C5A059]" />
                <span>Room Service Hotline: <strong className="text-white text-base tracking-wide font-mono">{HOTEL_CONFIG.ROOM_SERVICE_DISPLAY}</strong></span>
              </div>
            </div>

            <div className="md:col-span-4 flex flex-col gap-3">
              <a
                href={HOTEL_CONFIG.ROOM_SERVICE_TEL}
                className="w-full px-6 py-3.5 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs uppercase tracking-widest rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {HOTEL_CONFIG.ROOM_SERVICE_DISPLAY}</span>
              </a>

              <a
                href={getWhatsAppUrl('dining')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-widest rounded-lg shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Order</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4. RESERVATION & CONTACT CTA */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-6 shadow-sm">
          <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900">
            Reserve a Table or Inquire for Dining & Catering
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Planning a family lunch, private gathering, or wish to order in-room dining? Get in touch directly with our restaurant team.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onOpenDiningEnquiry('General Dining Reservation')}
              className="px-7 py-3 bg-[#0A192F] hover:bg-[#152a4a] text-[#C5A059] font-bold text-xs uppercase tracking-wider rounded-lg shadow cursor-pointer transition-colors"
            >
              ENQUIRE FOR TABLE
            </button>

            <a
              href={HOTEL_CONFIG.ROOM_SERVICE_TEL}
              className="px-6 py-3 bg-amber-500/10 border border-amber-500/40 text-amber-800 hover:bg-amber-500/20 font-bold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Room Service: {HOTEL_CONFIG.ROOM_SERVICE_DISPLAY}</span>
            </a>

            <a
              href={getWhatsAppUrl('dining')}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Dining Desk</span>
            </a>

            <a
              href={HOTEL_CONFIG.PHONE_TEL}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-medium text-xs uppercase tracking-wider rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Phone className="w-4 h-4 text-slate-500" />
              <span>Reception ({HOTEL_CONFIG.PHONE_NUMBER})</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
