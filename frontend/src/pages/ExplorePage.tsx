import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

/*
  ════════════════════════════════════════════════════════════
  EXPLORE PAGE — Bento Grid Redesign (taste-skill:high-end-visual-design)
  Cải tiến:
  1. Asymmetric Bento Grid layout (2-1 split + full-width Video row)
  2. Double-Bezel nested card architecture (outer shell + inner core)
  3. Plus Jakarta Sans typography với trọng số tối ưu
  4. Minimalist SVG icons cho Quiz, Podcast, Video
  5. High-end hover: card lift, image zoom, accent border glow
  ════════════════════════════════════════════════════════════
*/

const FONT_LINK = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400&display=swap');
`;

/* ─── Accent palette ─── */
type AccentKey = 'violet' | 'sky' | 'emerald';

const accentMap: Record<AccentKey, {
  hex: string;
  dimHex: string;
  glow: string;
  gradient: string;
  tagBg: string;
  tagBorder: string;
  tagText: string;
}> = {
  violet: {
    hex: '#818cf8',
    dimHex: '#6366f1',
    glow: 'rgba(99,102,241,0.25)',
    gradient: 'from-slate-950/85 via-indigo-950/50 to-transparent',
    tagBg: 'rgba(99,102,241,0.15)',
    tagBorder: 'rgba(99,102,241,0.35)',
    tagText: '#a5b4fc',
  },
  sky: {
    hex: '#38bdf8',
    dimHex: '#0ea5e9',
    glow: 'rgba(14,165,233,0.25)',
    gradient: 'from-slate-950/85 via-sky-950/50 to-transparent',
    tagBg: 'rgba(14,165,233,0.15)',
    tagBorder: 'rgba(14,165,233,0.35)',
    tagText: '#7dd3fc',
  },
  emerald: {
    hex: '#34d399',
    dimHex: '#10b981',
    glow: 'rgba(16,185,129,0.25)',
    gradient: 'from-slate-950/85 via-emerald-950/50 to-transparent',
    tagBg: 'rgba(16,185,129,0.15)',
    tagBorder: 'rgba(16,185,129,0.35)',
    tagText: '#6ee7b7',
  },
};

/* ─── SVG Icons ─── */
function QuizIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.09 9C9.3251 8.33167 9.78915 7.76811 10.4 7.40913C11.0108 7.05016 11.7289 6.91894 12.4272 7.03871C13.1255 7.15849 13.7588 7.52152 14.2151 8.06353C14.6714 8.60553 14.9211 9.29152 14.92 10C14.92 12 11.92 13 11.92 13"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="17" r="1" fill={color} />
    </svg>
  );
}

function PodcastIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1C8.13 1 5 4.13 5 8V11C5 14.87 8.13 18 12 18C15.87 18 19 14.87 19 11V8C19 4.13 15.87 1 12 1Z"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 18V23" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 23H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M2 11C2 15.97 6.03 20 11 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M22 11C22 15.97 17.97 20 13 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  );
}

function VideoIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="14" height="16" rx="2.5" stroke={color} strokeWidth="1.5" />
      <path d="M16 9.5L21.2 6.5C21.6 6.28 22 6.57 22 7.03V16.97C22 17.43 21.6 17.72 21.2 17.5L16 14.5V9.5Z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="9" cy="12" r="2.5" stroke={color} strokeWidth="1.3" strokeOpacity="0.5" />
    </svg>
  );
}

function GameIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="6" width="20" height="12" rx="3" stroke={color} strokeWidth="1.5" />
      <path d="M6 12H10M8 10V14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="15" cy="11" r="1.5" fill={color} />
      <circle cx="18" cy="13" r="1.5" fill={color} />
    </svg>
  );
}

function TargetIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2" fill={color} />
      <path d="M12 2V6M12 18V22M2 12H6M18 12H22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7M17 7H7M17 7V17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Types ─── */
type ServiceCard = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  accent: AccentKey;
  label: string;
};

/* ════════════════════════════════════════════
   BENTO CARD COMPONENT
════════════════════════════════════════════ */
function BentoCard({
  svc,
  index,
  size = 'default',
}: {
  svc: ServiceCard;
  index: number;
  size?: 'default' | 'wide';
}) {
  const [hovered, setHovered] = useState(false);
  const ac = accentMap[svc.accent];
  const prefersReducedMotion = useReducedMotion();

  const IconComponent =
    svc.id === 'quiz'
      ? QuizIcon
      : svc.id === 'podcast'
        ? PodcastIcon
        : svc.id === 'blink-flight'
          ? GameIcon
          : svc.id === 'eye-ninja'
            ? TargetIcon
            : VideoIcon;

  const cardContent = (
    /* ── Outer Bezel Shell ── */
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.65,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={prefersReducedMotion ? {} : {
        y: -6,
        transition: { type: 'spring', stiffness: 300, damping: 20 },
      }}
      style={{
        /* Outer shell — glass plate effect */
        background: hovered
          ? `linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.10))`
          : `rgba(255,255,255,0.12)`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: hovered
          ? `1px solid ${ac.hex}50`
          : '1px solid rgba(255,255,255,0.25)',
        borderRadius: '1.75rem', /* rounded-[28px] */
        padding: '10px',
        boxShadow: hovered
          ? `0 24px 56px -12px ${ac.glow}, 0 4px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.15)`
          : `0 8px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.15)`,
        transition: 'box-shadow 0.4s cubic-bezier(0.16,1,0.3,1), background 0.4s ease, border-color 0.4s ease',
        cursor: 'pointer',
        display: 'block',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
      tabIndex={0}
      role="link"
      aria-label={svc.title}
    >
      {/* ── Inner Core ── */}
      <div style={{
        borderRadius: 'calc(1.75rem - 10px)', /* concentric radius */
        overflow: 'hidden',
        position: 'relative',
        height: size === 'wide' ? '280px' : '320px',
        background: '#0f1623',
      }}>
        {/* Background image with zoom on hover */}
        <img
          src={svc.image}
          alt={svc.title}
          loading="lazy"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 0.7s cubic-bezier(0.32,0.72,0,1)',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            willChange: 'transform',
          }}
        />

        {/* Optimized image dark overlay instead of CSS filter */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          opacity: hovered ? 0.45 : 0.25,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
          willChange: 'opacity',
        }} />

        {/* Deep cinematic gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${ac.gradient} pointer-events-none`}
          style={{
            opacity: hovered ? 1 : 0.88,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Secondary radial glow on hover */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 30% 80%, ${ac.hex}20 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: 'none',
        }} />

        {/* ── Card Content ── */}
        <div style={{
          position: 'absolute',
          inset: 0,
          padding: size === 'wide' ? 'clamp(20px, 4vw, 28px) clamp(24px, 5vw, 36px)' : 'clamp(20px, 4vw, 24px) clamp(20px, 4vw, 28px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
          {/* Top row: Index badge + Icon + Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
          }}>
            {/* Index + Label pill */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
              }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: ac.tagText,
                background: ac.tagBg,
                border: `1px solid ${ac.tagBorder}`,
                padding: '4px 10px',
                borderRadius: 100,
                backdropFilter: 'blur(8px)',
              }}>
                {svc.label}
              </span>
            </div>

            {/* Icon circle — agency "button-in-button" architecture */}
            <motion.div
              animate={hovered && !prefersReducedMotion
                ? { scale: 1.08, translateX: 2, translateY: -2 }
                : { scale: 1, translateX: 0, translateY: 0 }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: hovered ? `${ac.hex}25` : 'rgba(255,255,255,0.1)',
                border: `1px solid ${hovered ? ac.hex + '60' : 'rgba(255,255,255,0.2)'}`,
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.3s ease, border-color 0.3s ease',
              }}
            >
              <IconComponent color={hovered ? ac.hex : 'rgba(255,255,255,0.75)'} />
            </motion.div>
          </div>

          {/* Bottom: Title, Subtitle, CTA */}
          <div>
            {/* Subtitle */}
            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: ac.hex,
              marginBottom: 8,
              opacity: hovered ? 1 : 0.8,
              transition: 'opacity 0.3s ease',
            }}>
              {svc.subtitle}
            </p>

            {/* Title */}
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: size === 'wide' ? 'clamp(22px, 2.5vw, 34px)' : 'clamp(22px, 3vw, 30px)',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              marginBottom: 12,
              textShadow: '0 2px 12px rgba(0,0,0,0.3)',
            }}>
              {svc.title}
            </h3>

            {/* Description — appears on hover */}
            <div style={{
              overflow: 'hidden',
              maxHeight: hovered ? '80px' : '0px',
              opacity: hovered ? 1 : 0,
              transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease',
              marginBottom: hovered ? 16 : 0,
            }}>
              <p style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 13.5,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.75)',
                lineHeight: 1.65,
                marginBottom: 0,
              }}>
                {svc.description}
              </p>
            </div>

            {/* CTA row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              {/* Accent rule */}
              <motion.div
                animate={{ width: hovered ? 48 : 28 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  height: 3,
                  borderRadius: 2,
                  background: ac.hex,
                }}
              />

              {/* Arrow CTA */}
              <motion.div
                animate={hovered && !prefersReducedMotion
                  ? { x: 3, y: -3 }
                  : { x: 0, y: 0 }
                }
                transition={{ type: 'spring', stiffness: 350, damping: 18 }}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: hovered ? ac.hex : 'rgba(255,255,255,0.12)',
                  border: `1px solid ${hovered ? ac.hex : 'rgba(255,255,255,0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.3s ease, border-color 0.3s ease',
                }}
              >
                <ArrowIcon color={hovered ? '#fff' : 'rgba(255,255,255,0.7)'} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (svc.href.startsWith('/')) {
    return (
      <Link to={svc.href} style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
        {cardContent}
      </Link>
    );
  }
  return (
    <a href={svc.href} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: '100%', textDecoration: 'none' }}>
      {cardContent}
    </a>
  );
}

/* ════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════ */
export default function ExplorePage() {
  const { t } = useLanguage();

  const services = useMemo<ServiceCard[]>(
    () => [
      {
        id: 'quiz',
        title: t('explore.quiz.title'),
        subtitle: t('explore.quiz.subtitle'),
        description: t('explore.quiz.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770313620/VDZ08714_cxcixk.jpg',
        href: '/quiz',
        accent: 'violet',
        label: 'Interactive',
      },
      {
        id: 'podcast',
        title: t('explore.podcast.title'),
        subtitle: t('explore.podcast.subtitle'),
        description: t('explore.podcast.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770313896/images_5_f9s2t4.jpg',
        href: '/podcast',
        accent: 'sky',
        label: 'Audio',
      },
      {
        id: 'video',
        title: t('explore.video.title'),
        subtitle: t('explore.video.subtitle'),
        description: t('explore.video.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770313972/VDZ08640_rtfyh2.jpg',
        href: '/video',
        accent: 'emerald',
        label: 'Media',
      },
      {
        id: 'blink-flight',
        title: t('explore.blinkFlight.title'),
        subtitle: t('explore.blinkFlight.subtitle'),
        description: t('explore.blinkFlight.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1781522493/istockphoto-1279191954-1024x1024_zg5nxn.jpg',
        href: '/explore/blink-flight',
        accent: 'violet',
        label: 'Interactive Game',
      },
      {
        id: 'eye-ninja',
        title: t('explore.eyeNinja.title'),
        subtitle: t('explore.eyeNinja.subtitle'),
        description: t('explore.eyeNinja.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1781522493/eyeninja_qtavvc.jpg',
        href: '/explore/eye-ninja',
        accent: 'sky',
        label: 'Ocular Motility',
      },
    ],
    [t]
  );

  return (
    <>
      <style>{FONT_LINK}</style>

      {/* Page shell */}
      <div
        style={{
          minHeight: '100dvh',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          /* Premium layered background — light blue gradient */
          background: 'linear-gradient(160deg, #cce8fa 0%, #ddf0fc 40%, #c8e4f8 100%)',
          position: 'relative',
          overflowX: 'hidden',
        }}
      >
        {/* Subtle radial glow accents in page background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: `
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(99,102,241,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 80% 70%, rgba(14,165,233,0.07) 0%, transparent 65%)
          `,
        }} />

        {/* Page content */}
        <main style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1280,
          margin: '0 auto',
          padding: 'clamp(100px, 6vw, 80px) clamp(20px, 4vw, 48px)',
        }}>

          {/* ── Section header ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 'clamp(32px, 5vw, 56px)' }}
          >
            {/* Eyebrow label */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.7)',
              backdropFilter: 'blur(10px)',
              padding: '7px 18px',
              borderRadius: 100,
              marginBottom: 16,
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#2563EB',
                display: 'inline-block',
              }} />
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#1E40AF',
              }}>
                {t('explore.header')}
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#0c1a3a',
              marginBottom: 12,
            }}>
              {t('explore.title')}
            </h1>

            <p style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 15,
              fontWeight: 400,
              color: '#4B6A9B',
              lineHeight: 1.65,
              maxWidth: 520,
            }}>
              {t('explore.description')}
            </p>
          </motion.div>

          {/* ══════════════════════════════════════
              BENTO GRID
              Row 1: Quiz (2/3) | Podcast (1/3)
              Row 2: Video (full width)
          ══════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">

            {/* ── Quiz card: spans 2 columns, Row 1 ── */}
            <div className="md:col-span-2">
              <BentoCard svc={services[0]} index={0} size="default" />
            </div>

            {/* ── Podcast card: 1 column, Row 1 ── */}
            <div className="md:col-span-1">
              <BentoCard svc={services[1]} index={1} size="default" />
            </div>

            {/* ── Blink Game card: 1 column, Row 2 ── */}
            <div className="md:col-span-1">
              <BentoCard svc={services[3]} index={2} size="default" />
            </div>

            {/* ── Eye Ninja card: 1 column, Row 2 ── */}
            <div className="md:col-span-1">
              <BentoCard svc={services[4]} index={3} size="default" />
            </div>

            {/* ── Video card: 1 column, Row 2 ── */}
            <div className="md:col-span-1">
              <BentoCard svc={services[2]} index={4} size="default" />
            </div>
          </div>

        </main>
      </div>
    </>
  );
}