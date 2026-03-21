import { useEffect } from 'react';

type SeoConfig = {
  title: string;
  description: string;
  path: string;
  image?: string;
  robots?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
};

const SITE_URL = 'https://vistapatientjourney.vn';

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!element) {
    element = document.createElement('meta');
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', href);
};

const upsertJsonLd = (schema: SeoConfig['schema']) => {
  const scriptId = 'route-jsonld-schema';
  let script = document.getElementById(scriptId) as HTMLScriptElement | null;

  if (!schema) {
    if (script) {
      script.remove();
    }
    return;
  }

  if (!script) {
    script = document.createElement('script');
    script.id = scriptId;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
};

const upsertGoogleVerification = () => {
  const token = import.meta.env.VITE_GSC_VERIFICATION_TOKEN;
  if (!token) return;

  upsertMeta('meta[name="google-site-verification"]', {
    name: 'google-site-verification',
    content: token,
  });
};

export const useSeo = ({ title, description, path, image, robots, schema }: SeoConfig) => {
  useEffect(() => {
    const canonicalUrl = `${SITE_URL}${path}`;
    const socialImage = image || `${SITE_URL}/vite.svg`;

    document.title = title;
    document.documentElement.setAttribute('lang', 'vi');

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: description,
    });

    upsertMeta('meta[name="robots"]', {
      name: 'robots',
      content: robots || 'index,follow',
    });

    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: description,
    });
    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: 'website',
    });
    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    });
    upsertMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: socialImage,
    });

    upsertMeta('meta[name="twitter:card"]', {
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: 'twitter:image',
      content: socialImage,
    });

    upsertCanonical(canonicalUrl);
    upsertJsonLd(schema);
    upsertGoogleVerification();
  }, [description, image, path, robots, schema, title]);
};
