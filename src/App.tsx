import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { MobileStickyCTA } from './components/layout/MobileStickyCTA';
import { EnquiryModal } from './components/forms/EnquiryModal';
import { getAgodaUrl } from './data/hotelConfig';
import { analytics } from './utils/analytics';

// Pages
import { HomePage } from './pages/Home';
import { RoomsPage } from './pages/Rooms';
import { RoomDetailsPage } from './pages/RoomDetails';
import { DiningPage } from './pages/Dining';
import { EventsPage } from './pages/Events';
import { AboutUsPage } from './pages/AboutUs';
import { ContactPage } from './pages/Contact';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy';
import { TermsAndConditionsPage } from './pages/TermsAndConditions';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') return 'admin';
      const path = window.location.pathname.replace('/', '');
      if (path === 'admin') return 'admin';
    }
    return 'home';
  });
  const [pageParam, setPageParam] = useState<string>('');

  // Synchronize hash for direct URL access to #admin
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setCurrentPage('admin');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Enquiry Modal State (for Events & Dining only)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<'ROOM' | 'EVENT' | 'DINING' | 'GENERAL'>('EVENT');
  const [modalInitialData, setModalInitialData] = useState<{
    roomType?: string;
    eventType?: string;
    diningDate?: string;
  }>({});

  // Navigation Handler with scroll to top
  const handleNavigate = (page: string, param?: string) => {
    setCurrentPage(page);
    if (param) {
      setPageParam(param);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check room availability directly on Agoda with no database needed
  const handleOpenBooking = (roomSlugOrName?: string) => {
    analytics.trackBookNowClick('app_booking_action', roomSlugOrName);
    const agodaUrl = getAgodaUrl();
    window.open(agodaUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenEventEnquiry = (venueOrEventName?: string) => {
    setModalType('EVENT');
    setModalInitialData({ eventType: venueOrEventName });
    setIsModalOpen(true);
  };

  const handleOpenDiningEnquiry = (mealTypeOrSpecial?: string) => {
    setModalType('DINING');
    setModalInitialData({ eventType: mealTypeOrSpecial });
    setIsModalOpen(true);
  };

  // Announcement Banner
  const [announcement] = useState(() => {
    return localStorage.getItem('crystal_announcement') || '';
  });
  const [isAnnouncementActive] = useState(() => {
    return localStorage.getItem('crystal_announcement_active') === 'true';
  });

  // If on Admin Dashboard, render full-screen dashboard without public layout
  if (currentPage === 'admin') {
    return <AdminDashboard onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-slate-900 font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Optional Top Announcement Bar */}
      {isAnnouncementActive && announcement && (
        <div className="bg-[#C5A059] text-slate-950 px-4 py-2 text-xs font-semibold text-center tracking-wide flex items-center justify-center gap-2">
          <span>🔔</span>
          <span>{announcement}</span>
        </div>
      )}

      {/* Global Header */}
      <Header
        activePage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Page Routing */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
            onOpenEventEnquiry={handleOpenEventEnquiry}
          />
        )}

        {currentPage === 'rooms' && (
          <RoomsPage
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === 'room-details' && (
          <RoomDetailsPage
            roomSlug={pageParam}
            onNavigate={handleNavigate}
            onOpenBooking={handleOpenBooking}
          />
        )}

        {currentPage === 'dining' && (
          <DiningPage
            onNavigate={handleNavigate}
            onOpenDiningEnquiry={handleOpenDiningEnquiry}
          />
        )}

        {currentPage === 'events' && (
          <EventsPage
            onNavigate={handleNavigate}
            onOpenEventEnquiry={handleOpenEventEnquiry}
          />
        )}

        {currentPage === 'about' && (
          <AboutUsPage
            onNavigate={handleNavigate}
            onOpenBooking={() => handleOpenBooking()}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPolicyPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'terms' && (
          <TermsAndConditionsPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating WhatsApp Contact Widget */}
      <FloatingWhatsApp
        context={currentPage === 'room-details' ? 'room' : currentPage === 'events' ? 'event' : 'general'}
        contextDetail={currentPage === 'room-details' ? pageParam : undefined}
      />

      {/* Mobile Sticky CTA Bar (Shown on mobile devices) */}
      <MobileStickyCTA
        onOpenBooking={() => handleOpenBooking()}
        context={currentPage === 'room-details' ? 'room' : currentPage === 'events' ? 'event' : 'general'}
        contextDetail={currentPage === 'room-details' ? pageParam : undefined}
      />

      {/* Unified Enquiry Modal */}
      <EnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultType={modalType}
        initialData={modalInitialData}
      />
    </div>
  );
}
