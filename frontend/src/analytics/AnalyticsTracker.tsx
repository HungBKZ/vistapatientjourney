import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA4_MEASUREMENT_ID;

const injectGaScript = () => {
  if (!measurementId) return;

  const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  const existing = document.querySelector(`script[src="${scriptSrc}"]`);
  if (existing) return;

  const script = document.createElement('script');
  script.async = true;
  script.src = scriptSrc;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, { send_page_view: false });
};

export default function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    injectGaScript();
  }, []);

  useEffect(() => {
    if (!measurementId || !window.gtag) return;

    const pagePath = `${location.pathname}${location.search}`;
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_location: `${window.location.origin}${pagePath}`,
      page_title: document.title,
      language: 'vi-VN',
    });
  }, [location.pathname, location.search]);

  return null;
}
