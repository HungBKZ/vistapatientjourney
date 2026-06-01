import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

type Experience = {
  title: string;
  subtitle: string;
  tag: string;
  description: string;
  image: string;
  href: string;
  accent: 'violet' | 'sky' | 'emerald';
};

const accentMap = {
  violet: {
    line: '#a78bfa',
    sub: '#c084fc',
    glow: 'rgba(167, 139, 250, 0.25)',
    bgGradient: 'from-violet-950/40 via-violet-900/10 to-transparent',
  },
  sky: {
    line: '#22d3ee',
    sub: '#67e8f9',
    glow: 'rgba(34, 211, 238, 0.25)',
    bgGradient: 'from-cyan-950/40 via-cyan-900/10 to-transparent',
  },
  emerald: {
    line: '#34d399',
    sub: '#6ee7b7',
    glow: 'rgba(52, 211, 153, 0.25)',
    bgGradient: 'from-emerald-950/40 via-emerald-900/10 to-transparent',
  },
};

export default function KnowledgePage() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const experiences: Experience[] = useMemo(
    () => [
      {
        title: t('knowledge.virtualTryOn.title'),
        subtitle: t('knowledge.virtualTryOn.subtitle'),
        tag: 'AR Technology',
        description: t('knowledge.virtualTryOn.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770310445/VDZ08622_maluun.jpg',
        href: 'https://vista-camera-eyes.vercel.app/',
        accent: 'violet',
      },
      {
        title: t('knowledge.visualSimulation.title'),
        subtitle: t('knowledge.visualSimulation.subtitle'),
        tag: 'Eye Science',
        description: t('knowledge.visualSimulation.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770310518/625361590_122119516413062997_1303514405670367212_n_wzuecd.jpg',
        href: 'https://vista-camera-eyes.vercel.app/eye-simulation.html',
        accent: 'sky',
      },
      {
        title: t('knowledge.visionTest.title'),
        subtitle: t('knowledge.visionTest.subtitle'),
        tag: 'Health Check',
        description: t('knowledge.visionTest.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770310767/623446721_122119025241062997_8088043366359299100_n_cr5mod.jpg',
        href: 'https://vista-camera-eyes.vercel.app/',
        accent: 'emerald',
      },
    ],
    [t]
  );

  return (
    <MotionConfig
      reducedMotion={prefersReducedMotion ? 'always' : 'never'}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
    >
      <div className="min-h-screen bg-[#09090b] text-white antialiased selection:bg-white selection:text-black">
        
        {/* ── Horizontal Accordion Section (Các dòng ngang giãn nở linh hoạt) ── */}
        <section className="relative w-full max-w-7xl mx-auto flex flex-col gap-5 p-4 md:p-8 py-16 md:py-24 overflow-hidden">
          {experiences.map((exp, index) => {
            const ac = accentMap[exp.accent];
            const isActive = activeIndex === index;

            return (
              <motion.a
                layout
                key={exp.title}
                href={exp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block w-full overflow-hidden rounded-2xl cursor-pointer select-none border transition-all duration-500 group focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] focus:outline-none"
                style={{
                  // Thay đổi chiều cao linh hoạt trên Desktop thay vì thay đổi chiều rộng như trước
                  height: isActive ? '320px' : '230px',
                  borderColor: isActive ? ac.line : 'rgba(255,255,255,0.06)',
                  boxShadow: isActive ? `0 10px 40px -10px ${ac.glow}` : 'none',
                }}
                onClick={(e) => {
                  if (!isActive && typeof window !== 'undefined' && window.innerWidth >= 768) {
                    e.preventDefault();
                    setActiveIndex(index);
                  }
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                tabIndex={0}
              >
                {/* Ảnh nền */}
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]"
                  style={{
                    filter: isActive
                      ? 'brightness(0.55) saturate(1.1) contrast(1.05)' 
                      : 'brightness(0.25) saturate(0.7)',
                    objectPosition: 'center 35%',
                  }}
                  loading="lazy"
                />

                {/* Lớp phủ phim màu chuyển sắc */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent transition-all duration-500 pointer-events-none ${
                    isActive ? `bg-gradient-to-r ${ac.bgGradient}` : ''
                  }`} 
                />

                {/* Neon Border phía bên trái (Chỉ báo ngang) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="neonLineHorizontal"
                      className="absolute top-0 bottom-0 left-0 w-[4px] pointer-events-none"
                      style={{
                        background: ac.line,
                        boxShadow: `0 0 16px ${ac.line}`,
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                    />
                  )}
                </AnimatePresence>

                {/* Nội dung bên trong chia Grid ngang thông minh */}
                <div className="absolute inset-0 z-10 flex flex-col md:grid md:grid-cols-12 items-start md:items-center p-6 md:px-12 pointer-events-none h-full transition-all duration-300">
                  
                  {/* Cột trái: Số thứ tự, Subtitle & Tiêu đề chính */}
                  <div className="md:col-span-5 flex items-center gap-6 w-full">
                    <div
                      className="text-lg font-mono transition-colors duration-300 tracking-wider flex-shrink-0"
                      style={{ color: isActive ? ac.line : 'rgba(255,255,255,0.2)' }}
                    >
                      0{index + 1}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <p
                        className="text-[9px] font-bold tracking-widest uppercase transition-opacity duration-300"
                        style={{
                          color: ac.sub,
                          opacity: isActive ? 1 : 0.6,
                        }}
                      >
                        {exp.subtitle}
                      </p>
                      <h2 className="font-extrabold text-white leading-tight tracking-wide uppercase text-lg sm:text-xl md:text-2xl truncate drop-shadow-md">
                        {exp.title}
                      </h2>
                    </div>
                  </div>

                  {/* Cột giữa: Nhãn Tag công nghệ (Ẩn khi đóng để trông gọn gàng) */}
                  <div className="md:col-span-2 hidden md:flex justify-start pl-4">
                    <div
                      className="text-[9px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded border border-white/10 backdrop-blur-md bg-black/40 text-white/80 transition-all duration-300"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      {exp.tag}
                    </div>
                  </div>

                  {/* Cột phải: Khối mô tả chi tiết và CTA khi active */}
                  <div className="md:col-span-5 w-full mt-3 md:mt-0 flex flex-col justify-center items-start md:pl-6">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="space-y-4 w-full"
                        >
                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl font-normal">
                            {exp.description}
                          </p>

                          <div
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-bold tracking-widest text-black bg-white uppercase shadow-lg transition-transform active:scale-95"
                            style={{
                              boxShadow: `0 4px 20px ${ac.glow}`,
                            }}
                          >
                            <span>{t('knowledge.cta')}</span>
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.a>
            );
          })}
        </section>

        {/* ── Bottom CTA Section ── */}
        <section className="relative py-20 px-4 md:px-6">
          <div
            className="max-w-5xl mx-auto rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 px-8 py-10 md:p-12 relative overflow-hidden group border border-white/[0.05]"
            style={{
              background: 'radial-gradient(circle at top right, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 70%), #0e0e11',
              boxShadow: '0 30px 60px -20px rgba(0,0,0,0.8)',
            }}
          >
            <div className="space-y-2">
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 font-bold">
                Vista Camera
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {t('knowledge.bottomTitle')}
              </h2>
              <p className="text-sm text-white/40 max-w-lg leading-relaxed font-normal">
                {t('knowledge.bottomDescription')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0">
              <a
                href="https://vista-camera-eyes.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-[#09090b] text-sm font-bold transition-all duration-300 hover:bg-neutral-200 active:scale-[0.98] w-full sm:w-auto shadow-xl"
              >
                {t('knowledge.bottomCta')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium text-white/70 hover:text-white border border-white/10 hover:bg-white/[0.04] transition-all duration-200 w-full sm:w-auto text-center"
              >
                {t('knowledge.backHome')}
              </Link>
            </div>
          </div>
        </section>

      </div>
    </MotionConfig>
  );
}