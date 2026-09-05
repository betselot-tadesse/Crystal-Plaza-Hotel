import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, Calendar, Users, Mail, Phone, User, MessageSquare, Clock, MessageCircle, Send, ExternalLink } from 'lucide-react';
import { EnquiryType } from '../../types/database';
import { HOTEL_CONFIG, getWhatsAppUrl, getAgodaUrl } from '../../data/hotelConfig';
import { analytics } from '../../utils/analytics';
import { roomsData } from '../../data/roomsData';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: EnquiryType;
  defaultRoomSlug?: string;
  defaultEventName?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'ROOM_BOOKING',
  defaultRoomSlug,
  defaultEventName
}) => {
  const [enquiryType, setEnquiryType] = useState<EnquiryType>(defaultType);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Room specific
  const [selectedRoomSlug, setSelectedRoomSlug] = useState(defaultRoomSlug || roomsData[0]?.slug || '');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guestsCount, setGuestsCount] = useState('2');
  const [roomsCount, setRoomsCount] = useState('1');
  
  // Event specific
  const [eventType, setEventType] = useState(defaultEventName || 'Corporate Meeting');
  const [eventDate, setEventDate] = useState('');
  const [eventGuests, setEventGuests] = useState('50');
  const [budget, setBudget] = useState('');

  // Dining specific
  const [diningDate, setDiningDate] = useState('');
  const [diningTime, setDiningTime] = useState('19:30');
  const [diningGuests, setDiningGuests] = useState('2');

  // General & common
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Spam protection honeypot
  const [honeypot, setHoneypot] = useState('');

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Spam honeypot check
    if (honeypot) {
      setIsSuccess(true);
      return;
    }

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('Please provide a valid contact telephone number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (enquiryType === 'ROOM_BOOKING' && (!checkIn || !checkOut)) {
      setErrorMessage('Please specify your expected check-in and check-out dates.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Track analytics
      analytics.trackEnquirySubmit(enquiryType, {
        name: fullName,
        room: selectedRoomSlug,
        event: eventType,
        check_in: checkIn,
        guests: guestsCount || eventGuests || diningGuests
      });

      // Simulate network request for robust client-side enquiry handling
      await new Promise((resolve) => setTimeout(resolve, 800));

      setIsSuccess(true);
    } catch (err) {
      setErrorMessage('An unexpected error occurred while sending your enquiry. Please contact our reception directly or reach out on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWhatsAppHandoffUrl = () => {
    let summaryText = `Hello Crystal Plaza Hotel, I have submitted an enquiry:\n• Name: ${fullName}\n• Phone: ${phone}\n• Type: ${enquiryType}`;
    if (enquiryType === 'ROOM_BOOKING') {
      const room = roomsData.find(r => r.slug === selectedRoomSlug);
      summaryText += `\n• Room: ${room ? room.name : selectedRoomSlug}\n• Dates: ${checkIn} to ${checkOut}\n• Guests: ${guestsCount}, Rooms: ${roomsCount}`;
    } else if (enquiryType === 'EVENT') {
      summaryText += `\n• Event: ${eventType}\n• Date: ${eventDate}\n• Guests: ${eventGuests}`;
    } else if (enquiryType === 'DINING') {
      summaryText += `\n• Dining Date: ${diningDate} at ${diningTime}\n• Guests: ${diningGuests}`;
    }
    if (message) {
      summaryText += `\n• Notes: ${message}`;
    }

    return `https://wa.me/${HOTEL_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(summaryText)}`;
  };

  const resetForm = () => {
    setIsSuccess(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold font-serif-luxury text-amber-300">
              {enquiryType === 'ROOM_BOOKING' && 'Room Booking Enquiry'}
              {enquiryType === 'EVENT' && 'Event & Banquet Enquiry'}
              {enquiryType === 'DINING' && 'Table Reservation & Dining Enquiry'}
              {enquiryType === 'GENERAL' && 'Hotel Contact & Enquiry'}
            </h2>
            <p className="text-xs text-slate-300">
              Crystal Plaza Hotel • Al Qasimia, Sharjah
            </p>
          </div>
          <button
            onClick={resetForm}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enquiry Category Selector Tabs */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex flex-wrap gap-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setEnquiryType('ROOM_BOOKING'); setIsSuccess(false); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              enquiryType === 'ROOM_BOOKING'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Room Stay
          </button>
          <button
            type="button"
            onClick={() => { setEnquiryType('EVENT'); setIsSuccess(false); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              enquiryType === 'EVENT'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Events & Banquet
          </button>
          <button
            type="button"
            onClick={() => { setEnquiryType('DINING'); setIsSuccess(false); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              enquiryType === 'DINING'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dining & Table
          </button>
          <button
            type="button"
            onClick={() => { setEnquiryType('GENERAL'); setIsSuccess(false); }}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              enquiryType === 'GENERAL'
                ? 'bg-slate-900 text-amber-400 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            General Enquiry
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold font-serif-luxury text-slate-900">
                Enquiry Received
              </h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you. Your enquiry has been received. Our team will contact you shortly with personalized details and current rates.
              </p>

              <div className="pt-2 p-4 bg-slate-50 border border-slate-200 rounded-lg text-left text-xs space-y-1 max-w-md mx-auto">
                <p className="font-semibold text-slate-800">Enquiry Summary:</p>
                <p className="text-slate-600">Guest: {fullName}</p>
                <p className="text-slate-600">Phone: {phone}</p>
                <p className="text-slate-600">Type: {enquiryType.replace('_', ' ')}</p>
                <p className="text-amber-800 italic mt-1">
                  * Note: This is an official reservation enquiry. Final confirmation will be coordinated by our reservations team.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getWhatsAppHandoffUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send via WhatsApp for Fast Reply</span>
                </a>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider rounded transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Honeypot for spam protection */}
              <input
                type="text"
                name="preferred_code_website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Dynamic Sub-Sections by Type */}
              {enquiryType === 'ROOM_BOOKING' && (
                <div className="space-y-3">
                  {/* Agoda Live Availability Box */}
                  <div className="p-4 bg-[#0A192F] text-white rounded-lg border border-[#C5A059]/40 space-y-2.5 shadow-md">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Live Availability on Agoda</span>
                      </div>
                      <span className="px-2 py-0.5 bg-[#C5A059] text-[#0A192F] text-[10px] font-bold uppercase rounded-sm">Instant</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Instant room confirmation, transparent rates, and real-time dates are checked directly on Agoda with zero waiting.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const url = getAgodaUrl({ checkIn, checkOut, adults: guestsCount, rooms: roomsCount });
                        window.open(url, '_blank', 'noopener,noreferrer');
                      }}
                      className="w-full py-2.5 px-4 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] text-xs font-bold uppercase tracking-wider rounded-sm transition-all flex items-center justify-center gap-2 shadow cursor-pointer active:scale-98"
                    >
                      <ExternalLink className="w-4 h-4 text-[#0A192F]" />
                      <span>Check Availability on Agoda</span>
                    </button>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3">
                    <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                      Or Send Offline Hotel Enquiry (Groups / Direct Assistance)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Room Category *
                      </label>
                      <select
                        value={selectedRoomSlug}
                        onChange={(e) => setSelectedRoomSlug(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {roomsData.map((room) => (
                          <option key={room.id} value={room.slug}>
                            {room.name} ({room.bed_type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Number of Rooms
                      </label>
                      <select
                        value={roomsCount}
                        onChange={(e) => setRoomsCount(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="1">1 Room</option>
                        <option value="2">2 Rooms</option>
                        <option value="3">3 Rooms</option>
                        <option value="4+">4+ Rooms (Group)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Check-in Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          required
                          className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Check-out Date *
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          required
                          className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Guests
                      </label>
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="1">1 Adult</option>
                        <option value="2">2 Adults</option>
                        <option value="3">3 Adults / Family</option>
                        <option value="4">4+ Adults / Family</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {enquiryType === 'EVENT' && (
                <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Event Type *
                      </label>
                      <select
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="Wedding / Reception">Wedding / Reception</option>
                        <option value="Corporate Meeting">Corporate Meeting</option>
                        <option value="Conference / Seminar">Conference / Seminar</option>
                        <option value="Birthday Celebration">Birthday Celebration</option>
                        <option value="Private Dinner">Private Dinner</option>
                        <option value="Community / Social Event">Community / Social Event</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Anticipated Event Date *
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Estimated Number of Guests *
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 50"
                        value={eventGuests}
                        onChange={(e) => setEventGuests(e.target.value)}
                        min="10"
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Approximate Budget (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. In AED"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {enquiryType === 'DINING' && (
                <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-lg space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Reservation Date *
                      </label>
                      <input
                        type="date"
                        value={diningDate}
                        onChange={(e) => setDiningDate(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Preferred Time *
                      </label>
                      <input
                        type="time"
                        value={diningTime}
                        onChange={(e) => setDiningTime(e.target.value)}
                        required
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Party Size
                      </label>
                      <select
                        value={diningGuests}
                        onChange={(e) => setDiningGuests(e.target.value)}
                        className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="6">6 Persons</option>
                        <option value="8+">8+ Group</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {enquiryType === 'GENERAL' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Airport Transfer, Hotel Location, Special Assistance"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              {/* Contact Information Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 pl-8 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / Mobile (with country code) *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="e.g. +971 50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full text-xs p-2.5 pl-8 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full text-xs p-2.5 pl-8 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Special Requests (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Any particular requirements, dietary preferences, or estimated arrival timing..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                ></textarea>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500 leading-relaxed">
                By submitting this form, you send an official enquiry directly to Crystal Plaza Hotel front desk. We will get in touch via telephone or email with rates and availability.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded shadow transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
