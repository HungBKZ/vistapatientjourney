import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

type ServiceCard = {
  title: string;
  subtitle: string;
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

export default function ExplorePage() {
  const { t } = useLanguage();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const services = useMemo<ServiceCard[]>(
    () => [
      {
        title: t('explore.quiz.title'),
        subtitle: t('explore.quiz.subtitle'),
        description: t('explore.quiz.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770313620/VDZ08714_cxcixk.jpg',
        href: '/quiz',
        accent: 'violet',
      },
      {
        title: t('explore.podcast.title'),
        subtitle: t('explore.podcast.subtitle'),
        description: t('explore.podcast.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770313896/images_5_f9s2t4.jpg',
        href: '/podcast',
        accent: 'sky',
      },
      {
        title: t('explore.video.title'),
        subtitle: t('explore.video.subtitle'),
        description: t('explore.video.description'),
        image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770313972/VDZ08640_rtfyh2.jpg',
        href: '/video',
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
        
      {/* ── Header Section ── */}
        <header className="relative max-w-7xl px-4 pt-3 md:pt-6 sm:px-6 lg:px-8">
          
        </header>
       
        {/* ── Horizontal Accordion Section ── */}
        <main className="relative w-full max-w-7xl mx-auto flex flex-col gap-5 p-4 md:p-8 py-12 md:py-16 overflow-hidden">
          {services.map((svc, index) => {
            const ac = accentMap[svc.accent];
            const isActive = activeIndex === index;
            const isInternal = svc.href.startsWith('/');

            const commonProps = {
              layout: true,
              className: "relative block w-full overflow-hidden rounded-2xl cursor-pointer select-none border transition-all duration-500 group focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090b] focus:outline-none",
              style: {
                // Đã tăng chiều cao lúc chưa hover từ 110px lên 140px giúp card thoáng rộng hơn
                height: isActive ? '320px' : '250px',
                borderColor: isActive ? ac.line : 'rgba(255,255,255,0.06)',
                boxShadow: isActive ? `0 10px 40px -10px ${ac.glow}` : 'none',
              },
              onClick: (e: React.MouseEvent) => {
                if (!isActive && typeof window !== 'undefined' && window.innerWidth >= 768) {
                  e.preventDefault();
                  setActiveIndex(index);
                }
              },
              onMouseEnter: () => setActiveIndex(index),
              onMouseLeave: () => setActiveIndex(null),
              onFocus: () => setActiveIndex(index),
              onBlur: () => setActiveIndex(null),
              tabIndex: 0,
            };

            const renderContent = () => (
              <>
                {/* Ảnh nền */}
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.02]"
                  style={{
                    filter: isActive
                      ? 'brightness(0.55) saturate(1.1) contrast(1.05)'
                      : 'brightness(0.25) saturate(0.7)',
                    objectPosition: 'center 50%', // Đưa trọng tâm tiêu cự ảnh vào giữa
                  }}
                  loading="lazy"
                />

                {/* Lớp phủ gradient màu phim */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent transition-all duration-500 pointer-events-none ${
                    isActive ? `bg-gradient-to-r ${ac.bgGradient}` : ''
                  }`}
                />

                {/* Neon Border góc trái */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="neonLineExplore"
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

                {/* Toàn bộ chữ nội dung bên trong */}
                <div className="absolute inset-0 z-10 flex flex-col md:grid md:grid-cols-12 items-start md:items-center p-6 md:px-12 h-full transition-all duration-300">
                  
                  {/* Cột trái: Index & Tiêu đề */}
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
                        {svc.subtitle}
                      </p>
                      <h3 className="font-extrabold text-white leading-tight tracking-wide uppercase text-lg sm:text-xl md:text-2xl truncate drop-shadow-md">
                        {svc.title}
                      </h3>
                    </div>
                  </div>

                  {/* Cột giữa: Nhãn Tag công nghệ */}
                  <div className="md:col-span-2 hidden md:flex justify-start pl-4">
                    <div
                      className="text-[9px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded border border-white/10 backdrop-blur-md bg-black/40 text-white/80 transition-all duration-300"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      {svc.accent === 'violet' ? 'Interactive' : svc.accent === 'sky' ? 'Audio' : 'Media'}
                    </div>
                  </div>

                  {/* Cột phải: Khối mô tả chi tiết */}
                  <div className="md:col-span-5 w-full mt-3 md:mt-0 flex flex-col justify-center items-start md:pl-6">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="w-full"
                        >
                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-xl font-normal">
                            {svc.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </>
            );

            return isInternal ? (
              <motion.a as={Link} key={svc.title} to={svc.href} {...(commonProps as any)}>
                {renderContent()}
              </motion.a>
            ) : (
              <motion.a key={svc.title} href={svc.href} target="_blank" rel="noopener noreferrer" {...commonProps}>
                {renderContent()}
              </motion.a>
            );
          })}
        </main>
      </div>
    </MotionConfig>
  );
}