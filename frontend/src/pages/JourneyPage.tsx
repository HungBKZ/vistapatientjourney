import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

/*
  ═══════════════════════════════════════════════════════════
  JOURNEY PAGE — "VISTA Neural Scan" Theme
  AI × Ophthalmology: Retinal scan grid, neural pulses,
  dark clinical aesthetic with electric cyan/violet accents.
  Font: Syne (display) + DM Mono (data labels)
  ═══════════════════════════════════════════════════════════
*/


/* ─── Font injection ─── */
const FONT_LINK = `
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:ital,wght@0,400;0,500;1,400&display=swap');
`;

/* ─── Accent system ─── */
type AccentKey = 'amber' | 'rose' | 'teal' | 'violet';

interface AccentDetail {
  hex: string;
  dim: string;
  border: string;
  glow: string;
  pill: { bg: string; color: string; border: string; };
  tag: { bg: string; color: string; border: string; };
}

const accents: Record<AccentKey, AccentDetail> = {
  amber: {
    hex: '#F5A623',
    dim: 'rgba(245,166,35,0.12)',
    border: 'rgba(245,166,35,0.3)',
    glow: '0 0 32px rgba(245,166,35,0.2)',
    pill: { bg: 'rgba(245,166,35,0.15)', color: '#F5A623', border: 'rgba(245,166,35,0.3)' },
    tag: { bg: 'rgba(245,166,35,0.08)', color: '#F5A623', border: 'rgba(245,166,35,0.2)' },
  },
  rose: {
    hex: '#FF6B8A',
    dim: 'rgba(255,107,138,0.12)',
    border: 'rgba(255,107,138,0.3)',
    glow: '0 0 32px rgba(255,107,138,0.2)',
    pill: { bg: 'rgba(255,107,138,0.15)', color: '#FF6B8A', border: 'rgba(255,107,138,0.3)' },
    tag: { bg: 'rgba(255,107,138,0.08)', color: '#FF6B8A', border: 'rgba(255,107,138,0.2)' },
  },
  teal: {
    hex: '#00E5CC',
    dim: 'rgba(0,229,204,0.12)',
    border: 'rgba(0,229,204,0.3)',
    glow: '0 0 32px rgba(0,229,204,0.2)',
    pill: { bg: 'rgba(0,229,204,0.15)', color: '#00E5CC', border: 'rgba(0,229,204,0.3)' },
    tag: { bg: 'rgba(0,229,204,0.08)', color: '#00E5CC', border: 'rgba(0,229,204,0.2)' },
  },
  violet: {
    hex: '#A78BFA',
    dim: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.3)',
    glow: '0 0 32px rgba(167,139,250,0.2)',
    pill: { bg: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: 'rgba(167,139,250,0.3)' },
    tag: { bg: 'rgba(167,139,250,0.08)', color: '#A78BFA', border: 'rgba(167,139,250,0.2)' },
  },
};

/* ─── Retinal grid SVG background ─── */
interface RetinalGridProps {
  color?: string;
  opacity?: number;
}

function RetinalGrid({ color = '#00E5CC', opacity = 0.04 }: RetinalGridProps) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id={`grid-${color.replace('#', '')}`} width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke={color} strokeWidth="0.5" opacity={opacity * 10} />
        </pattern>
        <radialGradient id="grid-fade" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`grid-fade-${color.replace('#', '')}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`grid-mask-${color.replace('#', '')}`}>
          <rect width="100%" height="100%" fill={`url(#grid-fade-${color.replace('#', '')})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#grid-${color.replace('#', '')})`} mask={`url(#grid-mask-${color.replace('#', '')})`} opacity={opacity} />
    </svg>
  );
}

/* ─── Scanning line animation ─── */
interface ScanLineProps {
  color?: string;
}

function ScanLine({ color = '#00E5CC' }: ScanLineProps) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        height: '1px',
        background: `linear-gradient(90deg, transparent 0%, ${color}80 30%, ${color} 50%, ${color}80 70%, transparent 100%)`,
        pointerEvents: 'none',
        zIndex: 1,
      }}
      animate={{ top: ['0%', '100%'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
    />
  );
}

/* ─── Neural pulse dot ─── */
interface NeuralPulseProps {
  color: string;
  style?: React.CSSProperties;
}

function NeuralPulse({ color, style }: NeuralPulseProps) {
  return (
    <motion.div
      style={{
        position: 'absolute',
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: color,
        boxShadow: `0 0 12px ${color}`,
        ...style,
      }}
      animate={{ scale: [1, 2.5, 1], opacity: [0.8, 0, 0.8] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

/* ─── Chapter counter ─── */
interface ChapterBadgeProps {
  num: number;
  color: string;
}

function ChapterBadge({ num, color }: ChapterBadgeProps) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      fontWeight: 600,
      fontSize: 11,
      letterSpacing: '0.15em',
      color,
      textTransform: 'uppercase',
    }}>
      <span style={{
        display: 'inline-block',
        width: 20,
        height: 20,
        borderRadius: 4,
        border: `1px solid ${color}`,
        background: `${color}20`,
        textAlign: 'center',
        lineHeight: '20px',
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        fontWeight: 600,
      }}>{String(num).padStart(2, '0')}</span>
      CHAPTER
    </div>
  );
}

/* ─── Photo card with retinal scan overlay ─── */
interface PhotoCardProps {
  src: string;
  alt: string;
  onClick: () => void;
  accentColor: string;
  index: number;
}

function PhotoCard({ src, alt, onClick, accentColor, index }: PhotoCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        border: hovered ? `1px solid ${accentColor}80` : '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.03)',
        cursor: 'pointer',
        outline: 'none',
        padding: 0,
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: hovered ? `0 0 24px ${accentColor}30` : 'none',
        aspectRatio: '1 / 1',
      }}
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    // stagger via transition delay
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          filter: hovered ? 'brightness(0.75)' : 'brightness(0.9)',
          transition: 'filter 0.3s',
        }}
        loading="lazy"
      />

      {/* Corner brackets */}
      {hovered && (
        <>
          {[
            { top: 6, left: 6 },
            { top: 6, right: 6 },
            { bottom: 6, left: 6 },
            { bottom: 6, right: 6 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: 12,
              height: 12,
              border: `1.5px solid ${accentColor}`,
              borderRadius: 1,
              ...pos,
              borderTop: (pos.bottom !== undefined) ? 'none' : undefined,
              borderBottom: (pos.top !== undefined) ? 'none' : undefined,
              borderLeft: (pos.right !== undefined) ? 'none' : undefined,
              borderRight: (pos.left !== undefined) ? 'none' : undefined,
            }} />
          ))}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1.5px solid ${accentColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.4)',
              backdropFilter: 'blur(4px)',
            }}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke={accentColor} strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </>
      )}

      {/* Index label */}
      <div style={{
        position: 'absolute',
        bottom: 6,
        right: 8,
        fontFamily: "'DM Mono', monospace",
        fontSize: 9,
        color: `${accentColor}99`,
        letterSpacing: '0.05em',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>
    </motion.button>
  );
}


interface MilestoneLink {
  label: string;
  url: string;
}

interface Milestone {
  id: string;
  chapter: string;
  date: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  images: string[];
  accent: AccentKey;
  highlights?: string[];
  fbLink?: string;
  links?: MilestoneLink[];
}

/* ═══════════════════════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════════════════════ */
export default function JourneyPage() {
  const { t } = useLanguage();

  const MILESTONES: Milestone[] = useMemo(() => [
    {
      id: 'exhibition',
      chapter: t('journey.milestone1.chapter'),
      date: '04 / 11 / 2025',
      title: t('journey.milestone1.title'),
      subtitle: t('journey.milestone1.subtitle'),
      quote: t('journey.milestone1.quote'),
      description: t('journey.milestone1.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/a_xnxud3.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710325/z7187641781717_35e4a88e7c6e52e45478bc4761b36cbf_uwiuar.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/d_cuvmbv.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/c_kxm0nd.jpg',
      ],
      accent: 'amber',
      highlights: [t('journey.milestone1.highlight1'), t('journey.milestone1.highlight2'), t('journey.milestone1.highlight3')],
      fbLink: 'https://www.facebook.com/share/p/183ujv2EKr/',
    },
    {
      id: 'scholarship',
      chapter: t('journey.milestone2.chapter'),
      date: '29 / 11 / 2025',
      title: t('journey.milestone2.title'),
      subtitle: t('journey.milestone2.subtitle'),
      quote: t('journey.milestone2.quote'),
      description: t('journey.milestone2.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770625743/z7219755559586_51bdad322f8062ffe4b676bac21b5fc2_q5fx7b.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770625743/z7219755544557_304e3abccd6f49d873921f9f64e38789_zv8rde.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770625749/z7219755709277_5d46ea09a51f32be0108c77ac6855769_ftcwbp.jpg',
      ],
      accent: 'violet',
      highlights: [t('journey.milestone2.highlight1'), t('journey.milestone2.highlight2'), t('journey.milestone2.highlight3')],
    },
    {
      id: 'seminar',
      chapter: t('journey.milestone3.chapter'),
      date: '24 / 01 / 2026',
      title: t('journey.milestone3.title'),
      subtitle: t('journey.milestone3.subtitle'),
      quote: t('journey.milestone3.quote'),
      description: t('journey.milestone3.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316801/617288450_122119025229062997_6837418133007770989_n_dtfvs0.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316796/625082181_122119025301062997_6476179986474380358_n_sknls1.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316796/624693981_122119025295062997_3091587328736484852_n_e0qyvt.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316797/625104173_122119025259062997_6441979336655487674_n_etbvcl.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316798/624494951_122119025163062997_1900920309973079511_n_jwqt0g.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316799/623008038_122119025115062997_1290174103381862566_n_qdowzu.jpg',
      ],
      accent: 'rose',
      highlights: [t('journey.milestone3.highlight1'), t('journey.milestone3.highlight2'), t('journey.milestone3.highlight3')],
    },
    {
      id: 'technology-handover',
      chapter: t('journey.milestone4.chapter'),
      date: '02 / 02 / 2026',
      title: t('journey.milestone4.title'),
      subtitle: t('journey.milestone4.subtitle'),
      quote: t('journey.milestone4.quote'),
      description: t('journey.milestone4.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316668/625150519_122119516461062997_3033367744691987602_n_socdyf.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316668/627256193_122119516365062997_6305196475481639092_n_fnxod9.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316668/627797492_122119516479062997_8235468441699454425_n_yeewjr.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316668/626784497_122119516335062997_710351683700892706_n_wsoxsy.jpg',
      ],
      accent: 'teal',
      highlights: [t('journey.milestone4.highlight1'), t('journey.milestone4.highlight2'), t('journey.milestone4.highlight3')],
      fbLink: 'https://www.facebook.com/share/p/1DkUNs66NB/',
    },
    {
      id: 'media-recognition',
      chapter: t('journey.milestone5.chapter'),
      date: '03 / 2026',
      title: t('journey.milestone5.title'),
      subtitle: t('journey.milestone5.subtitle'),
      quote: t('journey.milestone5.quote'),
      description: t('journey.milestone5.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1773419482/647280036_122123208369062997_6928364276467755357_n_be5jlp.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1773419482/646829784_122123208327062997_3707418219203006998_n_b3rw3k.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1773419482/648646541_122123208333062997_6447584519480269090_n_nhpvsh.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1773419482/z7616492665205_1afa552afb72c9c4b950b853cee28ae9_cwaemk.jpg',
      ],
      accent: 'amber',
      highlights: [t('journey.milestone5.highlight1'), t('journey.milestone5.highlight2'), t('journey.milestone5.highlight3')],
      links: [
        { label: t('journey.facebookPostLink'), url: 'https://www.facebook.com/share/p/1JnS4zQVPk/' },
        { label: t('journey.vtvArticleLink'), url: 'https://vtv.vn/ung-dung-ai-mo-phong-benh-ly-nhan-khoa-cua-sinh-vien-duoc-chuyen-giao-cho-benh-vien-100260304192222996.htm' },
        { label: t('journey.danvietArticleLink'), url: 'https://danviet.vn/ung-dung-ai-mo-phong-benh-ly-nhan-khoa-cua-sinh-vien-duoc-dua-vao-benh-vien-d1406922.html' },
        { label: t('journey.thanhnienArticleLink'), url: 'https://thanhnien.vn/tu-du-an-sinh-vien-den-giai-phap-giup-benh-nhan-nhin-thay-benh-ly-thi-giac-185260306155726806.htm' },
      ],
    },
  ], [t]);

  const [lightboxIdx, setLightboxIdx] = useState<{ ms: number; img: number } | null>(null);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const navigateLightbox = useCallback((dir: number) => {
    if (!lightboxIdx) return;
    const images = MILESTONES[lightboxIdx.ms].images;
    setLightboxIdx({ ms: lightboxIdx.ms, img: (lightboxIdx.img + dir + images.length) % images.length });
  }, [lightboxIdx, MILESTONES]);

  useEffect(() => {
    if (!lightboxIdx) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
  }, [lightboxIdx, closeLightbox, navigateLightbox]);

  return (
    <>
      {/* Font injection */}
      <style>{FONT_LINK}</style>
      <style>{`
        .vista-journey * { box-sizing: border-box; }
        .vista-journey { background: #080B10; color: #E2E8F0; }

        /* Hero data-readout animation */
        @keyframes ticker {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .data-ticker-inner {
          animation: ticker 18s linear infinite;
        }

        /* Milestone vertical line */
        .milestone-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(0,229,204,0.15) 20%, rgba(0,229,204,0.15) 80%, transparent);
          transform: translateX(-50%);
        }

        /* Highlight tags */
        .vista-tag {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.05em;
          padding: 5px 10px;
          border-radius: 4px;
          border-width: 1px;
          border-style: solid;
          display: inline-block;
        }

        /* Quote block */
        .vista-quote {
          position: relative;
          padding: 16px 20px;
          border-radius: 0 8px 8px 0;
          border-left-width: 2px;
          border-left-style: solid;
        }

        /* CTA buttons */
        .vista-btn {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 10px 20px;
          border-radius: 6px;
          border-width: 1px;
          border-style: solid;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
        }
        .vista-btn:hover {
          transform: translateY(-2px);
        }

        /* Scrollbar */
        .vista-journey ::-webkit-scrollbar { width: 4px; }
        .vista-journey ::-webkit-scrollbar-track { background: #0D1117; }
        .vista-journey ::-webkit-scrollbar-thumb { background: rgba(0,229,204,0.3); border-radius: 2px; }
      `}</style>

      <div className="vista-journey relative" style={{ minHeight: '100vh' }}>

        {/* ═══ HERO ═══ */}
        <section
          id="hero"
          style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            paddingTop: 64,
          }}
        >
          {/* Background image with dark overlay */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              src="https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/a_xnxud3.jpg"
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.18) saturate(0.5)' }}
            />
            {/* Gradient overlays */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(8,11,16,0.95) 0%, rgba(8,11,16,0.55) 50%, rgba(8,11,16,0.97) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(8,11,16,0.1) 0%, rgba(8,11,16,0.85) 100%)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(transparent, #080B10)' }} />
          </div>

          {/* Retinal grid */}
          <RetinalGrid color="#00E5CC" opacity={0.06} />

          {/* Scan line */}
          <ScanLine color="#00E5CC" />

          {/* Neural pulses */}
          <NeuralPulse color="#00E5CC" style={{ top: '25%', left: '18%' }} />
          <NeuralPulse color="#A78BFA" style={{ top: '60%', right: '22%' }} />
          <NeuralPulse color="#F5A623" style={{ bottom: '30%', left: '42%' }} />

          {/* Side data readout - left */}
          <div style={{
            position: 'absolute',
            left: 24,
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            color: 'rgba(0,229,204,0.4)',
            letterSpacing: '0.08em',
            lineHeight: 2,
            overflow: 'hidden',
            height: 200,
          }}>
            <div className="data-ticker-inner">
              {['VISTA_SYS', 'AI_MODEL', 'VER:2.1.0', 'STATUS:OK', 'OCULAR_AI', 'CNN_ACTIVE', 'GPU:RTX', 'FRAMES:30', 'ACCURACY:96%', 'VISTA_SYS', 'AI_MODEL', 'VER:2.1.0', 'STATUS:OK', 'OCULAR_AI', 'CNN_ACTIVE', 'GPU:RTX', 'FRAMES:30', 'ACCURACY:96%'].map((s, i) => (
                <div key={i}>{s}</div>
              ))}
            </div>
          </div>

          {/* Main hero content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 860 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ marginBottom: 20 }}
            >
              <span style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 11,
                letterSpacing: '0.15em',
                color: '#00E5CC',
                textTransform: 'uppercase',
                background: 'rgba(8, 11, 16, 0.65)',
                border: '1px solid rgba(0,229,204,0.35)',
                padding: '6px 16px',
                borderRadius: 4,
                backdropFilter: 'blur(4px)',
                textShadow: '0 1px 4px rgba(0,0,0,0.5)',
              }}>
                ✦ {t('journey.badge')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              style={{
                fontFamily: "'Lexend', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(40px, 7vw, 80px)',
                lineHeight: 1.05,
                color: '#F1F5F9',
                marginBottom: 16,
                letterSpacing: '-0.02em',
                filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.95)) drop-shadow(0 2px 4px rgba(0,0,0,0.7))',
              }}
            >
              {t('journey.title')}
              <br />
              <span style={{
                background: 'linear-gradient(135deg, #00E5CC, #A78BFA)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {t('journey.subtitle')}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 16,
                color: 'rgba(226,232,240,0.85)',
                marginBottom: 40,
                fontWeight: 400,
                letterSpacing: '0.01em',
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {MILESTONES.length} {t('journey.milestones')}
            </motion.p>

            {/* Milestone progress strip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48 }}
            >
              {MILESTONES.map((ms, i) => (
                <div key={i} style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }} onClick={() => document.getElementById(`milestone-${i}`)?.scrollIntoView({ behavior: 'smooth' })}>
                  <motion.div
                    whileHover={{ scaleY: 1.5 }}
                    style={{
                      width: 40,
                      height: 3,
                      borderRadius: 2,
                      background: accents[ms.accent].hex,
                      opacity: 0.6,
                      transition: 'opacity 0.2s',
                    }}
                  />
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    color: accents[ms.accent].hex,
                    opacity: 0.5,
                    letterSpacing: '0.1em',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              onClick={() => document.getElementById('milestone-0')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'rgba(0,229,204,0.1)',
                border: '1px solid rgba(0,229,204,0.35)',
                color: '#00E5CC',
                padding: '12px 32px',
                borderRadius: 6,
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 600,
                fontSize: 12,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                transition: 'all 0.2s',
              }}
              whileHover={{ background: 'rgba(0,229,204,0.18)', scale: 1.03 }}
            >
              {t('journey.exploreCta')}
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >↓</motion.span>
            </motion.button>
          </div>

          {/* Bottom hint */}
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              bottom: 28,
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500,
              fontSize: 10,
              color: 'rgba(226,232,240,0.45)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            {t('journey.scrollHint')}
          </motion.div>
        </section>

        {/* ═══ MILESTONES ═══ */}
        {MILESTONES.map((ms, idx) => {
          const ac = accents[ms.accent];
          const imgCols = ms.images.length === 6
            ? 'repeat(3, 1fr)'
            : ms.images.length === 3
              ? 'repeat(3, 1fr)'
              : 'repeat(2, 1fr)';

          return (
            <section
              key={ms.id}
              id={`milestone-${idx}`}
              style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                padding: 'clamp(48px, 8vw, 80px) 0',
                background: idx % 2 === 0
                  ? `radial-gradient(ellipse 80% 60% at 10% 50%, ${ac.dim} 0%, #080B10 70%)`
                  : `radial-gradient(ellipse 80% 60% at 90% 50%, ${ac.dim} 0%, #080B10 70%)`,
              }}
            >
              {/* Ambient grid */}
              <RetinalGrid color={ac.hex} opacity={0.03} />

              {/* Large chapter watermark */}
              <div style={{
                position: 'absolute',
                right: idx % 2 === 0 ? -20 : 'auto',
                left: idx % 2 !== 0 ? -20 : 'auto',
                bottom: 20,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: 'clamp(100px, 20vw, 200px)',
                color: ac.hex,
                opacity: 0.04,
                lineHeight: 1,
                letterSpacing: '-0.05em',
                userSelect: 'none',
                pointerEvents: 'none',
              }}>
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Top accent bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent, ${ac.hex}40, transparent)`,
              }} />

              <div style={{
                maxWidth: 1280,
                margin: '0 auto',
                padding: '0 clamp(20px, 5vw, 80px)',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: 'clamp(32px, 6vw, 80px)',
                alignItems: 'center',
              }}>
                {/* ─── Left: Content ─── */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  style={{ order: idx % 2 === 0 ? 1 : 2 }}
                >
                  {/* Chapter badge + date */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
                    <ChapterBadge num={idx + 1} color={ac.hex} />
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 500,
                      fontSize: 12,
                      color: 'rgba(226,232,240,0.55)',
                      letterSpacing: '0.05em',
                      borderLeft: '1px solid rgba(255,255,255,0.1)',
                      paddingLeft: 12,
                    }}>
                      {ms.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: 'clamp(28px, 4vw, 52px)',
                    color: '#F1F5F9',
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    marginBottom: 8,
                  }}>
                    {ms.title}
                  </h2>

                  {/* Subtitle */}
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 15,
                    fontWeight: 500,
                    color: ac.hex,
                    marginBottom: 24,
                    letterSpacing: '0.01em',
                    opacity: 1,
                  }}>
                    {ms.subtitle}
                  </p>

                  {/* Quote */}
                  <div className="vista-quote" style={{
                    borderLeftColor: ac.hex,
                    background: `linear-gradient(90deg, ${ac.dim}, transparent)`,
                    marginBottom: 20,
                  }}>
                    {/* Quote mark */}
                    <div style={{
                      position: 'absolute',
                      top: -12,
                      left: 16,
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 48,
                      color: ac.hex,
                      opacity: 0.2,
                      lineHeight: 1,
                      pointerEvents: 'none',
                    }}>"</div>
                    <p style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 15,
                      fontStyle: 'italic',
                      color: 'rgba(226,232,240,0.85)',
                      lineHeight: 1.7,
                      margin: 0,
                    }}>
                      {ms.quote}
                    </p>
                    <p style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 600,
                      fontSize: 10,
                      color: ac.hex,
                      opacity: 0.8,
                      marginTop: 8,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    }}>— Nhóm VISTA</p>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 14,
                    color: 'rgba(226,232,240,0.8)',
                    lineHeight: 1.75,
                    marginBottom: 24,
                    fontWeight: 400,
                  }}>
                    {ms.description}
                  </p>

                  {/* Highlights */}
                  {ms.highlights && ms.highlights.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <p style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 600,
                        fontSize: 10,
                        color: 'rgba(226,232,240,0.45)',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        marginBottom: 10,
                      }}>
                        {t('journey.highlights')}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {ms.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="vista-tag"
                            style={{
                              background: ac.tag.bg,
                              color: ac.tag.color,
                              borderColor: ac.tag.border,
                            }}
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTAs */}
                  {(ms.fbLink || ms.links?.length) && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      {ms.fbLink && (
                        <a
                          href={ms.fbLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vista-btn"
                          style={{
                            background: 'rgba(66,103,178,0.15)',
                            borderColor: 'rgba(66,103,178,0.4)',
                            color: '#7B97E0',
                          }}
                        >
                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                          {t('journey.fbLink')}
                        </a>
                      )}
                      {ms.links?.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vista-btn"
                          style={{
                            background: ac.dim,
                            borderColor: ac.border,
                            color: ac.hex,
                          }}
                        >
                          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* ─── Right: Image Gallery ─── */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ order: idx % 2 === 0 ? 2 : 1 }}
                >
                  {/* Gallery frame */}
                  <div style={{
                    position: 'relative',
                    background: 'rgba(255,255,255,0.02)',
                    border: `1px solid ${ac.border}`,
                    borderRadius: 12,
                    padding: 16,
                    boxShadow: ac.glow,
                  }}>
                    {/* Frame header */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 12,
                      paddingBottom: 12,
                      borderBottom: `1px solid rgba(255,255,255,0.06)`,
                    }}>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {[ac.hex, 'rgba(255,255,255,0.15)', 'rgba(255,255,255,0.08)'].map((c, i) => (
                          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
                        ))}
                      </div>
                      <span style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        fontWeight: 500,
                        fontSize: 10,
                        color: 'rgba(226,232,240,0.4)',
                        letterSpacing: '0.05em',
                        marginLeft: 4,
                      }}>
                        VISTA_CAM · {ms.images.length} FRAMES
                      </span>
                      <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} style={{
                            width: 16,
                            height: 2,
                            borderRadius: 1,
                            background: i === 0 ? ac.hex : 'rgba(255,255,255,0.1)',
                            opacity: i === 0 ? 0.7 : 1,
                          }} />
                        ))}
                      </div>
                    </div>

                    {/* Images grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: imgCols,
                      gap: 8,
                    }}>
                      {ms.images.map((img, imgIdx) => (
                        <PhotoCard
                          key={imgIdx}
                          src={img}
                          alt={`${ms.title} - ${imgIdx + 1}`}
                          onClick={() => setLightboxIdx({ ms: idx, img: imgIdx })}
                          accentColor={ac.hex}
                          index={imgIdx}
                        />
                      ))}
                    </div>

                    {/* Corner accent */}
                    <div style={{
                      position: 'absolute',
                      bottom: -1,
                      right: -1,
                      width: 40,
                      height: 40,
                      borderRight: `1px solid ${ac.hex}60`,
                      borderBottom: `1px solid ${ac.hex}60`,
                      borderRadius: '0 0 12px 0',
                    }} />
                  </div>
                </motion.div>
              </div>
            </section>
          );
        })}

        {/* ═══ LIGHTBOX ═══ */}
        <AnimatePresence>
          {lightboxIdx && (
            <motion.div
              key="lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(5,8,12,0.96)',
                backdropFilter: 'blur(12px)',
                padding: 16,
              }}
              onClick={closeLightbox}
            >
              {/* Close */}
              <button
                onClick={closeLightbox}
                style={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 36,
                  height: 36,
                  borderRadius: 6,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#E2E8F0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 1,
                }}
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Prev */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                style={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  background: 'rgba(0,229,204,0.08)',
                  border: '1px solid rgba(0,229,204,0.25)',
                  color: '#00E5CC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 1,
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                style={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 40,
                  height: 40,
                  borderRadius: 6,
                  background: 'rgba(0,229,204,0.08)',
                  border: '1px solid rgba(0,229,204,0.25)',
                  color: '#00E5CC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 1,
                }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <motion.div
                key={`lb-${lightboxIdx.ms}-${lightboxIdx.img}`}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Corner brackets on lightbox */}
                {[
                  { top: -8, left: -8 },
                  { top: -8, right: -8 },
                  { bottom: -8, left: -8 },
                  { bottom: -8, right: -8 },
                ].map((pos, i) => {
                  const ac = accents[MILESTONES[lightboxIdx.ms].accent];
                  return (
                    <div key={i} style={{
                      position: 'absolute',
                      width: 20,
                      height: 20,
                      border: `2px solid ${ac.hex}`,
                      borderRadius: 2,
                      ...pos,
                      borderTop: pos.bottom !== undefined ? 'none' : undefined,
                      borderBottom: pos.top !== undefined ? 'none' : undefined,
                      borderLeft: pos.right !== undefined ? 'none' : undefined,
                      borderRight: pos.left !== undefined ? 'none' : undefined,
                    }} />
                  );
                })}
                <img
                  src={MILESTONES[lightboxIdx.ms].images[lightboxIdx.img]}
                  alt="Phóng to"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '85vh',
                    objectFit: 'contain',
                    borderRadius: 8,
                    display: 'block',
                  }}
                />
                {/* Caption */}
                <div style={{
                  position: 'absolute',
                  bottom: -36,
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                }}>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                    fontSize: 11,
                    color: 'rgba(226,232,240,0.55)',
                    letterSpacing: '0.05em',
                  }}>
                    {MILESTONES[lightboxIdx.ms].title} — FRAME {lightboxIdx.img + 1}/{MILESTONES[lightboxIdx.ms].images.length}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}