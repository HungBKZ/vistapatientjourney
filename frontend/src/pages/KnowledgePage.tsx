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

// ĐỒNG BỘ: Tinh chỉnh lại mã màu accent chuẩn sang trọng và dịu mát giống ExplorePage
const accentMap = {
  violet: {
    line: '#6366f1',
    sub: '#4f46e5',
    glow: 'rgba(99, 102, 241, 0.15)',
    bgGradient: 'from-slate-900/80 via-slate-900/40 to-transparent',
  },
  sky: {
    line: '#0EA5E9', 
    sub: '#0284c7',
    glow: 'rgba(14, 165, 233, 0.2)',
    bgGradient: 'from-slate-900/80 via-slate-900/40 to-transparent',
  },
  emerald: {
    line: '#10B981',
    sub: '#059669',
    glow: 'rgba(16, 185, 129, 0.15)',
    bgGradient: 'from-slate-900/80 via-slate-900/40 to-transparent',
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
        href: '/virtual-try-on',
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
      {/* ĐỒNG BỘ: Nền màu xanh da trời nhạt trong trẻo cực đẹp */}
      <div className="min-h-screen bg-[#e0f2fe] text-slate-800 antialiased selection:bg-sky-600 selection:text-white">
        
        {/* ── Horizontal Accordion Section ── */}
        <section className="relative w-full max-w-7xl mx-auto flex flex-col gap-5 p-4 md:p-8 py-16 md:py-24 overflow-hidden">
          {experiences.map((exp, index) => {
            const ac = accentMap[exp.accent];
            const isActive = activeIndex === index;

            const renderContent = () => (
              <>
                {/* Ảnh nền: Kiểm soát độ sáng, xử lý trong trẻo không bị đục chói */}
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01]"
                  style={{
                    filter: isActive ? 'brightness(0.75)' : 'brightness(0.85)',
                    objectPosition: 'center 35%',
                  }}
                  loading="lazy"
                />

                {/* ĐỒNG BỘ: Thay thế mảng tối xám cũ bằng dải chuyển sắc mịn màng, triệt tiêu loá mắt */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 via-slate-900/10 to-transparent pointer-events-none mix-blend-multiply" />

                {/* Lớp phủ động khi Hover/Active */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-r ${ac.bgGradient} opacity-0 transition-opacity duration-500 pointer-events-none ${
                    isActive ? 'opacity-100' : ''
                  }`} 
                />

                {/* Neon Border góc trái */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="neonLineHorizontal"
                      className="absolute top-0 bottom-0 left-0 w-[4px] pointer-events-none"
                      style={{
                        background: ac.line,
                        boxShadow: `0 0 12px ${ac.line}`,
                      }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      exit={{ scaleY: 0 }}
                    />
                  )}
                </AnimatePresence>

                {/* Khối chữ: Ép sang tone Trắng gánh tương phản trên ảnh nền */}
                <div className="absolute inset-0 z-10 flex flex-col md:grid md:grid-cols-12 items-start md:items-center p-6 md:px-14 h-full transition-all duration-300">
                  
                  {/* Cột trái: Số thứ tự, Subtitle & Tiêu đề chính */}
                  <div className="md:col-span-5 flex items-center gap-6 w-full">
                    <div
                      className="text-xl font-mono font-black transition-colors duration-300 tracking-wider flex-shrink-0"
                      style={{ color: isActive ? ac.line : 'rgba(255, 255, 255, 0.6)' }}
                    >
                      0{index + 1}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <p
                        className="text-[11px] font-black tracking-widest uppercase transition-opacity duration-300"
                        style={{
                          color: isActive ? '#ffffff' : ac.line,
                        }}
                      >
                        {exp.subtitle}
                      </p>
                      <h2 className="font-black text-white leading-tight tracking-wide uppercase text-xl sm:text-2xl md:text-3xl truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                        {exp.title}
                      </h2>
                    </div>
                  </div>

                  {/* Cột giữa: Nhãn Tag công nghệ */}
                  <div className="md:col-span-2 hidden md:flex justify-start pl-4">
                    <div
                      className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded border border-white/20 backdrop-blur-md bg-white/10 text-white transition-all duration-300 shadow-sm"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      {exp.tag}
                    </div>
                  </div>

                  {/* Cột phải: Khối mô tả và nút bấm CTA khi active */}
                  <div className="md:col-span-5 w-full mt-3 md:mt-0 flex flex-col justify-center items-start md:pl-6">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="space-y-4 w-full"
                        >
                          <p className="text-sm text-slate-100 leading-relaxed max-w-xl font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                            {exp.description}
                          </p>

                          <div
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-bold tracking-widest text-slate-900 bg-white uppercase shadow-md transition-transform active:scale-95"
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
              </>
            );

            return (
              <Link
                key={exp.title}
                to={exp.href}
                className="relative block w-full overflow-hidden rounded-2xl cursor-pointer select-none border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.15)] bg-slate-100 transition-all duration-500 group focus-visible:ring-2 focus-visible:ring-sky-500 focus:outline-none"
                style={{
                  height: isActive ? '320px' : '250px',
                  borderColor: isActive ? ac.line : 'rgba(148, 163, 184, 0.3)',
                  boxShadow: isActive ? `0 20px 40px -12px ${ac.glow}` : 'none',
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
                {renderContent()}
              </Link>
            );
          })}
        </section>

        {/* ── Bottom CTA Section ── */}
        <section className="relative py-20 px-4 md:px-6">
          <div
            className="max-w-5xl mx-auto rounded-3xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 px-8 py-10 md:p-12 relative overflow-hidden group border border-sky-100 bg-white/70 backdrop-blur-md shadow-[0_20px_50px_-20px_rgba(148,163,184,0.3)]"
          >
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] tracking-[0.3em] uppercase text-sky-600 font-black">
                Vista Camera
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {t('knowledge.bottomTitle')}
              </h2>
              <p className="text-sm text-slate-600 max-w-lg leading-relaxed font-semibold">
                {t('knowledge.bottomDescription')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0 relative z-10">
              <Link
                to="/virtual-try-on"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-sky-600 text-white text-sm font-bold transition-all duration-300 hover:bg-sky-700 active:scale-[0.98] w-full sm:w-auto shadow-md shadow-sky-600/20"
              >
                {t('knowledge.bottomCta')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-bold text-slate-700 hover:text-slate-900 border border-slate-200 bg-white/50 hover:bg-white transition-all duration-200 w-full sm:w-auto text-center shadow-sm"
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