/**
 * Google Analytics 4 service wrapper
 * Provides type-safe functions for tracking page views and custom events
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

let isInitialized = false;
let isEnabled = true;

/**
 * Initialize Google Analytics if not already initialized
 */
export function initializeAnalytics(measurementId: string): void {
  if (isInitialized || !measurementId) {
    return;
  }

  // Check if gtag is already loaded
  if (typeof window.gtag === 'function') {
    isInitialized = true;
    return;
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  
  // Define gtag function
  function gtag(...args: any[]): void {
    window.dataLayer.push(args);
  }
  window.gtag = gtag;

  // Load GA4 script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Configure GA4
  gtag('js', new Date());
  gtag('config', measurementId, {
    send_page_view: false // We'll track page views manually
  });

  isInitialized = true;
}

/**
 * Check if analytics is enabled and initialized
 */
export function isAnalyticsEnabled(): boolean {
  return isEnabled && isInitialized && typeof window.gtag === 'function';
}

/**
 * Enable or disable analytics tracking
 */
export function setAnalyticsEnabled(enabled: boolean): void {
  isEnabled = enabled;
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string): void {
  if (!isAnalyticsEnabled()) {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title
  });
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, parameters?: Record<string, any>): void {
  if (!isAnalyticsEnabled()) {
    return;
  }

  window.gtag('event', eventName, parameters || {});
}

/**
 * Set a user property
 */
export function setUserProperty(name: string, value: string): void {
  if (!isAnalyticsEnabled()) {
    return;
  }

  window.gtag('set', 'user_properties', {
    [name]: value
  });
}

/**
 * Set user ID (anonymized)
 */
export function setUserId(userId: string | null): void {
  if (!isAnalyticsEnabled()) {
    return;
  }

  if (userId) {
    // Anonymize user ID - use a hash or just the first part
    const anonymizedId = userId.substring(0, 8) + '...';
    window.gtag('set', 'user_id', anonymizedId);
  } else {
    window.gtag('set', 'user_id', null);
  }
}

