// Analytics tracking utility
// This file provides a centralized way to track user interactions

// Standard Facebook Pixel events
const STANDARD_FB_EVENTS = [
  'PageView',
  'ViewContent',
  'Search',
  'AddToCart',
  'InitiateCheckout',
  'AddPaymentInfo',
  'Purchase',
  'Lead',
  'CompleteRegistration',
];

export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  // Google Analytics 4 event tracking
  if ((window as any).gtag) {
    try {
      (window as any).gtag('event', eventName, eventData);
    } catch (error) {
      console.warn('Google Analytics tracking error:', error);
    }
  }

  // Facebook Pixel tracking
  if ((window as any).fbq) {
    try {
      // Use trackCustom for non-standard events
      if (STANDARD_FB_EVENTS.includes(eventName)) {
        (window as any).fbq('track', eventName, eventData);
      } else {
        (window as any).fbq('trackCustom', eventName, eventData);
      }
    } catch (error) {
      console.warn('Facebook Pixel tracking error:', error);
    }
  }

  // Custom event tracking (for debugging)
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Event tracked:', eventName, eventData);
  }
};

// Specific tracking functions for common actions
export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent('cta_click', {
    cta_name: ctaName,
    location: location,
    timestamp: new Date().toISOString(),
  });
};

export const trackFormStart = (formType: string) => {
  trackEvent('form_start', {
    form_type: formType,
    timestamp: new Date().toISOString(),
  });
};

export const trackFormSubmit = (formType: string, success: boolean) => {
  trackEvent('form_submit', {
    form_type: formType,
    success: success,
    timestamp: new Date().toISOString(),
  });
};

export const trackPricingView = (planName: string) => {
  trackEvent('pricing_view', {
    plan_name: planName,
    timestamp: new Date().toISOString(),
  });
};

export const trackScrollDepth = (depth: number) => {
  trackEvent('scroll_depth', {
    depth: depth,
    timestamp: new Date().toISOString(),
  });
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_name: pageName,
    timestamp: new Date().toISOString(),
  });
};

