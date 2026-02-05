import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';

type ExploreItem = {
  id: 'quiz' | 'podcast' | 'video';
  title: string;
  subtitle: string;
  description: string;
  path: string;
  image: string;
  accent: string;
};

const items: ExploreItem[] = [
  {
    id: 'quiz',
    title: 'Quiz',
    subtitle: 'Kiểm tra kiến thức',
    description: 'Thử thách nhanh với các câu hỏi về sức khỏe mắt',
    path: '/quiz',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770313620/VDZ08714_cxcixk.jpg',
    accent: '#f59e0b',
  },
  {
    id: 'podcast',
    title: 'Podcast',
    subtitle: 'Lắng nghe chuyên gia',
    description: 'Nghe kiến thức dễ vào, mọi lúc mọi nơi',
    path: '/podcast',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770313896/images_5_f9s2t4.jpg',
    accent: '#8b5cf6',
  },
  {
    id: 'video',
    title: 'Video',
    subtitle: 'Học qua hình ảnh',
    description: 'Xem hướng dẫn trực quan và dễ thực hành',
    path: '/video',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770313972/VDZ08640_rtfyh2.jpg',
    accent: '#06b6d4',
  },
];

export default function ExplorePage() {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const clipPaths = useMemo(
    () =>
      [
        'polygon(0 0, 92% 0, 80% 100%, 0 100%)',
        'polygon(12% 0, 92% 0, 80% 100%, 0 100%)',
        'polygon(12% 0, 100% 0, 100% 100%, 0 100%)',
      ] as const,
    []
  );

  const bgStyle = useMemo(
    () => ({
      backgroundImage:
        'radial-gradient(1000px circle at 20% 0%, rgba(255,255,255,0.08), transparent 55%), radial-gradient(900px circle at 80% 30%, rgba(255,255,255,0.06), transparent 55%), linear-gradient(to bottom right, #050505, #0b0b0b 40%, #050505)',
    }),
    []
  );

  const go = (path: string) => navigate(path);

  return (
    <div className="min-h-[calc(100svh-5rem)] pt-28 md:pt-32 text-white relative overflow-hidden" style={bgStyle}>
      {/* Static subtle grain */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.03), rgba(255,255,255,0.03) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.02) 1px, transparent 1px, transparent 7px)',
        }}
      />

      {/* One-frame panels */}
      <section
        className="relative w-full"
        onMouseLeave={() => setActiveIndex(null)}
      >
        <div className="mx-auto max-w-7xl px-4 mb-6 md:mb-8">
          <div className="text-xs uppercase tracking-[0.28em] text-white/60">Kiến thức</div>
          <div className="mt-2 text-2xl md:text-4xl font-semibold tracking-tight text-white/95">
            Chọn chế độ để bắt đầu
          </div>
        </div>

        {/* Full-bleed frame (stretches to both sides) */}
        <div className="w-screen relative left-1/2 -translate-x-1/2">
          <div
            className="relative overflow-hidden md:rounded-3xl border border-white/10 bg-black/30"
            style={{
              height: 'calc(100svh - 5rem - 10.25rem)',
              minHeight: 520,
            }}
          >
          <div className="absolute inset-0">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.45) 100%)' }} />
            
            {/* Liveness: Floating particles */}
            <div className="absolute inset-0 opacity-30 pointer-events-none overflow-hidden">
               <div className="particle-layer" />
               <style>{`
                 .particle-layer {
                   position: absolute;
                   top: -50%;
                   left: -50%;
                   width: 200%;
                   height: 200%;
                   background-image: radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, transparent 1px);
                   background-size: 50px 50px;
                   background-position: 0 0, 25px 25px;
                   opacity: 0.2;
                   animation: floatParticles 60s linear infinite;
                 }
                 @keyframes floatParticles {
                   0% { transform: rotate(0deg); }
                   100% { transform: rotate(360deg); }
                 }
               `}</style>
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col md:flex-row">
            {items.map((item, index) => {
              const isActive = activeIndex === index;
              const hasActive = activeIndex !== null;

              return (
                <div
                  key={item.id}
                  className="relative transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-[flex]"
                  style={{
                    flex: hasActive ? (isActive ? '1.8' : '0.8') : '1',
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                >
                  {/* Desktop diagonal cut */}
                  <div
                    className="absolute inset-0 hidden md:block"
                    style={{
                      clipPath: clipPaths[index],
                    }}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className={
                          'w-full h-full object-cover transition-transform duration-700 ease-out ' +
                          (isActive ? 'scale-[1.06]' : 'scale-[1.01]')
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
                      <div
                        className={
                          'absolute inset-0 transition-opacity duration-500 ' +
                          (isActive ? 'opacity-100' : 'opacity-0')
                        }
                        style={{
                          background: `radial-gradient(680px circle at 50% 30%, ${item.accent}22, transparent 55%)`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Mobile (no clip) */}
                  <div className="absolute inset-0 md:hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/15" />
                  </div>

                  {/* Click layer */}
                  <button
                    type="button"
                    onClick={() => go(item.path)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') go(item.path);
                    }}
                    className="absolute inset-0 text-left focus:outline-none"
                    aria-label={`Mở ${item.title}`}
                  >
                    <div
                      className={
                        'absolute bottom-0 left-0 right-0 p-6 md:p-8 transition-transform duration-500 ' +
                        (isActive ? 'translate-y-0' : 'translate-y-2')
                      }
                    >
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <div
                            className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase"
                            style={{ color: isActive ? 'white' : 'rgba(255,255,255,0.75)' }}
                          >
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: item.accent, boxShadow: `0 0 22px ${item.accent}66` }}
                            />
                            {item.subtitle}
                          </div>
                          <div className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow">
                            {item.title}
                          </div>
                          <div className="mt-3 max-w-[44ch] text-white/80 leading-relaxed">
                            {item.description}
                          </div>
                        </div>

                        <div className="shrink-0 hidden md:flex items-center gap-2 text-white/80">
                          <span className="text-xs uppercase tracking-[0.22em]">Open</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Outline */}
                  <div
                    className={
                      'absolute inset-0 pointer-events-none transition-opacity duration-300 ' +
                      (isActive ? 'opacity-100' : 'opacity-0')
                    }
                    style={{
                      boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.14), 0 0 50px ${item.accent}22`,
                    }}
                  />
                </div>
              );
            })}
          </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 mt-6 text-center text-sm text-white/55">
          {!prefersReducedMotion ? 'Di chuột qua từng phần để xem nổi bật. Bấm để mở.' : 'Bấm để mở.'}
        </div>
      </section>
    </div>
  );
}
