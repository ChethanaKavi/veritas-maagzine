import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change, using whatever document.title is set at that point
    trackPageView(location.pathname + location.search, document.title);
  }, [location]);

  return null;
}
