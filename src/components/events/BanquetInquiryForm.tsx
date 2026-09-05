import React, { useState } from 'react';
import { HOTEL_CONFIG, getWhatsAppUrl } from '../../data/hotelConfig';
import { analytics } from '../../utils/analytics';
import { createInquiry } from '../../services/inquiryService';
import { 
  Users, 
  Phone, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle, 
  User, 
  Sparkles, 
  Send 
} from 'lucide-react';

interface BanquetInquiryFormProps {
  initialEventType?: string;
  source?: string;
  className?: string;
}

export const BanquetInquiryForm: React.FC<BanquetInquiryFormProps> = ({
  source = 'homepage',
  className = ''
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setFormError('Please provide your contact phone number.');
      return;
    }
    if (!message.trim()) {
      setFormError('Please enter your message or event details.');
      return;
    }

    setIsSubmitting(true);

    const waText = `Hello Crystal Plaza Hotel, I would like to enquire about the Banquet Hall & Dining.\n• Name: ${fullName.trim()}\n• Phone: ${phone.trim()}\n• Details: ${message.trim()}`;
    const waUrl = `https://api.whatsapp.com/send?phone=${HOTEL_CONFIG.EVENTS_DINING_WHATSAPP}&text=${encodeURIComponent(waText)}`;

    // Directly send the message to WhatsApp
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('WhatsApp window open warning:', err);
    }

    try {
      analytics.trackEnquirySubmit('BANQUET_INQUIRY', {
        name: fullName,
        phone,
        message,
        source
      });

      await createInquiry({
        fullName,
        phone,
        message,
        targetDepartment: 'Banquets & Dining',
        source: source || 'banquet_form'
      });

      setIsSubmitted(true);
    } catch (err) {
      // Even if background DB logging faces issues, WhatsApp was launched
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppEnquiryText = () => {
    return `Hello Crystal Plaza Hotel, I would like to enquire about the Banquet Hall & Dining.\n• Name: ${fullName.trim()}\n• Phone: ${phone.trim()}\n• Details: ${message.trim()}`;
  };

  return (
    <div id="banquet-inquiry-form" className={`scroll-mt-24 ${className}`}>
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#0A192F] p-6 sm:p-8 text-white border-b border-[#C5A059]/30">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C5A059]/20 text-[#C5A059] text-xs font-semibold tracking-wider uppercase border border-[#C5A059]/40">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Banquet Hall & Dining Inquiry</span>
            </div>
            
            {/* Quick capacity pill */}
            <div className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/10">
              <Users className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Capacity: Up to 150 Guests • 50 Classrooms</span>
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-white">
            Banquet Hall & Event Inquiry
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
            Leave your name, phone number, and requirements. Our banquet manager will call or WhatsApp you directly.
          </p>

          {/* Direct Hotlines */}
          <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
            <span className="text-slate-400 font-medium">Direct Inquiries:</span>
            <a
              href={HOTEL_CONFIG.EVENTS_DINING_TEL}
              className="inline-flex items-center gap-1.5 text-white hover:text-[#C5A059] font-semibold transition-colors bg-white/5 px-3 py-1 rounded border border-white/10"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Call: {HOTEL_CONFIG.EVENTS_DINING_DISPLAY}</span>
            </a>
            <a
              href={getWhatsAppUrl('event')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors bg-emerald-950/40 px-3 py-1 rounded border border-emerald-500/30"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp: {HOTEL_CONFIG.EVENTS_DINING_DISPLAY}</span>
            </a>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {isSubmitted ? (
            <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h4 className="text-xl font-bold font-serif-luxury text-slate-900">
                Thank You! Your Inquiry Has Been Received.
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Your inquiry has been sent directly to WhatsApp ({HOTEL_CONFIG.EVENTS_DINING_DISPLAY}). Our banquet coordinator will assist you right away.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://api.whatsapp.com/send?phone=${HOTEL_CONFIG.EVENTS_DINING_WHATSAPP}&text=${encodeURIComponent(getWhatsAppEnquiryText())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open WhatsApp Again ({HOTEL_CONFIG.EVENTS_DINING_DISPLAY})</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setFullName('');
                    setPhone('');
                    setMessage('');
                  }}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                >
                  Submit Another Inquiry
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
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full text-xs p-3 pl-9 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Contact Phone (Calls & WhatsApp) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="e.g. 056 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full text-xs p-3 pl-9 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your event, preferred date, expected guests, or any special requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
                ></textarea>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-slate-500">
                  Quick Inquiry • Direct contact via Phone & WhatsApp ({HOTEL_CONFIG.EVENTS_DINING_DISPLAY})
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] font-bold text-xs uppercase tracking-widest rounded-lg transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
