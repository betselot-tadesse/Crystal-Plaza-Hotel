import React from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { HOTEL_CONFIG } from '../data/hotelConfig';

interface PrivacyPolicyPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-16">
      <Breadcrumbs
        items={[{ label: 'Privacy Policy', active: true }]}
        onHomeClick={() => onNavigate('home')}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Crystal Plaza Hotel • Al Qasimia, Sharjah, United Arab Emirates
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">1. Introduction</h2>
            <p>
              Crystal Plaza Hotel ("we," "our," or "the hotel") is committed to respecting and protecting the privacy of our website visitors and guests. This Privacy Policy explains how information collected through booking enquiries, contact forms, or communication channels is handled.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">2. Information We Collect</h2>
            <p>
              When you submit a room enquiry, event quote request, dining reservation, or contact form on our website, we may collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Your full name and contact title</li>
              <li>Contact telephone number and WhatsApp contact</li>
              <li>Email address</li>
              <li>Proposed check-in / check-out dates or event dates</li>
              <li>Room or hall preferences, number of guests, and special requests</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">3. How Your Information Is Used</h2>
            <p>
              The information provided by visitors is used exclusively for legitimate hospitality operations:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Processing and confirming your room reservations and banquet inquiries</li>
              <li>Contacting you by telephone, email, or WhatsApp regarding your requested quotes</li>
              <li>Answering customer service inquiries regarding hotel amenities and location</li>
              <li>Complying with applicable UAE hotel registration regulations upon guest arrival</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">4. Data Sharing & Third Parties</h2>
            <p>
              We do not sell, rent, or trade your personal information to third-party marketing companies. Data is only handled by authorized hotel staff and secure technical service providers assisting in website maintenance and communication delivery.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">5. Contact Information</h2>
            <p>
              If you have questions regarding this Privacy Policy or wish to review information submitted through our website, please reach out to:
            </p>
            <div className="p-4 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-200">
              <p className="font-bold text-slate-900">Crystal Plaza Hotel</p>
              <p>Al Qasimia, Sharjah, United Arab Emirates</p>
              <p>Email: {HOTEL_CONFIG.EMAIL_ADDRESS}</p>
              <p>Phone: {HOTEL_CONFIG.PHONE_NUMBER}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
