import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

/*
  ═══════════════════════════════════════════════════════════
  JOURNEY PAGE — "VISTA Clinical" Enhanced Theme v2
  Cải tiến:
  1. Sticky progress nav với IntersectionObserver
  2. Mobile layout fix (order reset)
  3. Vertical timeline connector
  4. Font optimization (chỉ load weights cần thiết)
  5. Lightbox swipe gesture + thumbnail strip
  6. Body text 15–16px cho dễ đọc
  ═══════════════════════════════════════════════════════════
*/

/* ─── Chỉ load weights thực sự dùng: Lexend 600,800,900 + DM Sans 400,500 ─── */
const FONT_LINK = `
@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@600;800;900&family=DM+Sans:wght@400;500&display=swap');
`;

/* ─── Color tokens ─── */
const C = {
  navy:       '#04213F',
  blue:       '#1A6FD8',
  blueMid:    '#2563EB',
  blueLight:  '#60A5FA',
  blue50:     '#EFF6FF',
  blue100:    '#DBEAFE',
  blue200:    '#BFDBFE',
  slate700:   '#334155',
  slate500:   '#64748B',
  slate400:   '#94A3B8',
  slate200:   '#E2E8F0',
  white:      '#FFFFFF',
  pageBg:     '#F0F6FF',
  sectionAlt: '#F4F9FF',
};

type AccentKey = 'blue' | 'indigo' | 'sky' | 'cobalt';

interface Accent {
  hex: string;
  text: string;
  bg: string;
  border: string;
  tagBg: string;
  tagText: string;
  tagBorder: string;
  quoteBg: string;
  shadow: string;
  galleryBorder: string;
}

const accents: Record<AccentKey, Accent> = {
  blue: {
    hex: '#2563EB', text: '#1D4ED8',
    bg: '#EFF6FF', border: '#BFDBFE',
    tagBg: '#EFF6FF', tagText: '#1D4ED8', tagBorder: '#BFDBFE',
    quoteBg: '#EBF4FF',
    shadow: '0 4px 28px rgba(37,99,235,0.10)',
    galleryBorder: '#BFDBFE',
  },
  indigo: {
    hex: '#4338CA', text: '#3730A3',
    bg: '#EEF2FF', border: '#C7D2FE',
    tagBg: '#EEF2FF', tagText: '#3730A3', tagBorder: '#C7D2FE',
    quoteBg: '#EEF2FF',
    shadow: '0 4px 28px rgba(67,56,202,0.10)',
    galleryBorder: '#C7D2FE',
  },
  sky: {
    hex: '#0284C7', text: '#0369A1',
    bg: '#F0F9FF', border: '#BAE6FD',
    tagBg: '#F0F9FF', tagText: '#0369A1', tagBorder: '#BAE6FD',
    quoteBg: '#F0F9FF',
    shadow: '0 4px 28px rgba(2,132,199,0.10)',
    galleryBorder: '#BAE6FD',
  },
  cobalt: {
    hex: '#1D4ED8', text: '#1E40AF',
    bg: '#EFF6FF', border: '#93C5FD',
    tagBg: '#EFF6FF', tagText: '#1E40AF', tagBorder: '#93C5FD',
    quoteBg: '#EBF4FF',
    shadow: '0 4px 28px rgba(29,78,216,0.10)',
    galleryBorder: '#93C5FD',
  },
};

/* ─── Types ─── */
interface MilestoneLink { label: string; url: string; }
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

/* ─── Fine grid background ─── */
function MedGrid({ opacity = 0.055 }: { opacity?: number }) {
  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="mg" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#2563EB" strokeWidth="0.5" />
        </pattern>
        <radialGradient id="mg-fade" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="mg-mask">
          <rect width="100%" height="100%" fill="url(#mg-fade)" />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#mg)" mask="url(#mg-mask)" opacity={opacity} />
    </svg>
  );
}

/* ─── ECG line ─── */
function ECGLine({ color }: { color: string }) {
  return (
    <svg height="32" viewBox="0 0 400 32" preserveAspectRatio="none"
      style={{ width: '100%', opacity: 0.22, display: 'block' }}>
      <polyline
        points="0,16 50,16 66,5 74,25 88,1 98,29 110,16 200,16 218,10 228,20 244,16 400,16"
        fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Floating orb ─── */
function FloatingOrb({ size, top, left, right, bottom, color, delay = 0 }: {
  size: number; top?: string; left?: string; right?: string; bottom?: string;
  color: string; delay?: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -22, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        position: 'absolute', width: size, height: size, borderRadius: '50%',
        background: color, pointerEvents: 'none',
        top, left, right, bottom,
      }}
    />
  );
}

/* ─── Chapter badge ─── */
function ChapterBadge({ num, label, ac }: { num: number; label: string; ac: Accent }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
      fontSize: 11, letterSpacing: '0.14em',
      color: ac.text, textTransform: 'uppercase',
    }}>
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 26, height: 26, borderRadius: 7,
        border: `1.5px solid ${ac.hex}`, background: ac.bg,
        fontSize: 11, fontWeight: 600, color: ac.text,
      }}>
        {String(num).padStart(2, '0')}
      </span>
      {label}
    </div>
  );
}

/* ─── Photo card ─── */
function PhotoCard({
  src, alt, onClick, ac, index,
}: { src: string; alt: string; onClick: () => void; ac: Accent; index: number }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative', borderRadius: 9, overflow: 'hidden',
        border: `1.5px solid ${hov ? ac.hex : '#E2EDFC'}`,
        background: '#F1F8FF',
        cursor: 'pointer', outline: 'none', padding: 0,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hov ? `0 8px 24px ${ac.hex}30` : '0 1px 6px rgba(37,99,235,0.06)',
        aspectRatio: '1 / 1',
      }}
      whileHover={{ scale: 1.04, y: -2 }}
      transition={{ duration: 0.18 }}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <img
        src={src} alt={alt}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', display: 'block',
          filter: hov ? 'brightness(0.82)' : 'brightness(1)',
          transition: 'filter 0.2s',
        }}
        loading="lazy"
      />
      {hov && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {[
            { top: 5, left: 5 }, { top: 5, right: 5 },
            { bottom: 5, left: 5 }, { bottom: 5, right: 5 },
          ].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', width: 11, height: 11,
              border: `1.5px solid ${ac.hex}`, ...pos,
              borderTop: pos.bottom !== undefined ? 'none' : undefined,
              borderBottom: pos.top !== undefined ? 'none' : undefined,
              borderLeft: pos.right !== undefined ? 'none' : undefined,
              borderRight: pos.left !== undefined ? 'none' : undefined,
            }} />
          ))}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              border: `1.5px solid ${ac.hex}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.88)',
            }}
          >
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke={ac.hex} strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </motion.div>
        </div>
      )}
      <div style={{
        position: 'absolute', bottom: 5, right: 7,
        fontFamily: "'Lexend', monospace", fontSize: 9,
        color: hov ? ac.hex : '#BFDBFE', transition: 'color 0.2s',
        letterSpacing: '0.05em',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>
    </motion.button>
  );
}

/* ════════════════════════════════════════════
   STICKY PROGRESS NAV — CẢI TIẾN 1
════════════════════════════════════════════ */
function StickyProgressNav({
  milestones,
  activeIdx,
}: {
  milestones: Milestone[];
  activeIdx: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', top: 16, left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 8000,
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            border: `1.5px solid ${C.blue200}`,
            borderRadius: 100,
            padding: '8px 20px',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 24px rgba(37,99,235,0.12)',
          }}
        >
          {/* VISTA label */}
          <span style={{
            fontFamily: "'Lexend', sans-serif", fontWeight: 800,
            fontSize: 9, letterSpacing: '0.16em',
            color: C.blueMid, textTransform: 'uppercase',
            marginRight: 8, opacity: 0.7,
          }}>
            VISTA
          </span>

          {milestones.map((ms, i) => {
            const ac = accents[ms.accent];
            const isActive = i === activeIdx;
            return (
              <button
                key={ms.id}
                onClick={() => document.getElementById(`ms-${i}`)?.scrollIntoView({ behavior: 'smooth' })}
                title={ms.title}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', cursor: 'pointer',
                  padding: '4px 6px', borderRadius: 20,
                  transition: 'background 0.2s',
                }}
              >
                {/* Dot */}
                <motion.div
                  animate={{
                    width: isActive ? 24 : 8,
                    background: isActive ? ac.hex : C.blue200,
                  }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: 8, borderRadius: 4 }}
                />
                {/* Active label */}
                <AnimatePresence>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.22 }}
                      style={{
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                        fontSize: 10, color: ac.text,
                        letterSpacing: '0.06em', whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ════════════════════════════════════════════
   TIMELINE CONNECTOR — CẢI TIẾN 3
════════════════════════════════════════════ */
function TimelineConnector({
  totalCount,
  activeIdx,
  milestones,
}: {
  totalCount: number;
  activeIdx: number;
  milestones: Milestone[];
}) {
  return (
    <div style={{
      position: 'fixed', left: 20, top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 100,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 0,
    }}
      className="vj-timeline-connector"
    >
      {milestones.map((ms, i) => {
        const ac = accents[ms.accent];
        const isActive = i === activeIdx;
        const isPast = i < activeIdx;
        return (
          <div key={ms.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Node circle */}
            <motion.button
              onClick={() => document.getElementById(`ms-${i}`)?.scrollIntoView({ behavior: 'smooth' })}
              title={ms.title}
              animate={{
                scale: isActive ? 1.2 : 1,
                borderColor: isActive ? ac.hex : isPast ? ac.hex : C.slate200,
                background: isActive ? ac.hex : isPast ? `${ac.hex}30` : C.white,
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: 20, height: 20, borderRadius: '50%',
                border: `2px solid`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', outline: 'none',
                boxShadow: isActive ? `0 0 0 4px ${ac.hex}25` : 'none',
                transition: 'box-shadow 0.3s',
              }}
            >
              <span style={{
                fontFamily: "'Lexend', sans-serif", fontWeight: 800,
                fontSize: 7, color: isActive ? C.white : isPast ? ac.text : C.slate400,
              }}>
                {i + 1}
              </span>
            </motion.button>

            {/* Connector line between nodes */}
            {i < totalCount - 1 && (
              <div style={{ width: 2, height: 36, position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: C.slate200, borderRadius: 1,
                }} />
                <motion.div
                  animate={{ scaleY: isPast ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: accents[milestones[i].accent].hex,
                    borderRadius: 1, transformOrigin: 'top',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN
════════════════════════════════════════════ */
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
      accent: 'blue',
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
      accent: 'indigo',
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
      accent: 'sky',
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
      accent: 'cobalt',
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
      accent: 'blue',
      highlights: [t('journey.milestone5.highlight1'), t('journey.milestone5.highlight2'), t('journey.milestone5.highlight3')],
      links: [
        { label: t('journey.facebookPostLink'), url: 'https://www.facebook.com/share/p/1JnS4zQVPk/' },
        { label: t('journey.vtvArticleLink'), url: 'https://vtv.vn/ung-dung-ai-mo-phong-benh-ly-nhan-khoa-cua-sinh-vien-duoc-chuyen-giao-cho-benh-vien-100260304192222996.htm' },
        { label: t('journey.danvietArticleLink'), url: 'https://danviet.vn/ung-dung-ai-mo-phong-benh-ly-nhan-khoa-cua-sinh-vien-duoc-dua-vao-benh-vien-d1406922.html' },
        { label: t('journey.thanhnienArticleLink'), url: 'https://thanhnien.vn/tu-du-an-sinh-vien-den-giai-phap-giup-benh-nhan-nhin-thay-benh-ly-thi-giac-185260306155726806.htm' },
      ],
    },
  ], [t]);

  /* ─── Active milestone tracking (IntersectionObserver) — CẢI TIẾN 1+3 ─── */
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    MILESTONES.forEach((_, i) => {
      const el = sectionRefs.current[i];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIdx(i);
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [MILESTONES]);

  /* ─── Lightbox state ─── */
  const [lb, setLb] = useState<{ ms: number; img: number } | null>(null);
  const closeLb = useCallback(() => setLb(null), []);
  const navLb = useCallback((dir: number) => {
    if (!lb) return;
    const len = MILESTONES[lb.ms].images.length;
    setLb({ ms: lb.ms, img: (lb.img + dir + len) % len });
  }, [lb, MILESTONES]);

  /* ─── Keyboard nav lightbox ─── */
  useEffect(() => {
    if (!lb) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowRight') navLb(1);
      if (e.key === 'ArrowLeft') navLb(-1);
    };
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [lb, closeLb, navLb]);

  /* ─── Swipe gesture for lightbox — CẢI TIẾN 5 ─── */
  const swipeStartX = useRef<number | null>(null);
  const handlePointerDown = (e: React.PointerEvent) => {
    swipeStartX.current = e.clientX;
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    if (swipeStartX.current === null) return;
    const delta = e.clientX - swipeStartX.current;
    if (Math.abs(delta) > 50) navLb(delta < 0 ? 1 : -1);
    swipeStartX.current = null;
  };

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{`
        .vj * { box-sizing: border-box; }
        .vj {
          background: ${C.pageBg};
          color: ${C.slate700};
          font-family: 'DM Sans', sans-serif;
        }
        .vj h1, .vj h2, .vj h3 {
          font-family: 'Lexend', sans-serif;
        }
        .vj ::-webkit-scrollbar { width: 4px; }
        .vj ::-webkit-scrollbar-track { background: ${C.blue50}; }
        .vj ::-webkit-scrollbar-thumb { background: ${C.blue200}; border-radius: 2px; }

        .vj-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          font-size: 11px; letter-spacing: 0.09em; text-transform: uppercase;
          padding: 10px 18px; border-radius: 9px;
          border-width: 1.5px; border-style: solid;
          cursor: pointer; text-decoration: none;
          transition: transform 0.18s, box-shadow 0.18s;
        }
        .vj-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(37,99,235,0.16); }

        .vj-tag {
          font-family: 'DM Sans', sans-serif; font-weight: 500;
          font-size: 12px; padding: 5px 14px;
          border-radius: 20px; border-width: 1px; border-style: solid;
          display: inline-block; white-space: nowrap;
        }

        @keyframes vj-ticker-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .vj-ticker { animation: vj-ticker-up 22s linear infinite; }

        @keyframes vj-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .vj-blink { animation: vj-blink 2s ease infinite; }

        @keyframes vj-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(37,99,235,0.4); }
          70% { box-shadow: 0 0 0 12px rgba(37,99,235,0); }
          100% { box-shadow: 0 0 0 0 rgba(37,99,235,0); }
        }
        .vj-pulse-dot { animation: vj-pulse-ring 2.4s ease-out infinite; }

        @keyframes vj-scroll-hint {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        .vj-scroll-hint { animation: vj-scroll-hint 3s ease infinite; }

        /* ── CẢI TIẾN 2: Mobile layout fix ── */
        @media (max-width: 768px) {
          .vj-text-col { order: 1 !important; }
          .vj-gallery-col { order: 2 !important; }
        }

        /* ── Ẩn timeline connector trên mobile nhỏ ── */
        @media (max-width: 640px) {
          .vj-timeline-connector { display: none !important; }
        }

        /* ── Lightbox thumbnail active ring ── */
        .vj-lb-thumb-active {
          outline: 2px solid white !important;
          outline-offset: 2px;
          opacity: 1 !important;
        }
      `}</style>

      <div className="vj" style={{ minHeight: '100vh' }}>

        {/* ══════════════ STICKY PROGRESS NAV — CẢI TIẾN 1 ══════════════ */}
        <StickyProgressNav milestones={MILESTONES} activeIdx={activeIdx} />

        {/* ══════════════ TIMELINE CONNECTOR — CẢI TIẾN 3 ══════════════ */}
        <TimelineConnector
          totalCount={MILESTONES.length}
          activeIdx={activeIdx}
          milestones={MILESTONES}
        />

        {/* ══════════════ HERO ══════════════ */}
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          background: `linear-gradient(160deg, #E8F2FF 0%, #F5FAFF 50%, #EAF1FF 100%)`,
          paddingTop: 80,
        }}>
          <MedGrid opacity={0.07} />

          <FloatingOrb size={520} top="-120px" right="-100px"
            color="radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)"
            delay={0} />
          <FloatingOrb size={380} bottom="-80px" left="-60px"
            color="radial-gradient(circle, rgba(96,165,250,0.10) 0%, transparent 70%)"
            delay={3} />

          {[700, 500, 320].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size, height: size, borderRadius: '50%',
              border: `1px solid ${C.blue200}`,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              opacity: 0.3 - i * 0.07,
              pointerEvents: 'none',
            }} />
          ))}

          <img
            src="https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/a_xnxud3.jpg"
            alt=""
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'saturate(0.1) brightness(1.6) contrast(0.7)',
              mixBlendMode: 'multiply',
              opacity: 0.18,
            }}
          />

          {[
            { top: '22%', left: '13%', delay: 0 },
            { top: '68%', right: '16%', delay: 0.8 },
            { bottom: '28%', left: '40%', delay: 1.5 },
          ].map((pos, i) => (
            <div key={i} className="vj-pulse-dot" style={{
              position: 'absolute', width: 8, height: 8,
              borderRadius: '50%', background: C.blueMid,
              border: `2px solid ${C.white}`,
              top: pos.top, left: pos.left, right: (pos as any).right, bottom: (pos as any).bottom,
              animationDelay: `${pos.delay}s`,
            }} />
          ))}

          {/* Left data strip */}
          <div style={{
            position: 'absolute', left: 20, top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: "'Lexend', monospace", fontSize: 9,
            color: C.blueMid, letterSpacing: '0.1em',
            lineHeight: 2.5, overflow: 'hidden', height: 220,
            opacity: 0.22, userSelect: 'none',
          }}>
            <div className="vj-ticker">
              {['VISTA.SYS', 'AI_MODEL', 'VER:2.1', 'LIVE', 'CNN:ON', 'ACC:96%', 'OCULAR', 'SCAN:OK',
                'VISTA.SYS', 'AI_MODEL', 'VER:2.1', 'LIVE', 'CNN:ON', 'ACC:96%', 'OCULAR', 'SCAN:OK'].map((s, i) => (
                <div key={i}>{s}</div>
              ))}
            </div>
          </div>

          {/* Hero content */}
          <div style={{
            position: 'relative', zIndex: 2,
            textAlign: 'center', padding: '0 24px', maxWidth: 780,
          }}>
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{ marginBottom: 28 }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                fontSize: 11, letterSpacing: '0.16em', color: C.blueMid,
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.92)',
                border: `1.5px solid ${C.blue200}`,
                padding: '7px 20px', borderRadius: 100,
                boxShadow: '0 2px 16px rgba(37,99,235,0.1)',
              }}>
                <span className="vj-blink" style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: C.blueMid, display: 'inline-block',
                }} />
                {t('journey.badge')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.25 }}
              style={{
                fontFamily: "'Lexend', sans-serif", fontWeight: 900,
                fontSize: 'clamp(44px, 7vw, 88px)',
                lineHeight: 1.02, letterSpacing: '-0.04em',
                color: C.navy, marginBottom: 12,
              }}
            >
              {t('journey.title')}
              <br />
              <span style={{
                background: `linear-gradient(130deg, ${C.blue} 0%, ${C.blueLight} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                {t('journey.subtitle')}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{ maxWidth: 320, margin: '0 auto 14px' }}
            >
              <ECGLine color={C.blueMid} />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              style={{
                fontSize: 15, color: C.blueMid, fontWeight: 400,
                marginBottom: 36, opacity: 0.8,
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {MILESTONES.length} {t('journey.milestones')}
            </motion.p>

            {/* Progress dots */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.75 }}
              style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 36 }}
            >
              {MILESTONES.map((ms, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'pointer' }}
                  onClick={() => document.getElementById(`ms-${i}`)?.scrollIntoView({ behavior: 'smooth' })}>
                  <motion.div
                    whileHover={{ scaleY: 2.2, scaleX: 1.15 }}
                    style={{
                      width: 44, height: 3, borderRadius: 2,
                      background: accents[ms.accent].hex, opacity: 0.5,
                    }}
                  />
                  <span style={{
                    fontFamily: "'Lexend', monospace", fontSize: 9,
                    color: accents[ms.accent].hex, opacity: 0.55, letterSpacing: '0.1em',
                  }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.9 }}
              onClick={() => document.getElementById('ms-0')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ y: -3, boxShadow: '0 8px 28px rgba(37,99,235,0.2)' }}
              style={{
                background: C.white, border: `1.5px solid ${C.blue200}`,
                color: C.blueMid, padding: '13px 32px', borderRadius: 12,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 10,
                boxShadow: '0 2px 16px rgba(37,99,235,0.12)',
              }}
            >
              {t('journey.exploreCta')}
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>↓</motion.span>
            </motion.button>
          </div>

          {/* Scroll hint */}
          <div className="vj-scroll-hint" style={{
            position: 'absolute', bottom: 26, left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
            fontSize: 10, color: C.blueMid,
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>
            {t('journey.scrollHint')}
          </div>

          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 100,
            background: `linear-gradient(transparent, ${C.pageBg})`,
          }} />
        </section>

        {/* ══════════════ MILESTONES ══════════════ */}
        {MILESTONES.map((ms, idx) => {
          const ac = accents[ms.accent];
          const isEven = idx % 2 === 0;
          const imgCols = ms.images.length === 6
            ? 'repeat(3, 1fr)'
            : ms.images.length === 3
              ? 'repeat(3, 1fr)'
              : 'repeat(2, 1fr)';

          const linkBtns: Array<{ label: string; url: string; isFb?: boolean }> = [];
          if (ms.fbLink) linkBtns.push({ label: t('journey.fbLink'), url: ms.fbLink, isFb: true });
          if (ms.links) ms.links.forEach(l => linkBtns.push(l));

          return (
            <section
              key={ms.id}
              id={`ms-${idx}`}
              ref={el => { sectionRefs.current[idx] = el; }}
              style={{
                position: 'relative',
                minHeight: '100vh',
                display: 'flex', alignItems: 'center',
                overflow: 'hidden',
                padding: 'clamp(70px, 9vw, 110px) 0',
                background: isEven ? C.white : C.sectionAlt,
                borderBottom: `1px solid ${C.slate200}`,
              }}
            >
              <MedGrid opacity={0.032} />

              {/* Watermark number */}
              <div style={{
                position: 'absolute',
                right: isEven ? -10 : 'auto', left: !isEven ? -10 : 'auto',
                bottom: 4,
                fontFamily: "'Lexend', sans-serif", fontWeight: 900,
                fontSize: 'clamp(110px, 18vw, 220px)',
                color: ac.hex, opacity: 0.04,
                lineHeight: 1, letterSpacing: '-0.05em',
                userSelect: 'none', pointerEvents: 'none',
              }}>
                {String(idx + 1).padStart(2, '0')}
              </div>

              {/* Top accent line */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${ac.hex}28, ${ac.hex}60, ${ac.hex}28, transparent)`,
              }} />

              <div style={{
                maxWidth: 1300, margin: '0 auto',
                padding: '0 clamp(24px, 5vw, 88px)',
                width: '100%',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'clamp(48px, 6vw, 88px)',
                alignItems: 'center',
              }}>

                {/* ── Text column — CẢI TIẾN 2: thêm className để reset order trên mobile ── */}
                <motion.div
                  className="vj-text-col"
                  initial={{ opacity: 0, x: isEven ? -36 : 36 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  style={{ order: isEven ? 1 : 2 }}
                >
                  {/* Chapter + date row */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    marginBottom: 18, flexWrap: 'wrap',
                  }}>
                    <ChapterBadge num={idx + 1} label={ms.chapter} ac={ac} />
                    <span style={{
                      fontFamily: "'Lexend', monospace", fontSize: 11,
                      color: C.slate400, letterSpacing: '0.06em',
                      borderLeft: `1px solid ${C.slate200}`, paddingLeft: 14,
                    }}>
                      {ms.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "'Lexend', sans-serif", fontWeight: 900,
                    fontSize: 'clamp(30px, 3.5vw, 54px)',
                    color: C.navy, lineHeight: 1.06,
                    letterSpacing: '-0.028em', marginBottom: 8,
                  }}>
                    {ms.title}
                  </h2>

                  {/* Subtitle */}
                  <p style={{
                    fontSize: 15, fontWeight: 500,
                    color: ac.text, marginBottom: 22,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {ms.subtitle}
                  </p>

                  {/* Quote */}
                  <div style={{
                    borderLeft: `3.5px solid ${ac.hex}`,
                    background: ac.quoteBg,
                    padding: '16px 18px', borderRadius: '0 10px 10px 0',
                    marginBottom: 20, position: 'relative',
                  }}>
                    <p style={{
                      /* CẢI TIẾN 4: body text 15–16px dễ đọc hơn 14px */
                      fontSize: 15, fontStyle: 'italic',
                      color: C.navy, lineHeight: 1.82,
                      margin: 0, opacity: 0.88,
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {ms.quote}
                    </p>
                    <p style={{
                      fontSize: 10, fontWeight: 500,
                      color: ac.text, marginTop: 10,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      fontFamily: "'DM Sans', sans-serif",
                    }}>
                      — Nhóm VISTA
                    </p>
                  </div>

                  {/* Description — CẢI TIẾN 4: 16px */}
                  <p style={{
                    fontSize: 16, color: C.slate700,
                    lineHeight: 1.85, marginBottom: 24, fontWeight: 400,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {ms.description}
                  </p>

                  {/* Highlights */}
                  {ms.highlights && ms.highlights.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <p style={{
                        fontSize: 10, fontWeight: 500, color: C.slate400,
                        letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>
                        {t('journey.highlights')}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {ms.highlights.map((h, i) => (
                          <span key={i} className="vj-tag" style={{
                            background: ac.tagBg, color: ac.tagText, borderColor: ac.tagBorder,
                          }}>
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {linkBtns.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9 }}>
                      {linkBtns.map((link) => (
                        <a
                          key={link.url} href={link.url} target="_blank" rel="noopener noreferrer"
                          className="vj-btn"
                          style={link.isFb
                            ? { background: '#EEF2FF', borderColor: '#C7D2FE', color: '#3730A3' }
                            : { background: ac.bg, borderColor: ac.border, color: ac.text }
                          }
                        >
                          {link.isFb
                            ? <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            : <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                          }
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* ── Gallery column — CẢI TIẾN 2: thêm className ── */}
                <motion.div
                  className="vj-gallery-col"
                  initial={{ opacity: 0, x: isEven ? 36 : -36 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{ order: isEven ? 2 : 1 }}
                >
                  <div style={{
                    background: C.white,
                    border: `1.5px solid ${ac.galleryBorder}`,
                    borderRadius: 16, padding: 16,
                    boxShadow: ac.shadow,
                    position: 'relative',
                  }}>
                    {/* Gallery header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      paddingBottom: 11, marginBottom: 12,
                      borderBottom: `1px solid ${C.blue100}`,
                    }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        {[ac.hex, C.blue200, C.blue100].map((c, i) => (
                          <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
                        ))}
                      </div>
                      <span style={{
                        fontFamily: "'Lexend', monospace", fontSize: 10,
                        color: C.slate400, letterSpacing: '0.05em', marginLeft: 4,
                      }}>
                        VISTA_CAM · {ms.images.length} FRAMES
                      </span>
                      <span style={{
                        marginLeft: 'auto',
                        fontFamily: "'Lexend', monospace", fontSize: 9, fontWeight: 600,
                        color: ac.text, background: ac.bg,
                        border: `1px solid ${ac.border}`,
                        padding: '3px 9px', borderRadius: 5, letterSpacing: '0.07em',
                      }}>
                        ● REC
                      </span>
                    </div>

                    {/* Photo grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: imgCols, gap: 9 }}>
                      {ms.images.map((img, i) => (
                        <PhotoCard key={i} src={img} alt={`${ms.title} ${i + 1}`}
                          onClick={() => setLb({ ms: idx, img: i })}
                          ac={ac} index={i}
                        />
                      ))}
                    </div>

                    {/* ECG footer */}
                    <div style={{ marginTop: 11 }}>
                      <ECGLine color={ac.hex} />
                    </div>

                    <div style={{
                      position: 'absolute', bottom: -1, right: -1,
                      width: 38, height: 38,
                      borderRight: `2px solid ${ac.hex}40`,
                      borderBottom: `2px solid ${ac.hex}40`,
                      borderRadius: '0 0 16px 0',
                    }} />
                  </div>
                </motion.div>
              </div>
            </section>
          );
        })}

        {/* ══════════════ LIGHTBOX — CẢI TIẾN 5: swipe + thumbnail strip ══════════════ */}
        <AnimatePresence>
          {lb && (
            <motion.div
              key="lb"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                background: 'rgba(8,20,50,0.92)',
                backdropFilter: 'blur(18px)',
                padding: 16,
              }}
              onClick={closeLb}
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
            >
              {/* Close */}
              <button onClick={closeLb} style={{
                position: 'absolute', top: 16, right: 16,
                width: 40, height: 40, borderRadius: 9,
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#EFF6FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 18,
              }}>✕</button>

              {/* Milestone title top */}
              <div style={{
                position: 'absolute', top: 18, left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: "'Lexend', sans-serif", fontWeight: 800,
                fontSize: 11, color: 'rgba(219,234,254,0.7)',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}>
                {MILESTONES[lb.ms].title}
              </div>

              {/* Prev */}
              <button onClick={e => { e.stopPropagation(); navLb(-1); }} style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                width: 42, height: 42, borderRadius: 9,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                color: '#DBEAFE', fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>‹</button>

              {/* Next */}
              <button onClick={e => { e.stopPropagation(); navLb(1); }} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                width: 42, height: 42, borderRadius: 9,
                background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)',
                color: '#DBEAFE', fontSize: 22,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}>›</button>

              {/* Main image */}
              <motion.div
                key={`${lb.ms}-${lb.img}`}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                style={{ position: 'relative', maxWidth: '90vw', maxHeight: '72vh' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Corner brackets */}
                {[
                  { top: -8, left: -8 }, { top: -8, right: -8 },
                  { bottom: -8, left: -8 }, { bottom: -8, right: -8 },
                ].map((pos, i) => (
                  <div key={i} style={{
                    position: 'absolute', width: 18, height: 18,
                    border: '2px solid rgba(255,255,255,0.45)', ...pos,
                    borderTop: pos.bottom !== undefined ? 'none' : undefined,
                    borderBottom: pos.top !== undefined ? 'none' : undefined,
                    borderLeft: pos.right !== undefined ? 'none' : undefined,
                    borderRight: pos.left !== undefined ? 'none' : undefined,
                  }} />
                ))}

                <img
                  src={MILESTONES[lb.ms].images[lb.img]}
                  alt="Phóng to"
                  style={{
                    maxWidth: '100%', maxHeight: '72vh',
                    objectFit: 'contain', borderRadius: 10, display: 'block',
                    boxShadow: '0 28px 70px rgba(0,0,0,0.5)',
                  }}
                />
              </motion.div>

              {/* ── Thumbnail strip — CẢI TIẾN 5 ── */}
              <div
                onClick={e => e.stopPropagation()}
                style={{
                  display: 'flex', gap: 8,
                  marginTop: 16, padding: '8px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                  maxWidth: '90vw', overflowX: 'auto',
                }}
              >
                {MILESTONES[lb.ms].images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLb({ ms: lb.ms, img: i })}
                    className={i === lb.img ? 'vj-lb-thumb-active' : ''}
                    style={{
                      flexShrink: 0, width: 52, height: 52, borderRadius: 7,
                      overflow: 'hidden', padding: 0, border: 'none',
                      cursor: 'pointer', opacity: i === lb.img ? 1 : 0.45,
                      transition: 'opacity 0.18s',
                    }}
                  >
                    <img
                      src={img} alt={`Thumbnail ${i + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </button>
                ))}
              </div>

              {/* Counter */}
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <span style={{
                  fontFamily: "'Lexend', monospace", fontSize: 11,
                  color: 'rgba(219,234,254,0.55)', letterSpacing: '0.06em',
                }}>
                  {lb.img + 1} / {MILESTONES[lb.ms].images.length}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}