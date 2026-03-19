// Google Analytics utility functions

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = "G-JDT8YSE3TM";

// Track page views — fires a GA4 page_view event with path + title
export const trackPageView = (url: string, title?: string) => {
  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_title: title || document.title,
      page_path: url,
      page_location: window.location.href,
    });
  }
};

// Track arbitrary events
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  if (window.gtag) {
    window.gtag("event", eventName, eventParams);
  }
};

// Convenience helpers
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
