import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

export function GoogleAnalytics() {
  const location = useLocation();

  useEffect(() => {
    // Small delay so page components can set document.title before we read it
    const timer = setTimeout(() => {
      trackPageView(location.pathname + location.search, document.title);
    }, 50);
    return () => clearTimeout(timer);
  }, [location]);

  return null;
}
