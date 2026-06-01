import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
} from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

/* ═══════════════════════════════════════════════════════
   UPGRADED JOURNEY PAGE — PREMIUM SCRAPBOOK STYLE
   Warm bright palette · Polaroid layers · Dynamic bokeh lights
   ═══════════════════════════════════════════════════════ */

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
  links?: Array<{
    label: string;
    url: string;
  }>;
};

const warmPalette = {
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    ring: 'ring-amber-300/50',
    pill: 'bg-amber-100/80 text-amber-800 border-amber-200',
    text: 'text-amber-700',
    quote: 'border-amber-400 bg-amber-100/40',
    tag: 'bg-white/80 text-amber-800 border-amber-200',
    photoShadow: 'shadow-amber-950/10',
    from: '#fef3c7',      // amber-100
    via: '#fffbeb',       // amber-50
    to: '#fde68a',        // amber-200
    watermark: 'text-amber-300/20',
    bokeh: 'bg-amber-400/20',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    ring: 'ring-rose-300/50',
    pill: 'bg-rose-100/80 text-rose-800 border-rose-200',
    text: 'text-rose-700',
    quote: 'border-rose-400 bg-rose-100/40',
    tag: 'bg-white/80 text-rose-800 border-rose-200',
    photoShadow: 'shadow-rose-950/10',
    from: '#ffe4e6',      // rose-100
    via: '#fff5f5',       // rose-50
    to: '#fecdd3',        // rose-200
    watermark: 'text-rose-300/20',
    bokeh: 'bg-rose-400/20',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    dot: 'bg-teal-500',
    ring: 'ring-teal-300/50',
    pill: 'bg-teal-100/80 text-teal-800 border-teal-200',
    text: 'text-teal-700',
    quote: 'border-teal-400 bg-teal-100/40',
    tag: 'bg-white/80 text-teal-800 border-teal-200',
    photoShadow: 'shadow-teal-950/10',
    from: '#ccfbf1',      // teal-100
    via: '#f0fdfa',       // teal-50
    to: '#99f6e4',        // teal-200
    watermark: 'text-teal-300/20',
    bokeh: 'bg-teal-400/20',
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
    ring: 'ring-violet-300/50',
    pill: 'bg-violet-100/80 text-violet-800 border-violet-200',
    text: 'text-violet-700',
    quote: 'border-violet-400 bg-violet-100/40',
    tag: 'bg-white/80 text-violet-800 border-violet-200',
    photoShadow: 'shadow-violet-950/10',
    from: '#ede9fe',      // violet-100
    via: '#f5f3ff',       // violet-50
    to: '#ddd6fe',        // violet-200
    watermark: 'text-violet-300/20',
    bokeh: 'bg-violet-400/20',
  },
};

// Khởi tạo các góc nghiêng ngẫu nhiên để mô phỏng dán ảnh Scrapbook thủ công
const polaroidRotations = [-3, 2, -1, 3, -2, 1];

/* ─── Hiệu ứng hạt sáng Bokeh trôi nổi ─── */
function BokehLight({ className, size, duration }: { className: string; size: string; duration: number }) {
  return (
    <motion.div
      className={`pointer-events-none absolute rounded-full blur-3xl ${size} ${className}`}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, 0],
        opacity: [0.2, 0.5, 0.2],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

/* ─── Hiệu ứng máy đánh chữ (Typewriter Effect) ─── */
function TypewriterText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });
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
    }, 40);
    return () => clearInterval(timer);
  }, [inView, text]);

  return (
    <span ref={ref} className={className}>
      {displayed}
      {inView && displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.4, repeat: Infinity }}
          className="inline-block w-[3px] h-[1em] bg-current ml-1 align-middle"
        />
      )}
    </span>
  );
}

export default function JourneyPage() {
  const { t } = useLanguage();
  const [lightboxIdx, setLightboxIdx] = useState<{ ms: number; img: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Lightbox Navigation Utilities */
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
    {
      id: 'media-recognition',
      chapter: t('journey.milestone5.chapter'),
      date: '03/2026',
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
      accent: 'amber' as const,
      highlights: [t('journey.milestone5.highlight1'), t('journey.milestone5.highlight2'), t('journey.milestone5.highlight3')],
      links: [
        { label: t('journey.facebookPostLink'), url: 'https://www.facebook.com/share/p/1JnS4zQVPk/' },
        { label: t('journey.vtvArticleLink'), url: 'https://vtv.vn/ung-dung-ai-mo-phong-benh-ly-nhan-khoa-cua-sinh-vien-duoc-chuyen-giao-cho-benh-vien-100260304192222996.htm' },
        { label: t('journey.danvietArticleLink'), url: 'https://danviet.vn/ung-dung-ai-mo-phong-benh-ly-nhan-khoa-cua-sinh-vien-duoc-dua-vao-benh-vien-d1406922.html' },
        { label: t('journey.thanhnienArticleLink'), url: 'https://thanhnien.vn/tu-du-an-sinh-vien-den-giai-phap-giup-benh-nhan-nhin-thay-benh-ly-thi-giac-185260306155726806.htm' },
      ],
    },
  ], [t]);

  return (
    <div ref={containerRef} className="relative bg-stone-900 overflow-x-hidden">
      
      {/* ═══════ HERO BANNER (ĐÃ FIX LỖI GRADIENT ĐÁY MÀU TRẮNG) ═══════ */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/a_xnxud3.jpg"
            alt="VISTA Journey"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-bold tracking-wider uppercase">
              ✨ {t('journey.badge')}
            </span>
          </motion.div>

        <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center justify-center text-center select-none"
            style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
          >
            {/* Dòng 1: Badge phụ */}
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-white/90 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              {t('journey.title')}
            </span>

            {/* Dòng 2: Tiêu đề chính xử lý thuật toán tách chữ */}
            <span className="font-black text-white leading-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight max-w-4xl block drop-shadow-[0_2px_10px_rgba(0,0,0,0.15)]">
              {(() => {
                // 1. Lấy toàn bộ câu từ hàm dịch ra (Nếu chưa có thì lấy câu mặc định)
                const fullText = t('journey.subtitle') || 'Hành trình từ lớp học ra cộng đồng';
                
                // 2. Tách câu thành mảng các từ riêng lẻ dựa vào khoảng trắng
                const words = fullText.split(' ');
                
                // 3. Tìm điểm cắt (ví dụ câu có 7 từ thì cắt ở từ thứ 2: "Hành trình" | "từ lớp học...")
                // Bạn có thể chỉnh số 2 này tùy theo độ dài mong muốn của dòng 1
                const breakIndex = words.length > 4 ? 2 : Math.floor(words.length / 2);
                
                const firstLine = words.slice(0, breakIndex).join(' ');
                const secondLine = words.slice(breakIndex).join(' ');

                return (
                  <>
                    {firstLine}
                    <br />
                    <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                      {secondLine}
                    </span>
                  </>
                );
              })()}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg sm:text-2xl text-stone-200/90 font-medium"
          >
            {MILESTONES.length} {t('journey.milestones')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <button
              onClick={() => document.getElementById('milestone-0')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-base font-bold transition-all shadow-xl hover:shadow-blue-600/30 hover:scale-105"
            >
              {t('journey.exploreCta')}
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                ↓
              </motion.span>
            </button>
          </motion.div>
        </div>

        {/* Đã sửa từ màu trắng thành màu cam nhạt ấm (#fef3c7) khớp hoàn toàn với chương đầu tiên */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#fef3c7] to-transparent pointer-events-none" />
      </section>

      {/* ═══════ MILESTONES — SCRAPBOOK STYLE ═══════ */}
      {MILESTONES.map((ms, idx) => {
        const c = warmPalette[ms.accent];
        
        return (
          <section
            key={ms.id}
            id={`milestone-${idx}`}
            className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 sm:py-32"
            style={{ background: `linear-gradient(135deg, ${c.from} 0%, ${c.via} 60%, ${c.to} 100%)` }}
          >
            {/* Hạt hiệu ứng Bokeh nghệ thuật */}
            <BokehLight className={c.bokeh} size="w-72 h-72" duration={7} />
            <BokehLight className={c.bokeh} size="w-96 h-96 top-1/3 right-10" duration={10} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
              
              {/* Bên trái: Nội dung câu chuyện */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="space-y-6 lg:col-span-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black tracking-wider border shadow-sm ${c.pill}`}>
                    {ms.date}
                  </span>
                  <span className="text-stone-500 font-bold text-xs uppercase tracking-widest">
                    <TypewriterText text={ms.chapter} />
                  </span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-black text-stone-900 leading-tight tracking-tight">
                  {ms.title}
                </h2>

                <p className={`text-lg sm:text-xl font-bold ${c.text}`}>
                  {ms.subtitle}
                </p>

                <div className={`pl-5 border-l-4 ${c.quote} py-3 rounded-r-2xl pr-4 shadow-sm relative overflow-hidden bg-white/40 backdrop-blur-xs`}>
                  <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-medium italic relative z-10">
                    "{ms.quote}"
                  </p>
                  <p className="mt-2 text-xs text-stone-500 font-bold tracking-wide">— VISTA TEAM</p>
                </div>

                <p className="text-stone-700 text-sm sm:text-base leading-relaxed font-medium">
                  {ms.description}
                </p>

                {/* Điểm nhấn nổi bật */}
                {ms.highlights.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-stone-900 uppercase tracking-widest">
                      📌 {t('journey.highlights')}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {ms.highlights.map((item, i) => (
                        <span key={i} className={`rounded-lg border px-3 py-1.5 text-xs font-bold shadow-2xs ${c.tag}`}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Các liên kết hành động */}
                {(ms.fbLink || ms.links?.length) && (
                  <div className="flex flex-wrap gap-3 pt-2">
                    {ms.fbLink && (
                      <a
                        href={ms.fbLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
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
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 115.656 5.656l-1.5 1.5" />
                        </svg>
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Bên phải: Album ảnh Polaroid nghệ thuật sắp xếp lớp */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
                className="lg:col-span-7 flex justify-center items-center relative mt-10 lg:mt-0"
              >
                <div className="grid grid-cols-2 gap-6 sm:gap-8 max-w-xl w-full relative">
                  {ms.images.map((img, imgIdx) => {
                    // Trích xuất góc quay ngẫu nhiên cố định theo chỉ mục ảnh
                    const rotation = polaroidRotations[imgIdx % polaroidRotations.length];
                    
                    return (
                      <motion.button
                        key={imgIdx}
                        onClick={() => setLightboxIdx({ ms: idx, img: imgIdx })}
                        className={`bg-white p-3 pb-8 rounded-xs ${c.photoShadow} border border-stone-200/60 focus:outline-none w-full`}
                        style={{ rotate: `${rotation}deg` }}
                        whileHover={{ 
                          scale: 1.06, 
                          rotate: 0, 
                          zIndex: 50,
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                        }}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      >
                        {/* Khung ảnh chính */}
                        <div className="relative aspect-square overflow-hidden rounded-xs bg-stone-50 border border-stone-100">
                          <img
                            src={img}
                            alt={`${ms.title} - ${imgIdx + 1}`}
                            className="absolute inset-0 w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-stone-950/5 pointer-events-none" />
                        </div>
                        
                        {/* Mô phỏng chữ viết tay nhỏ dưới chân ảnh Polaroid */}
                        <div className="mt-3 text-center text-[10px] tracking-widest uppercase font-black text-stone-400 select-none">
                          VISTA • {ms.date.split('/')[2] || '2026'}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Số thứ tự chương chìm cực lớn phía sau nền */}
            <div className={`absolute bottom-4 right-6 text-[12rem] md:text-[20rem] font-black ${c.watermark} select-none pointer-events-none leading-none`}>
              {String(idx + 1).padStart(2, '0')}
            </div>
          </section>
        );
      })}

      {/* ═══════ LIGHTBOX CHẾ ĐỘ XEM ẢNH PHÓNG TO ═══════ */}
      <AnimatePresence>
        {lightboxIdx && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(15, 12, 10, 0.94)' }}
            onClick={closeLightbox}
            role="dialog"
            aria-modal="true"
          >
            {/* Nút đóng */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Nút lướt ảnh trái */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Nút lướt ảnh phải */}
            <button
              onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Khung chứa ảnh phóng lớn */}
            <motion.div
              key={`lb-${lightboxIdx.ms}-${lightboxIdx.img}`}
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative max-w-[85vw] max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={MILESTONES[lightboxIdx.ms].images[lightboxIdx.img]}
                alt="Phóng to"
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <p className="text-sm text-stone-300 font-semibold tracking-wide">
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