import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'framer-motion';

type Experience = {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  href: string;
  accent: 'violet' | 'sky' | 'emerald';
};

const experiences: Experience[] = [
  {
    title: 'Trải nghiệm mắt kính',
    subtitle: 'Virtual Try-On',
    description: 'Lựa chọn mắt kính phù hợp với gương mặt của bạn qua công nghệ AR',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770310445/VDZ08622_maluun.jpg',
    href: 'https://vista-camera-eyes.vercel.app/',
    accent: 'violet',
  },
  {
    title: 'Trải nghiệm thị giác',
    subtitle: 'Visual Simulation',
    description: 'Nhìn thế giới qua đôi mắt của người mắc các bệnh lý về mắt',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770310518/625361590_122119516413062997_1303514405670367212_n_wzuecd.jpg',
    href: 'https://vista-camera-eyes.vercel.app/eye-simulation.html',
    accent: 'sky',
  },
  {
    title: 'Kiểm tra thị lực',
    subtitle: 'Vision Test',
    description: 'Kiểm tra thị lực của đôi mắt bạn ngay tại nhà một cách nhanh chóng',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770310767/623446721_122119025241062997_8088043366359299100_n_cr5mod.jpg',
    href: 'https://vista-camera-eyes.vercel.app/',
    accent: 'emerald',
  },
];

export default function KnowledgePage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement | null>(null);
  const pointerRef = useRef({
    rafId: 0,
    hasPointer: false,
    tx: 0,
    ty: 0,
    cx: 0,
    cy: 0,
    trx: 0,
    try: 0,
    crx: 0,
    cry: 0,
  });

  const clipPaths = useMemo(
    () =>
      [
        'polygon(0 0, 92% 0, 80% 100%, 0 100%)',
        'polygon(12% 0, 92% 0, 80% 100%, 0 100%)',
        'polygon(12% 0, 100% 0, 100% 100%, 0 100%)',
      ] as const,
    []
  );

  const accent = (key: Experience['accent']) => {
    switch (key) {
      case 'violet':
        return 'bg-violet-400/80';
      case 'sky':
        return 'bg-sky-400/80';
      case 'emerald':
        return 'bg-emerald-400/80';
      default:
        return 'bg-white/60';
    }
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el || prefersReducedMotion) return;

    const setTargetsFromClient = (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const y = Math.min(Math.max(clientY - rect.top, 0), rect.height);

      const px = rect.width ? x / rect.width : 0.5;
      const py = rect.height ? y / rect.height : 0.5;
      const ry = (px - 0.5) * 8;
      const rx = (0.5 - py) * 6;

      pointerRef.current.tx = x;
      pointerRef.current.ty = y;
      pointerRef.current.trx = rx;
      pointerRef.current.try = ry;
    };

    const tick = () => {
      const c = containerRef.current;
      if (!c) return;

      const p = pointerRef.current;
      const ease = 0.15; // Faster easing = fewer frames needed
      p.cx += (p.tx - p.cx) * ease;
      p.cy += (p.ty - p.cy) * ease;
      p.crx += (p.trx - p.crx) * ease;
      p.cry += (p.try - p.cry) * ease;

      c.style.setProperty('--mx', `${Math.round(p.cx)}px`);
      c.style.setProperty('--my', `${Math.round(p.cy)}px`);
      c.style.setProperty('--rx', `${p.crx.toFixed(1)}deg`);
      c.style.setProperty('--ry', `${p.cry.toFixed(1)}deg`);

      const settled =
        Math.abs(p.tx - p.cx) < 0.5 &&
        Math.abs(p.ty - p.cy) < 0.5 &&
        Math.abs(p.trx - p.crx) < 0.05 &&
        Math.abs(p.try - p.cry) < 0.05;

      if (p.hasPointer || !settled) {
        p.rafId = window.requestAnimationFrame(tick);
      } else {
        p.rafId = 0;
      }
    };

    const ensureTicking = () => {
      if (!pointerRef.current.rafId) {
        pointerRef.current.rafId = window.requestAnimationFrame(tick);
      }
    };

    const onMove = (evt: MouseEvent) => {
      pointerRef.current.hasPointer = true;
      setTargetsFromClient(evt.clientX, evt.clientY);
      ensureTicking();
    };

    const onLeave = () => {
      pointerRef.current.hasPointer = false;
      const rect = el.getBoundingClientRect();
      pointerRef.current.tx = rect.width * 0.5;
      pointerRef.current.ty = rect.height * 0.4;
      pointerRef.current.trx = 0;
      pointerRef.current.try = 0;
      ensureTicking();
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    onLeave();

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (pointerRef.current.rafId) cancelAnimationFrame(pointerRef.current.rafId);
      pointerRef.current.rafId = 0;
    };
  }, [prefersReducedMotion]);

  return (
    <MotionConfig
      reducedMotion={prefersReducedMotion ? 'always' : 'never'}
      transition={{ type: 'tween', duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="min-h-screen bg-black text-white">
        {/* Main Interactive Section - 3 Diagonal Sections */}
        <section ref={containerRef} className="relative h-[100svh] overflow-hidden">
        {/* Subtle background treatment (less neon, more cinematic) */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 vj-grid" />
          <div className="absolute inset-0 vj-vignette" />
          <div className="absolute inset-0 vj-spotlight" />
        </div>

        <div className="relative h-full">
          <div className="absolute left-6 md:left-10 top-24 z-30 select-none">
            <div className="text-xs uppercase tracking-[0.28em] text-white/60">Knowledge</div>
            <div className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight text-white/90">
              Trải nghiệm thị giác
            </div>
          </div>

          <motion.div
            className="absolute right-6 md:right-10 top-24 z-30 text-xs text-white/60 select-none"
            animate={{ opacity: activeIndex === null ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          >
            Di chuột qua từng phần để xem chi tiết
          </motion.div>

          <div className="absolute inset-0 flex">
          {experiences.map((exp, index) => (
            <div
              key={exp.title}
              className={
                'vj-panel relative cursor-pointer focus:outline-none overflow-hidden transition-[flex] duration-300 ease-out ' +
                (index === 0 ? '' : '-ml-16 md:-ml-24')
              }
              style={{
                clipPath: clipPaths[index] ?? clipPaths[0],
                flex: activeIndex === index ? 1.7 : 1,
              }}
              tabIndex={0}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
              onTouchStart={() => setActiveIndex(index)}
              data-active={activeIndex === index ? 'true' : 'false'}
            >
              {/* Background Image */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className={
                    'w-full h-full object-cover transition-transform duration-300 ease-out will-change-transform ' +
                    (activeIndex === index ? 'scale-[1.08]' : 'scale-[1.02]') +
                    (activeIndex !== null && activeIndex !== index ? ' brightness-75 saturate-50' : '')
                  }
                />

                {/* Cinematic overlay - simplified */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/35 to-black/85" />
              </div>

              {/* Border + accent */}
              <div
                className={
                  'absolute inset-0 ring-1 transition-all duration-500 ' +
                  (activeIndex === index ? 'ring-white/25' : 'ring-white/10')
                }
              />

              {/* Lift/tilt only for active panel */}
              <div
                className={
                  'absolute inset-0 transition-transform duration-500 vj-tilt ' +
                  (activeIndex === index ? 'vj-tilt-active' : '')
                }
              />
              <div
                className={
                  'absolute left-8 md:left-10 top-28 md:top-32 h-[2px] w-10 rounded-full transition-all duration-500 ' +
                  accent(exp.accent)
                }
                style={{
                  opacity: activeIndex === null || activeIndex === index ? 1 : 0.25,
                }}
              />

              {/* Content */}
              <div className="relative z-10 h-full p-8 md:p-10">
                <div className="h-full flex flex-col">
                  <div className="pt-24 md:pt-28">
                    <div className="text-xs uppercase tracking-[0.28em] text-white/65">
                      {exp.subtitle}
                    </div>
                  </div>

                  <div className="mt-auto pb-10 md:pb-12">
                    <h2
                      className={
                        'font-semibold tracking-tight leading-[1.05] transition-all duration-300 ease-out ' +
                        (activeIndex === index ? 'text-4xl md:text-5xl -translate-y-0.5' : 'text-3xl md:text-4xl') +
                        (activeIndex !== null && activeIndex !== index ? ' opacity-60' : ' opacity-100')
                      }
                      style={{ textShadow: '0 10px 30px rgba(0,0,0,0.55)' }}
                    >
                      {exp.title}
                    </h2>

                    <AnimatePresence initial={false} mode="wait">
                      {activeIndex === index && (
                        <motion.p
                          key="desc"
                          className="mt-4 max-w-md text-white/80 leading-relaxed"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                          {exp.description}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    <AnimatePresence initial={false} mode="wait">
                      {activeIndex === index && (
                        <motion.div
                          key="cta"
                          className="mt-6"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.2, ease: 'easeOut', delay: 0.05 }}
                        >
                          <a
                            href={exp.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vj-btn inline-flex items-center gap-2 rounded-full bg-white/95 text-black px-6 py-3 text-sm font-semibold
                              transition-all duration-200 hover:bg-white hover:shadow-xl hover:shadow-black/30"
                          >
                            Trải nghiệm ngay
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Bottom number */}
              <div className="absolute bottom-6 right-8 z-20 text-white/15 font-semibold tracking-[0.2em]">
                0{index + 1}
              </div>

              {/* Subtle light sweep */}
              <div
                className={
                  'absolute inset-0 pointer-events-none transition-opacity duration-300 ' +
                  (activeIndex === index ? 'opacity-100' : 'opacity-0')
                }
              >
                <div className="absolute -inset-x-24 -top-20 h-40 rotate-12 bg-white/10 blur-2xl" />
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
        <section className="relative py-20 bg-black">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Bắt đầu hành trình của bạn
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Khám phá và bảo vệ đôi mắt của bạn cùng VISTA
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/services"
                className="px-7 py-3.5 bg-white text-black font-semibold rounded-full transition-all
                  hover:bg-white/95 hover:shadow-xl hover:shadow-black/30"
              >
                Xem dịch vụ
              </Link>
              <Link
                to="/quiz"
                className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-full
                  border border-white/15 transition-all"
              >
                Làm quiz
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .vj-vignette {
          background: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.85));
        }

        .vj-grid {
          opacity: 0.1;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .vj-spotlight {
          opacity: 0.8;
          background: radial-gradient(600px 400px at var(--mx, 50%) var(--my, 40%), rgba(255,255,255,0.08), transparent 60%);
          pointer-events: none;
          will-change: background;
        }

        .vj-tilt { pointer-events: none; }
        .vj-panel[data-active='true'] .vj-tilt {
          transform: perspective(1200px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translateY(-4px);
        }

        .vj-btn {
          transform: translateY(0);
        }

        .vj-panel[data-active='true'] .vj-btn {
          box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        }

        .vj-panel {
          will-change: flex;
        }
      `}</style>
      </div>
    </MotionConfig>
  );
}
