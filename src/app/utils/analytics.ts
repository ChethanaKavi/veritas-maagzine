// Google Analytics utility functions

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

// Initialize Google Analytics
export const initGA = (measurementId: string) => {
  // Create script element for GA
  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script1);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId);
};

const GA_MEASUREMENT_ID = 'G-JDT8YSE3TM';

// Track page views
export const trackPageView = (url: string) => {
  if (window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// Track custom events for magazine website
export const trackArticleView = (articleId: string, articleTitle: string) => {
  trackEvent("article_view", {
    article_id: articleId,
    article_title: articleTitle,
  });
};

export const trackMagazineView = (magazineId: string, magazineTitle: string) => {
  trackEvent("magazine_view", {
    magazine_id: magazineId,
    magazine_title: magazineTitle,
  });
};

export const trackSearch = (searchQuery: string, resultCount: number) => {
  trackEvent("search", {
    search_term: searchQuery,
    result_count: resultCount,
  });
};
