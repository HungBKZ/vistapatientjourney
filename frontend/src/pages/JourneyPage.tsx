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
  accent: 'amber' | 'rose' | 'teal';
  highlights: string[];
};

/* ─── warm accent palette ─── */
const warmPalette = {
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    dot: 'bg-amber-400',
    ring: 'ring-amber-300/50',
    pill: 'bg-amber-100 text-amber-700 border-amber-200',
    text: 'text-amber-600',
    quote: 'border-amber-300 bg-amber-50/80',
    tag: 'bg-amber-100/80 text-amber-700 border-amber-200/60',
    photoShadow: 'shadow-amber-200/40',
    gradient: 'from-amber-200 via-amber-100 to-orange-100',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    dot: 'bg-rose-400',
    ring: 'ring-rose-300/50',
    pill: 'bg-rose-100 text-rose-700 border-rose-200',
    text: 'text-rose-600',
    quote: 'border-rose-300 bg-rose-50/80',
    tag: 'bg-rose-100/80 text-rose-700 border-rose-200/60',
    photoShadow: 'shadow-rose-200/40',
    gradient: 'from-rose-200 via-pink-100 to-rose-100',
  },
  teal: {
    bg: 'bg-teal-50',
    border: 'border-teal-200',
    dot: 'bg-teal-400',
    ring: 'ring-teal-300/50',
    pill: 'bg-teal-100 text-teal-700 border-teal-200',
    text: 'text-teal-600',
    quote: 'border-teal-300 bg-teal-50/80',
    tag: 'bg-teal-100/80 text-teal-700 border-teal-200/60',
    photoShadow: 'shadow-teal-200/40',
    gradient: 'from-teal-200 via-cyan-100 to-teal-100',
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

/* ─── data ─── */
const MILESTONES: Milestone[] = [
  {
    id: 'exhibition',
    chapter: 'Chương 01',
    date: '2024',
    title: 'Triển lãm mắt lần đầu',
    subtitle: 'Bước đầu tiên cùng nhau',
    quote: 'Hồi hộp, bỡ ngỡ nhưng không ai bỏ cuộc.',
    description:
      'Những ngày đầu tiên khi nhóm bắt tay vào làm triển lãm mắt. Tinh thần "cùng nhau làm cho ra một trải nghiệm thật tử tế" đã gắn kết tụi mình từ đây.',
    images: [
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/a_xnxud3.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710325/z7187641781717_35e4a88e7c6e52e45478bc4761b36cbf_uwiuar.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/d_cuvmbv.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/c_kxm0nd.jpg',
    ],
    accent: 'amber',
    highlights: ['Khởi đầu', 'Cộng tác', 'Trải nghiệm thực tế'],
  },
  {
    id: 'seminar',
    chapter: 'Chương 02',
    date: '2025',
    title: 'Hội thảo "Phương pháp xoá cận nào phù hợp với bạn"',
    subtitle: 'Tại Bệnh viện Mắt VISI TP.HCM',
    quote: 'Nghe chuyên gia chia sẻ, tụi mình hiểu thêm nhu cầu thực sự.',
    description:
      'VISTA tham dự buổi hội thảo chuyên đề với sự chia sẻ chuyên môn từ diễn giả: BS CKII Trần Bá Kiền. Đây là khoảnh khắc tụi mình học thêm, hiểu sâu hơn để làm tốt hơn.',
    images: [
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316801/617288450_122119025229062997_6837418133007770989_n_dtfvs0.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316796/625082181_122119025301062997_6476179986474380358_n_sknls1.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316796/624693981_122119025295062997_3091587328736484852_n_e0qyvt.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316797/625104173_122119025259062997_6441979336655487674_n_etbvcl.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316798/624494951_122119025163062997_1900920309973079511_n_jwqt0g.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316799/623008038_122119025115062997_1290174103381862566_n_qdowzu.jpg',
    ],
    accent: 'rose',
    highlights: ['Chuyên môn', 'Lắng nghe', 'Học hỏi'],
  },
  {
    id: 'technology-handover',
    chapter: 'Chương 03',
    date: '2025',
    title: 'Bàn giao công nghệ trải nghiệm thị giác',
    subtitle: 'Cho Bệnh viện VISI',
    quote: 'Từ ý tưởng đến thực tế — khoảnh khắc rất thật.',
    description:
      'Cột mốc bàn giao công nghệ "Trải nghiệm thị giác" cho Bệnh viện VISI. Từ ý tưởng và những buổi làm việc đầu tiên, tụi mình đi đến một khoảnh khắc tự hào: công nghệ được mang vào môi trường thực tế.',
    images: [
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316668/625150519_122119516461062997_3033367744691987602_n_socdyf.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316668/627256193_122119516365062997_6305196475481639092_n_fnxod9.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316668/627797492_122119516479062997_8235468441699454425_n_yeewjr.jpg',
      'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316668/626784497_122119516335062997_710351683700892706_n_wsoxsy.jpg',
    ],
    accent: 'teal',
    highlights: ['Hợp tác', 'Ứng dụng thực tiễn', 'Tự hào'],
  },
];

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function JourneyPage() {
  const [lightboxIdx, setLightboxIdx] = useState<{ ms: number; img: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /* parallax */
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const heroY = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, -120]), { stiffness: 80, damping: 25 });
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.96]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0]);

  /* progress bar */
  const { scrollYProgress: pageProgress } = useScroll();
  const scaleX = useSpring(pageProgress, { stiffness: 100, damping: 30 });

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

  const totalImages = useMemo(() => MILESTONES.reduce((s, m) => s + m.images.length, 0), []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* ── Scroll progress ── */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] z-50 origin-left bg-blue-600"
        style={{ scaleX }}
      />

      {/* ═══════ HERO ═══════ */}
      <motion.section
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="relative pt-32 md:pt-40 pb-16 px-6 md:px-10 max-w-5xl mx-auto"
      >
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2.5 rounded-full bg-blue-50 px-5 py-2.5 text-sm text-blue-700 font-semibold"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-base"
            >
              ✨
            </motion.span>
            Hành trình vẫn đang tiếp tục…
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-5xl md:text-6xl font-extrabold leading-tight text-gray-900"
          >
            Hành trình của
            <br />
            <span className="text-blue-600">
              nhóm VISTA
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto font-normal"
          >
            Từ những ngày đầu triển lãm, qua hội thảo chuyên môn, đến bàn giao công nghệ — mỗi bước là một kỷ niệm đáng nhớ.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-3 justify-center"
          >
            <a
              href="#chapters"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
            >
              Xem các cột mốc
              <motion.span
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                ↓
              </motion.span>
            </a>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
            >
              Khám phá VISTA
            </Link>
          </motion.div>
        </div>

        {/* Journey summary - more natural */}
        <Reveal delay={0.4} className="mt-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-center text-base text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">{MILESTONES.length} cột mốc quan trọng</span> với hơn{' '}
              <span className="font-semibold text-gray-900">{totalImages} khoảnh khắc</span> đáng nhớ,{' '}
              cùng sự hợp tác của{' '}
              <span className="font-semibold text-blue-600">Bệnh viện VISI</span> và toàn bộ thành viên nhóm VISTA.
            </p>
          </div>
        </Reveal>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-14 flex flex-col items-center gap-2"
        >
          <span className="text-sm text-gray-500 font-medium">Cuộn xuống để xem thêm</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-gray-400"
          >
            ↓
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════ CHAPTERS ═══════ */}
      <section id="chapters" className="relative px-6 md:px-10 py-16 bg-gray-50">
        {/* Timeline line */}
        <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto space-y-28 md:space-y-36">
          {MILESTONES.map((ms, idx) => {
            const c = warmPalette[ms.accent];
            const isEven = idx % 2 === 0;
            const imgCols = ms.images.length === 6 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2';

            return (
              <div key={ms.id} className="relative">
                {/* Timeline dot */}
                <div className="hidden lg:flex absolute left-1/2 top-10 -translate-x-1/2 z-20 items-center justify-center">
                  <Reveal>
                    <div className="relative">
                      <motion.div
                        className={`h-6 w-6 rounded-full ${c.dot} ring-4 ${c.ring} shadow-lg`}
                        whileInView={{ scale: [0, 1.3, 1] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </Reveal>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                  {/* ─── Text side ─── */}
                  <div
                    className={isEven ? 'lg:pr-16 lg:text-right' : 'lg:order-2 lg:pl-16'}
                  >
                    {/* Chapter pill */}
                    <Reveal delay={0.05}>
                      <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${c.pill} mb-4`}>
                        {ms.chapter}
                        <span>•</span>
                        {ms.date}
                      </div>
                    </Reveal>

                    <Reveal delay={0.12}>
                      <h3 className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
                        {ms.title}
                      </h3>
                    </Reveal>

                    <Reveal delay={0.18}>
                      <p className={`mt-3 text-lg font-semibold ${c.text}`}>
                        {ms.subtitle}
                      </p>
                    </Reveal>

                    <Reveal delay={0.24}>
                      <p className="mt-4 text-base text-gray-700 leading-relaxed">
                        {ms.description}
                      </p>
                    </Reveal>

                    {/* Quote */}
                    <Reveal delay={0.3}>
                      <div className={`mt-6 rounded-lg border-l-4 ${c.quote} p-4`}>
                        <p className="text-gray-700 italic text-base leading-relaxed">
                          "{ms.quote}"
                        </p>
                        <p className="mt-2 text-sm text-gray-500 font-medium">— Nhóm VISTA</p>
                      </div>
                    </Reveal>

                    {/* Tags */}
                    <Reveal delay={0.35}>
                      <div className={`mt-5 flex flex-wrap gap-2 ${isEven ? 'lg:justify-end' : ''}`}>
                        {ms.highlights.map((t) => (
                          <span
                            key={t}
                            className={`rounded-md border px-3 py-1.5 text-sm font-medium ${c.tag}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </Reveal>
                  </div>

                  {/* ─── Gallery ─── */}
                  <div className={isEven ? 'lg:order-2 lg:pl-16' : 'lg:pr-16'}>
                    <Reveal delay={0.1}>
                      <div className="relative rounded-2xl bg-white border border-gray-200 p-4 md:p-5 shadow-sm">
                        <StaggerContainer className={`grid gap-3 ${imgCols}`} stagger={0.08}>
                          {ms.images.map((img, imgIdx) => (
                            <motion.button
                              key={imgIdx}
                              variants={polaroidReveal}
                              onClick={() => setLightboxIdx({ ms: idx, img: imgIdx })}
                              className="group relative rounded-lg overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                              whileHover={{ y: -4, scale: 1.02 }}
                              transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                              <div className="relative aspect-square">
                                <img
                                  src={img}
                                  alt={`${ms.title} - ${imgIdx + 1}`}
                                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                                  loading="lazy"
                                  decoding="async"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                                  <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </StaggerContainer>
                      </div>
                    </Reveal>
                  </div>
                </div>

                {/* Chapter divider (mobile) */}
                {idx < MILESTONES.length - 1 && (
                  <Reveal className="lg:hidden mt-16 flex justify-center">
                    <div className="h-16 w-px bg-gray-200" />
                  </Reveal>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════ "To be continued" ═══════ */}
      <section className="relative px-6 md:px-10 py-20 bg-white">
        <Reveal>
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-12 text-center shadow-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 180, damping: 15 }}
                className="mb-5 text-5xl"
              >
                🚀
              </motion.div>

              <Reveal>
                <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold mb-3">Hành trình vẫn tiếp tục</p>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Câu chuyện chưa kết thúc
                </h3>
                <p className="mt-4 text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  Nhóm VISTA vẫn đang tiếp tục bước đi, vẫn đang làm những điều ý nghĩa và tạo ra những kỷ niệm mới. Nếu bạn muốn tìm hiểu thêm về các dịch vụ và kiến thức chăm sóc mắt…
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-8 flex flex-wrap gap-3 justify-center">
                  <Link
                    to="/explore"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 active:scale-[0.98]"
                  >
                    Khám phá dịch vụ
                  </Link>
                  <Link
                    to="/knowledge"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
                  >
                    Xem kiến thức
                  </Link>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
                  >
                    Trang chủ
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </section>

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
