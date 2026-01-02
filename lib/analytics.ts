// Analytics tracking utility
// This file provides a centralized way to track user interactions

export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  // Google Analytics 4 event tracking
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventData);
  }

  // Facebook Pixel tracking
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, eventData);
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

