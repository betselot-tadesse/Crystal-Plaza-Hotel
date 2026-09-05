import React, { useState } from 'react';
import { HOTEL_CONFIG, getWhatsAppUrl } from '../data/hotelConfig';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import { SectionHeading } from '../components/ui/SectionHeading';
import { 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Instagram,
  Facebook,
  Linkedin
} from 'lucide-react';
import { analytics } from '../utils/analytics';

interface ContactPageProps {
  onNavigate: (page: string, detail?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Room Enquiry');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !phone.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      analytics.trackEnquirySubmit('CONTACT_FORM', {
        name: fullName,
        subject,
        phone,
        email
      });

      await new Promise((resolve) => setTimeout(resolve, 800));
      setIsSubmitted(true);
    } catch (err) {
      setFormError('Unable to send message at this time. Please contact our front desk by phone or WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <Breadcrumbs
        items={[{ label: 'Contact Us', active: true }]}
        onHomeClick={() => onNavigate('home')}
      />

      {/* Hero Section */}
      <div className="bg-slate-950 text-white py-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://i.ibb.co/jPTbsb33/Whats-App-Image-2026-09-04-at-5-14-38-PM.jpg"
            alt="Crystal Plaza Hotel Front Desk Reception"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-500/30">
            24/7 Front Desk & Assistance
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold tracking-tight">
            We're Here to Help
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Have a question or planning your stay? Get in touch with Crystal Plaza Hotel.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <SectionHeading
                badge="Reach Out"
                title="Get in Touch"
                subtitle="Our staff is available 24/7 to answer room reservations, banquet queries, and general questions."
                centered={false}
              />
            </div>

            {/* Contact Cards */}
            <div className="space-y-4">
              {/* Address */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Hotel Location</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {HOTEL_CONFIG.FULL_ADDRESS}
                  </p>
                  <a
                    href={HOTEL_CONFIG.GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[11px] font-bold text-amber-700 hover:text-amber-800 mt-2"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              {/* Rooms & Hotel Inquiry */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Rooms & Hotel Inquiry</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Room reservations, rates, & hotel information</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={HOTEL_CONFIG.PHONE_TEL}
                      onClick={() => analytics.trackPhoneClick('contact_page_rooms')}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-amber-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-700" />
                      <span>{HOTEL_CONFIG.PHONE_NUMBER}</span>
                    </a>
                    <a
                      href={getWhatsAppUrl('room')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analytics.trackWhatsAppClick('contact_page_rooms')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp {HOTEL_CONFIG.WHATSAPP_DISPLAY}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Banquet Hall & Dining Inquiry */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Banquet Hall & Dining Inquiry</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Events, weddings, corporate catering, & restaurant orders</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <a
                      href={HOTEL_CONFIG.EVENTS_DINING_TEL}
                      onClick={() => analytics.trackPhoneClick('contact_page_dining')}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-amber-700"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-700" />
                      <span>{HOTEL_CONFIG.EVENTS_DINING_DISPLAY}</span>
                    </a>
                    <a
                      href={getWhatsAppUrl('event')}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => analytics.trackWhatsAppClick('contact_page_dining')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp {HOTEL_CONFIG.EVENTS_DINING_DISPLAY}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Email Address</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Reservations & Business Enquiries</p>
                  <a
                    href={HOTEL_CONFIG.EMAIL_MAILTO}
                    className="inline-block text-xs font-bold text-slate-900 hover:text-amber-700 mt-1"
                  >
                    {HOTEL_CONFIG.EMAIL_ADDRESS}
                  </a>
                </div>
              </div>

              {/* Operational Hours */}
              <div className="bg-slate-900 text-white p-5 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-white">Front Desk Schedule</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Open 24 Hours / 7 Days a week for arrivals, key collection, and guest services.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">Connect With Us</h4>
              <div className="flex items-center gap-3">
                <a
                  href={HOTEL_CONFIG.SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-400 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={HOTEL_CONFIG.SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-400 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={HOTEL_CONFIG.SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-amber-600 hover:border-amber-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <div className="bg-slate-900 p-6 sm:p-8 text-white border-b border-slate-800">
              <h2 className="text-2xl font-serif-luxury font-bold text-white">
                Send Us a Message
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Fill in the form below and our team will respond to your enquiry as promptly as possible.
              </p>
            </div>

            <div className="p-6 sm:p-8">
              {isSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-bold font-serif-luxury text-slate-900">
                    Thank you. Your message has been received.
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Our team will review your message and reply via phone or email shortly.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="px-6 py-2.5 bg-slate-900 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-lg"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        placeholder="+971 50 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="yourname@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Enquiry Subject
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Room Reservation Enquiry">Room Reservation Enquiry</option>
                        <option value="Banquet / Event Hall Enquiry">Banquet / Event Hall Enquiry</option>
                        <option value="Restaurant / Dining Enquiry">Restaurant / Dining Enquiry</option>
                        <option value="Corporate / Long-Term Stay">Corporate / Long-Term Stay</option>
                        <option value="General Hotel Information">General Hotel Information</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Message / Specific Request *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please provide any details regarding dates, room requirements, or questions..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
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
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>SEND MESSAGE</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Embedded Interactive Map Container */}
        <div>
          <SectionHeading
            badge="Find Us"
            title="Location & Surroundings"
            subtitle="Crystal Plaza Hotel is located in Al Qasimia, Sharjah, United Arab Emirates."
          />
          <div className="h-[420px] rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-100">
            <iframe
              title="Crystal Plaza Hotel Sharjah Interactive Map"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(HOTEL_CONFIG.GOOGLE_MAPS_EMBED_QUERY)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};
