import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

/* ═══════════════════════════════════════════════════════
   JOURNEY PAGE — "Hồi ức" / Nostalgic Scrapbook Style
   Warm bright palette · Polaroid photos · Film texture
   ═══════════════════════════════════════════════════════ */

/* ─── types ─── */
type Milestone = {
  id: string;
  chapter: string;
  date: string;
  title: string;
  subtitle: string;
  quote: string;
  description: string;
  images: string[];
  accent: 'amber' | 'rose' | 'teal' | 'violet';
  highlights: string[];
  fbLink?: string;
};

/* ─── warm accent palette ─── */
const warmPalette = {
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    ring: 'ring-amber-300/50',
    pill: 'bg-amber-100 text-amber-700 border-amber-200',
    text: 'text-amber-600',
    quote: 'border-amber-400 bg-amber-50/80',
    tag: 'bg-amber-100/80 text-amber-700 border-amber-200/60',
    photoShadow: 'shadow-amber-200/40',
    gradient: 'from-amber-200 via-amber-100 to-orange-100',
    from: '#fef3c7',      // amber-100
    via: '#fef9e7',       // warm cream
    to: '#fef3c7',        // amber-100
    watermark: 'text-amber-200',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    ring: 'ring-rose-300/50',
    pill: 'bg-rose-100 text-rose-700 border-rose-200',
    text: 'text-rose-600',
    quote: 'border-rose-400 bg-rose-50/80',
    tag: 'bg-rose-100/80 text-rose-700 border-rose-200/60',
    photoShadow: 'shadow-rose-200/40',
    gradient: 'from-rose-200 via-pink-100 to-rose-100',
    from: '#ffe4e6',      // rose-100
    via: '#fef2f2',       // warm pink
    to: '#ffe4e6',        // rose-100
    watermark: 'text-rose-200',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    dot: 'bg-teal-500',
    ring: 'ring-teal-300/50',
    pill: 'bg-teal-100 text-teal-700 border-teal-200',
    text: 'text-teal-600',
    quote: 'border-teal-400 bg-teal-50/80',
    tag: 'bg-teal-100/80 text-teal-700 border-teal-200/60',
    photoShadow: 'shadow-teal-200/40',
    gradient: 'from-teal-200 via-cyan-100 to-teal-100',
    from: '#ccfbf1',      // teal-100
    via: '#f0fdfa',       // teal-50
    to: '#ccfbf1',        // teal-100
    watermark: 'text-teal-200',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
    ring: 'ring-violet-300/50',
    pill: 'bg-violet-100 text-violet-700 border-violet-200',
    text: 'text-violet-600',
    quote: 'border-violet-400 bg-violet-50/80',
    tag: 'bg-violet-100/80 text-violet-700 border-violet-200/60',
    photoShadow: 'shadow-violet-200/40',
    gradient: 'from-violet-200 via-purple-100 to-violet-100',
    from: '#ede9fe',      // violet-100
    via: '#faf5ff',       // violet-50
    to: '#ede9fe',        // violet-100
    watermark: 'text-violet-200',
  },
};

/* polaroid random rotations */
const polaroidRotations = [
  '-rotate-2', 'rotate-1', 'rotate-3', '-rotate-1',
  'rotate-2', '-rotate-3', 'rotate-1', '-rotate-2',
];

/* ─── Scroll-triggered Reveal ─── */
function Reveal({
  children,
  className = '',
  delay = 0,
  y = 50,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Stagger wrapper ─── */
function StaggerContainer({
  children,
  className = '',
  stagger = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const polaroidReveal = {
  hidden: { opacity: 0, y: 40, rotate: -6, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
};

/* ─── Floating bokeh lights ─── */
function BokehLight({ className, size, duration }: { className: string; size: string; duration: number }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-xl ${size} ${className}`}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.15, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─── Typewriter text ─── */
function TypewriterText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    setDisplayed('');
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 35);
    return () => clearInterval(timer);
  }, [inView, text]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {inView && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function JourneyPage() {
  const { t } = useLanguage();
  const [lightboxIdx, setLightboxIdx] = useState<{ ms: number; img: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentMilestone, setCurrentMilestone] = useState(0);

  /* lightbox keyboard nav */
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const navigateLightbox = useCallback(
    (dir: 1 | -1) => {
      if (!lightboxIdx) return;
      const images = MILESTONES[lightboxIdx.ms].images;
      const next = (lightboxIdx.img + dir + images.length) % images.length;
      setLightboxIdx({ ms: lightboxIdx.ms, img: next });
    },
    [lightboxIdx]
  );

  useEffect(() => {
    if (!lightboxIdx) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [lightboxIdx, closeLightbox, navigateLightbox]);

  /* Track scroll position for navigation dots */
  useEffect(() => {

    const handleScroll = () => {
      const sections = [
        document.getElementById('hero'),
        ...MILESTONES.map((_, i) => document.getElementById(`milestone-${i}`))
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setCurrentMilestone(i);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const openLightbox = useCallback((msIdx: number, imgIdx: number) => {
    setLightboxIdx({ ms: msIdx, img: imgIdx });
  }, []);

  const MILESTONES = useMemo(() => [
    {
      id: 'exhibition',
      chapter: t('journey.milestone1.chapter'),
      date: '04/11/2025',
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
      accent: 'amber' as const,
      highlights: [t('journey.milestone1.highlight1'), t('journey.milestone1.highlight2'), t('journey.milestone1.highlight3')],
      fbLink: 'https://www.facebook.com/share/p/183ujv2EKr/',
    },
    {
      id: 'scholarship',
      chapter: t('journey.milestone2.chapter'),
      date: '29/11/2025',
      title: t('journey.milestone2.title'),
      subtitle: t('journey.milestone2.subtitle'),
      quote: t('journey.milestone2.quote'),
      description: t('journey.milestone2.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770625743/z7219755559586_51bdad322f8062ffe4b676bac21b5fc2_q5fx7b.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770625743/z7219755544557_304e3abccd6f49d873921f9f64e38789_zv8rde.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1770625749/z7219755709277_5d46ea09a51f32be0108c77ac6855769_ftcwbp.jpg',
      ],
      accent: 'violet' as const,
      highlights: [t('journey.milestone2.highlight1'), t('journey.milestone2.highlight2'), t('journey.milestone2.highlight3')],
    },
    {
      id: 'seminar',
      chapter: t('journey.milestone3.chapter'),
      date: '24/01/2026',
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
      accent: 'rose' as const,
      highlights: [t('journey.milestone3.highlight1'), t('journey.milestone3.highlight2'), t('journey.milestone3.highlight3')],
    },
    {
      id: 'technology-handover',
      chapter: t('journey.milestone4.chapter'),
      date: '02/02/2026',
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
      accent: 'teal' as const,
      highlights: [t('journey.milestone4.highlight1'), t('journey.milestone4.highlight2'), t('journey.milestone4.highlight3')],
      fbLink: 'https://www.facebook.com/share/p/1DkUNs66NB/',
    },
  ], [t]);

  const totalImages = useMemo(() => MILESTONES.reduce((s, m) => s + m.images.length, 0), [MILESTONES]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Navigation dots */}
      {/* <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {[0, ...MILESTONES.map((_, i) => i + 1)].map((idx) => (
          <button
            key={idx}
            onClick={() => {
              const section = document.getElementById(idx === 0 ? 'hero' : `milestone-${idx - 1}`);
              section?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentMilestone === idx
                ? 'bg-blue-600 scale-125'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div> */}

      {/* ═══════ HERO BANNER ═══════ */}
      <section
        id="hero"
        className="relative min-h-screen lg:snap-start lg:snap-always flex items-center justify-center pt-16"
      >
        {/* Background Image */}
        <div className="absolute inset-0 top-16">
          <img
            src="https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/a_xnxud3.jpg"
            alt="VISTA Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <span className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-semibold">
              ✨ {t('journey.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-tight mb-4 sm:mb-6"
          >
            {t('journey.title')}
            <br />
            <span className="text-blue-400">{t('journey.subtitle')}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg sm:text-xl text-gray-200 mb-6 sm:mb-8"
          >
            {MILESTONES.length} {t('journey.milestones')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <button
              onClick={() => {
                document.getElementById('milestone-0')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105"
            >
              {t('journey.exploreCta')}
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ↓
              </motion.span>
            </button>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-white/60 text-xs sm:text-sm"
        >
          {t('journey.scrollHint')}
        </motion.div>
      </section>

      {/* ═══════ MILESTONES - SNAP SCROLL ═══════ */}
      {MILESTONES.map((ms, idx) => {
        const c = warmPalette[ms.accent];
        const imgCols = ms.images.length === 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2';
        
        return (
          <section
            key={ms.id}
            id={`milestone-${idx}`}
            className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 sm:py-16 lg:py-0"
            style={{
              background: `linear-gradient(135deg, ${c.from} 0%, ${c.via} 50%, ${c.to} 100%)`
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 w-full grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4 sm:space-y-6"
              >
                {/* Badge */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold ${c.pill}`}>
                    {ms.date}
                  </span>
                  <span className="text-gray-700 font-semibold text-xs sm:text-sm">
                    {ms.chapter}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                  {ms.title}
                </h2>

                <p className={`text-lg sm:text-xl font-semibold ${c.text}`}>
                  {ms.subtitle}
                </p>

                {/* Quote */}
                <div className={`pl-4 sm:pl-5 border-l-4 ${c.quote} py-2`}>
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-medium italic">
                    "{ms.quote}"
                  </p>
                  <p className="mt-2 text-xs sm:text-sm text-gray-500 font-medium">— Nhóm VISTA</p>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {ms.description}
                </p>

                {/* Highlights */}
                {ms.highlights.length > 0 && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 sm:mb-3 uppercase tracking-wide">
                      {t('journey.highlights')}
                    </h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {ms.highlights.map((item, i) => (
                        <span
                          key={i}
                          className={`rounded-md border px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium ${c.tag}`}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                {ms.fbLink && (
                  <a
                    href={ms.fbLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    {t('journey.fbLink')}
                  </a>
                )}
              </motion.div>

              {/* Right: Image Gallery */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="relative mt-8 lg:mt-0"
              >
                <div className="relative rounded-2xl bg-white/80 backdrop-blur-sm border border-white/40 p-3 sm:p-4 md:p-5 shadow-2xl">
                  <div className={`grid gap-2 sm:gap-3 ${imgCols}`}>
                    {ms.images.map((img, imgIdx) => (
                      <motion.button
                        key={imgIdx}
                        onClick={() => setLightboxIdx({ ms: idx, img: imgIdx })}
                        className="group relative rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        whileHover={{ y: -6, scale: 1.03 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                      >
                        <div className="relative aspect-square">
                          <img
                            src={img}
                            alt={`${ms.title} - ${imgIdx + 1}`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            loading="lazy"
                            decoding="async"
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full bg-white flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Milestone number watermark */}
            <div 
              className={`absolute bottom-8 right-8 text-9xl md:text-[12rem] font-black ${c.watermark} select-none pointer-events-none opacity-30`}
            >
              {String(idx + 1).padStart(2, '0')}
            </div>

            {/* Progress indicator for this section */}
            {/* <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              {MILESTONES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === idx ? 'w-8 bg-gray-900' : 'w-1.5 bg-gray-400'
                  }`}
                />
              ))}
            </div> */}
          </section>
        );
      })}

      {/* ═══════ LIGHTBOX ═══════ */}
      <AnimatePresence>
        {lightboxIdx && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(30, 20, 10, 0.92)' }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
          >
            {/* Close */}
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              onClick={closeLightbox}
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors z-10"
              aria-label="Đóng"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>

            {/* Prev */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors z-10"
              aria-label="Trước"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors z-10"
              aria-label="Sau"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Clean lightbox */}
            <motion.div
              key={`lb-${lightboxIdx.ms}-${lightboxIdx.img}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-[90vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={MILESTONES[lightboxIdx.ms].images[lightboxIdx.img]}
                alt="Phóng to"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />
              {/* Caption */}
              <div className="absolute -bottom-12 left-0 right-0 text-center">
                <p className="text-sm text-white/80 font-medium">
                  {MILESTONES[lightboxIdx.ms].title} — {lightboxIdx.img + 1}/{MILESTONES[lightboxIdx.ms].images.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
