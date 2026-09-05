import React from 'react';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { HOTEL_CONFIG } from '../data/hotelConfig';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export const TermsAndConditionsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-16">
      <Breadcrumbs
        items={[{ label: 'Terms & Conditions', active: true }]}
        onHomeClick={() => onNavigate('home')}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-sm leading-relaxed">
          <div className="border-b border-slate-200 pb-4">
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-slate-900">
              Terms & Conditions
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Crystal Plaza Hotel • Al Qasimia, Sharjah, United Arab Emirates
            </p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">1. Website Usage & Reservations</h2>
            <p>
              By accessing and using this website, you agree to comply with these terms. Online booking submissions, enquiry forms, and quote requests are processed as booking inquiries. Final confirmation is subject to room and venue availability confirmed directly by Crystal Plaza Hotel front desk or reservations department.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">2. Check-In & Check-Out Policies</h2>
            <p>
              Standard hotel operational timings are as follows:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li><strong>Check-in Time:</strong> From {HOTEL_CONFIG.CHECK_IN_TIME} onwards. Early check-in is subject to availability upon arrival.</li>
              <li><strong>Check-out Time:</strong> Until {HOTEL_CONFIG.CHECK_OUT_TIME}. Late check-out requests should be communicated with the front desk in advance.</li>
              <li><strong>Guest Identification:</strong> Valid government-issued photo identification (UAE Emirates ID or original passport with valid visa) is required for all staying guests upon check-in as mandated by UAE authorities.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">3. Pricing & Payment Information</h2>
            <p>
              Rates displayed on the website or provided via telephone and WhatsApp are in United Arab Emirates Dirhams (AED) unless explicitly stated otherwise. All rates are subject to applicable taxes, tourism fees, and local regulations.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">4. Cancellations & Modifications</h2>
            <p>
              Cancellation and modification terms vary depending on the specific room rate, promotional offer, or banquet agreement booked. Specific cancellation policies will be communicated during your reservation confirmation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 font-serif-luxury">5. Contact & Inquiries</h2>
            <p>
              For further clarification on our booking terms or guest policies, please contact our management team:
            </p>
            <div className="p-4 bg-slate-50 rounded-lg text-xs space-y-1 border border-slate-200">
              <p className="font-bold text-slate-900">Crystal Plaza Hotel</p>
              <p>Al Qasimia, Sharjah, United Arab Emirates</p>
              <p>Telephone: {HOTEL_CONFIG.PHONE_NUMBER}</p>
              <p>Email: {HOTEL_CONFIG.EMAIL_ADDRESS}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
