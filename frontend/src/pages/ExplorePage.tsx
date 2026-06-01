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

// Tinh chỉnh bảng màu Sierra Blue dịu, mượt mà, cao cấp
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
      {/* Nền tổng thể xanh xám nhạt dịu mát */}
      <div className="min-h-screen bg-[#d2ebfc] text-slate-800 antialiased selection:bg-sky-600 selection:text-white">
        
        <header className="relative max-w-7xl px-4 pt-3 md:pt-6 sm:px-6 lg:px-8">
          {/* Header giữ nguyên */}
        </header>
       
        <main className="relative w-full max-w-7xl mx-auto flex flex-col gap-5 p-4 md:p-8 py-12 md:py-16 overflow-hidden">
          {services.map((svc, index) => {
            const ac = accentMap[svc.accent];
            const isActive = activeIndex === index;
            const isInternal = svc.href.startsWith('/');

            const commonProps = {
              layout: true,
              // KHẮC PHỤC: Bo viền nhẹ nhàng, đổ bóng Slate dịu mềm không bị gắt trắng
              className: "relative block w-full overflow-hidden rounded-2xl cursor-pointer select-none border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(148,163,184,0.15)] bg-slate-100 transition-all duration-500 group focus-visible:ring-2 focus-visible:ring-sky-500 focus:outline-none",
              style: {
                height: isActive ? '320px' : '250px',
                borderColor: isActive ? ac.line : 'rgba(148, 163, 184, 0.3)',
                boxShadow: isActive ? `0 20px 40px -12px ${ac.glow}` : 'none',
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
                {/* Ảnh nền: KHẮC PHỤC xử lý ảnh trong trẻo, hạ nhẹ độ sáng tự nhiên, không dùng filter chói */}
                <img
                  src={svc.image}
                  alt={svc.title}
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.01]"
                  style={{
                    filter: isActive ? 'brightness(0.75)' : 'brightness(0.85)',
                    objectPosition: 'center 50%',
                  }}
                  loading="lazy"
                />

                {/* KHẮC PHỤC: Xoá bỏ hoàn toàn mảng trắng sương mù gây chói. Thay bằng một lớp phủ tối mờ cực nhẹ ở góc trái giúp chữ hiển thị siêu sắc nét trên mọi loại ảnh */}
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
                      layoutId="neonLineExplore"
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

                {/* Khối chữ: Đổi toàn bộ chữ sang Tone Trắng (White) và Slate sáng để tương phản hoàn hảo trên nền ảnh mới */}
                <div className="absolute inset-0 z-10 flex flex-col md:grid md:grid-cols-12 items-start md:items-center p-6 md:px-14 h-full transition-all duration-300">
                  
                  {/* Cột trái: Index & Tiêu đề */}
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
                        {svc.subtitle}
                      </p>
                      <h3 className="font-black text-white leading-tight tracking-wide uppercase text-xl sm:text-2xl md:text-3xl truncate drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                        {svc.title}
                      </h3>
                    </div>
                  </div>

                  {/* Cột giữa: Nhãn Tag công nghệ */}
                  <div className="md:col-span-2 hidden md:flex justify-start pl-4">
                    <div
                      className="text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded border border-white/20 backdrop-blur-md bg-white/10 text-white transition-all duration-300 shadow-sm"
                      style={{ opacity: isActive ? 1 : 0 }}
                    >
                      {svc.accent === 'violet' ? 'Interactive' : svc.accent === 'sky' ? 'Audio' : 'Media'}
                    </div>
                  </div>

                  {/* Cột phải: Mô tả chi tiết */}
                  <div className="md:col-span-5 w-full mt-3 md:mt-0 flex flex-col justify-center items-start md:pl-6">
                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="w-full"
                        >
                          <p className="text-sm text-slate-100 leading-relaxed max-w-xl font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
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