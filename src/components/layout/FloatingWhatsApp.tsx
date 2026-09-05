import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { HOTEL_CONFIG, getWhatsAppUrl } from '../../data/hotelConfig';
import { analytics } from '../../utils/analytics';

interface FloatingWhatsAppProps {
  context?: 'general' | 'room' | 'event' | 'dining';
  contextDetail?: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  context = 'general',
  contextDetail
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getHelpText = () => {
    switch (context) {
      case 'room':
        return contextDetail ? `Questions about ${contextDetail}? Chat with us!` : 'Need room rates or help? Chat with us!';
      case 'event':
        return 'Planning an event or banquet? Chat directly on WhatsApp.';
      case 'dining':
        return 'Table reservation or dining questions? Chat with our team.';
      default:
        return 'Hello! Have a question about Crystal Plaza Hotel?';
    }
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end">
      {/* Contextual Message Bubble (appears subtly on hover or initial hint) */}
      {showTooltip && (
        <div className="mb-2 max-w-xs bg-[#0A192F] text-white text-xs p-3.5 rounded-sm shadow-xl border border-[#C5A059]/30 relative animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 text-gray-400 hover:text-white p-0.5 cursor-pointer"
            aria-label="Dismiss message"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-semibold text-[#C5A059] text-[11px] uppercase tracking-wider mb-0.5">Crystal Plaza Reception</p>
          <p className="text-gray-300 leading-relaxed pr-3">{getHelpText()}</p>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={getWhatsAppUrl(context, contextDetail)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => analytics.trackWhatsAppClick('floating_button', contextDetail)}
        onMouseEnter={() => setShowTooltip(true)}
        className="group relative flex items-center justify-center w-13 h-13 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl hover:shadow-emerald-600/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label="Chat with Crystal Plaza Hotel on WhatsApp"
      >
        <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-[#C5A059] rounded-full border-2 border-[#0A192F] animate-pulse"></span>
        <MessageCircle className="w-7 h-7" />
        
        {/* Label on desktop hover */}
        <span className="hidden sm:group-hover:inline-block absolute right-16 bg-[#0A192F] text-[#C5A059] text-xs font-semibold uppercase tracking-wider py-1.5 px-3 rounded-sm whitespace-nowrap shadow-md border border-[#C5A059]/30">
          WhatsApp Us
        </span>
      </a>
    </div>
  );
};
