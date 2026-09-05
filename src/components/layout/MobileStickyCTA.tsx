import React from 'react';
import { Phone, MessageCircle, ExternalLink } from 'lucide-react';
import { HOTEL_CONFIG, getWhatsAppUrl, getAgodaUrl } from '../../data/hotelConfig';
import { analytics } from '../../utils/analytics';

interface MobileStickyCTAProps {
  onOpenBooking?: () => void;
  context?: 'general' | 'room' | 'event' | 'dining';
  contextDetail?: string;
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({
  onOpenBooking,
  context = 'general',
  contextDetail
}) => {
  const handleAgodaClick = () => {
    analytics.trackBookNowClick('sticky_mobile_bar');
    window.open(getAgodaUrl(), '_blank', 'noopener,noreferrer');
    if (onOpenBooking) {
      onOpenBooking();
    }
  };

  return (
    <aside
      aria-label="Quick contact and booking options"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#071120]/95 backdrop-blur-md border-t border-white/10 px-3 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.5)] safe-bottom"
    >
      <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
        {/* CALL */}
        <a
          href={HOTEL_CONFIG.PHONE_TEL}
          onClick={() => analytics.trackPhoneClick('sticky_mobile_bar')}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#0A192F] border border-white/10 text-gray-200 rounded-sm text-xs font-bold uppercase tracking-wider active:bg-[#152a4a] transition-colors"
        >
          <Phone className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
          <span>Call</span>
        </a>

        {/* WHATSAPP */}
        <a
          href={getWhatsAppUrl(context, contextDetail)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => analytics.trackWhatsAppClick('sticky_mobile_bar', contextDetail)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 rounded-sm text-xs font-bold uppercase tracking-wider active:bg-emerald-900/60 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* BOOK ON AGODA */}
        <button
          onClick={handleAgodaClick}
          className="flex items-center justify-center gap-1.5 py-2.5 px-2 bg-[#C5A059] hover:bg-[#B38E47] text-[#0A192F] rounded-sm text-xs font-bold uppercase tracking-wider active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#0A192F] flex-shrink-0" />
          <span>Agoda</span>
        </button>
      </div>
    </aside>
  );
};
