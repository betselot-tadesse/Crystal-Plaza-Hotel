/**
 * Analytics tracking utilities
 * Prepared for Google Analytics 4 (gtag), Google Tag Manager, or custom data pipelines.
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  // Dispatch to window.gtag if available
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  // Dispatch to window.dataLayer for Google Tag Manager if available
  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...params,
      timestamp: new Date().toISOString()
    });
  }

  // Debug log in non-production environments
  if (typeof import.meta !== 'undefined' && (import.meta as any).env?.DEV) {
    console.debug(`[Analytics Event] ${eventName}:`, params);
  }
}

export const analytics = {
  trackEvent,

  trackPageView: (pageName: string, path: string) => {
    trackEvent('page_view', { page_title: pageName, page_location: path });
  },

  trackRoomView: (roomName: string, slug: string) => {
    trackEvent('view_item', { item_name: roomName, item_id: slug, item_category: 'hotel_room' });
  },

  trackBookNowClick: (source: string, roomName?: string) => {
    trackEvent('begin_checkout', { source, room_name: roomName || 'general' });
  },

  trackWhatsAppClick: (context: string, detail?: string) => {
    trackEvent('contact_whatsapp', { context, detail: detail || '' });
  },

  trackPhoneClick: (source: string) => {
    trackEvent('contact_phone', { source });
  },

  trackEnquirySubmit: (type: string, details?: Record<string, any>) => {
    trackEvent('generate_lead', { enquiry_type: type, ...details });
  },

  trackOfferClick: (offerTitle: string, category: string) => {
    trackEvent('select_promotion', { promotion_name: offerTitle, category });
  }
};
