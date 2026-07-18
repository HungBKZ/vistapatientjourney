import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

/*
  ═══════════════════════════════════════════════════════════
  JOURNEY PAGE — "VISTA Clinical" Enhanced Theme v2
  Cải tiến styling theo Legibility & UI Cleanse Audit:
  1. Typography: Revert sang font chữ 'Inter' tối giản, dễ đọc (như trang HomePage).
  2. Background Overlay: Tinh chỉnh lớp phủ gradient mịn và đằm thắm hơn, tạo độ sâu điện ảnh và nâng cao độ tương phản chữ.
  3. UI Cleanse: Loại bỏ hoàn toàn thanh Timeline Rail bên trái để màn hình thoáng đãng.
  4. Central Area Sharpness: Làm sắc nét phần đếm số cột mốc, timeline markers 01-05, và nút bấm CTA.
  5. Viewport Stability: Sử dụng 100dvh chống giật trên thiết bị di động.
  ═══════════════════════════════════════════════════════════
*/

/* ─── Chỉ load weights thực sự dùng: Inter từ 300 đến 900 ─── */
const FONT_LINK = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
`;

/* ─── Color tokens ─── */
const C = {
  navy:       '#090D1A', // Off-black/charcoal để tránh màu đen tuyệt đối
  blue:       '#2563EB', // Xanh thương hiệu chính
  blueMid:    '#3B82F6', // Xanh thương hiệu phụ
  blueLight:  '#60A5FA',
  blue50:     '#F8FAFC',
  blue100:    '#F1F5F9',
  blue200:    '#E2E8F0',
  slate700:   '#334155', // Màu text chính
  slate500:   '#64748B',
  slate400:   '#94A3B8',
  slate200:   '#E2E8F0',
  white:      '#FFFFFF',
  pageBg:     '#FFFFFF', // Nền trang trắng sạch
  sectionAlt: '#FAFBFD', // Nền section xen kẽ rất nhẹ
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
    hex: '#2563EB', text: '#1E40AF',
    bg: '#F8FAFC', border: '#E2E8F0',
    tagBg: '#EFF6FF', tagText: '#1D4ED8', tagBorder: '#BFDBFE',
    quoteBg: '#F8FAFC',
    shadow: '0 20px 40px -15px rgba(37,99,235,0.06)',
    galleryBorder: '#E2E8F0',
  },
  indigo: {
    hex: '#4F46E5', text: '#3730A3',
    bg: '#FAFBFD', border: '#E2E8F0',
    tagBg: '#EEF2FF', tagText: '#3730A3', tagBorder: '#C7D2FE',
    quoteBg: '#FAFBFD',
    shadow: '0 20px 40px -15px rgba(79,70,229,0.06)',
    galleryBorder: '#E2E8F0',
  },
  sky: {
    hex: '#0284C7', text: '#0369A1',
    bg: '#F8FAFC', border: '#E2E8F0',
    tagBg: '#F0F9FF', tagText: '#0369A1', tagBorder: '#BAE6FD',
    quoteBg: '#F8FAFC',
    shadow: '0 20px 40px -15px rgba(2,132,199,0.06)',
    galleryBorder: '#E2E8F0',
  },
  cobalt: {
    hex: '#1D4ED8', text: '#1E40AF',
    bg: '#F8FAFC', border: '#E2E8F0',
    tagBg: '#EFF6FF', tagText: '#1E40AF', tagBorder: '#93C5FD',
    quoteBg: '#F8FAFC',
    shadow: '0 20px 40px -15px rgba(29,78,216,0.06)',
    galleryBorder: '#E2E8F0',
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
      fontFamily: "'Inter', sans-serif", fontWeight: 500,
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
        position: 'relative', borderRadius: 16, overflow: 'hidden',
        border: `1.5px solid ${hov ? ac.hex : '#E2EDFC'}`,
        background: '#F8FAFC',
        cursor: 'pointer', outline: 'none', padding: 0,
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: hov ? `0 12px 32px rgba(37,99,235,0.12)` : '0 4px 16px rgba(0,0,0,0.02)',
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
          filter: hov ? 'brightness(0.85)' : 'brightness(1)',
          transition: 'filter 0.2s',
          borderRadius: 14,
        }}
        loading="lazy"
      />
      {hov && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {[
            { top: 6, left: 6 }, { top: 6, right: 6 },
            { bottom: 6, left: 6 }, { bottom: 6, right: 6 },
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
              background: 'rgba(255,255,255,0.92)',
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
        fontFamily: "'Inter', monospace", fontSize: 9,
        color: hov ? ac.hex : '#BFDBFE', transition: 'color 0.2s',
        letterSpacing: '0.05em',
      }}>
        {String(index + 1).padStart(2, '0')}
      </div>
    </motion.button>
  );
}

/* ════════════════════════════════════════════
   STICKY PROGRESS NAV
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
            fontFamily: "'Inter', sans-serif", fontWeight: 800,
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
                        fontFamily: "'Inter', sans-serif", fontWeight: 500,
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
    {
      id: 'cambodia-expansion',
      chapter: t('journey.milestone6.chapter'),
      date: '13 / 03 / 2026',
      title: t('journey.milestone6.title'),
      subtitle: t('journey.milestone6.subtitle'),
      quote: t('journey.milestone6.quote'),
      description: t('journey.milestone6.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784128315/657654186_1384477857054073_9102664497848766415_n_yvnkih.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784128316/657800369_1384477867054072_6503936124909564641_n_upttv8.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784128315/652206413_122124744357062997_3759891765890928266_n_ff05l0.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784128316/657686506_1384478127054046_4319327200044372137_n_itmbhn.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784128316/657775947_1384477863720739_157375242812327643_n_rxcrql.jpg',
      ],
      accent: 'indigo',
      highlights: [t('journey.milestone6.highlight1'), t('journey.milestone6.highlight2'), t('journey.milestone6.highlight3')],
      links: [
        { label: t('journey.facebookPostLink'), url: 'https://www.facebook.com/share/p/1HFGEYr2we/' },
        { label: t('journey.facebookPostLink2'), url: 'https://www.facebook.com/share/p/1Jsv4GiYcD/' },
      ],
    },
    {
      id: 'mou-signing',
      chapter: t('journey.milestone7.chapter'),
      date: '05 / 2026',
      title: t('journey.milestone7.title'),
      subtitle: t('journey.milestone7.subtitle'),
      quote: t('journey.milestone7.quote'),
      description: t('journey.milestone7.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784124345/FPT00743.png_gaci6n.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784129435/689474996_1419613753540483_5527129327759233458_n_pg3x3g.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784129435/690632900_1419612540207271_7984645979845752170_n_eqxnc9.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784129435/689477130_1419613160207209_4853915006737053083_n_sis3kh.jpg',
      ],
      accent: 'blue',
      highlights: [t('journey.milestone7.highlight1'), t('journey.milestone7.highlight2'), t('journey.milestone7.highlight3')],
      links: [
        { label: t('journey.facebookPostLink3'), url: 'https://www.facebook.com/photo/?fbid=1419613486873843&set=pcb.1419616476873544&locale=vi_VN' },
      ],
    },
    {
      id: 'official-deployment',
      chapter: t('journey.milestone8.chapter'),
      date: '06 / 2026',
      title: t('journey.milestone8.title'),
      subtitle: t('journey.milestone8.subtitle'),
      quote: t('journey.milestone8.quote'),
      description: t('journey.milestone8.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784131152/z7849376809902_c117a8a22b243f85a0cd0779f19e7f5d_j5ix6b.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784131175/z7849290651247_0d17494725d7bcf5f0002d4848b863fa_ggkwcu.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784131209/z7849452581068_d391fbaceb29deb7224e84de3c5da739_mjxplm.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784131258/IMG_6169_eaegci.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784131295/h8_ymdlzj.jpg',
      ],
      accent: 'cobalt',
      highlights: [t('journey.milestone8.highlight1'), t('journey.milestone8.highlight2'), t('journey.milestone8.highlight3')],
    },
    {
      id: 'digital-workshop',
      chapter: t('journey.milestone9.chapter'),
      date: '26 / 06 / 2026',
      title: t('journey.milestone9.title'),
      subtitle: t('journey.milestone9.subtitle'),
      quote: t('journey.milestone9.quote'),
      description: t('journey.milestone9.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784132449/739140501_122135428419062997_7404843838103438291_n_tsauep.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784132448/736007918_122135428389062997_6780838128663981746_n_yb6jzg.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784132448/738927182_122135428323062997_1207054542689200041_n_qdq7nn.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784132448/738904141_122135428317062997_7885082169949320122_n_o5yup7.jpg',
      ],
      accent: 'indigo',
      highlights: [t('journey.milestone9.highlight1'), t('journey.milestone9.highlight2'), t('journey.milestone9.highlight3')],
      links: [
        { label: t('journey.facebookPostLink4'), url: 'https://www.facebook.com/share/p/18tqCvKRWx/' },
        { label: t('journey.facebookPostLink5'), url: 'https://www.facebook.com/share/p/18enbN3rNy/' },
      ],
    },
    {
      id: 'clinical-trial-song-tien',
      chapter: t('journey.milestone10.chapter'),
      date: '07 / 2026',
      title: t('journey.milestone10.title'),
      subtitle: t('journey.milestone10.subtitle'),
      quote: t('journey.milestone10.quote'),
      description: t('journey.milestone10.description'),
      images: [
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784134265/IMG_0955_g5pxxz.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784134266/IMG_0924_f3pycc.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784134267/IMG_0973_qsoozw.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784134267/IMG_0963_qamxef.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784134267/IMG_0977_ebo2do.jpg',
        'https://res.cloudinary.com/dvucotc8z/image/upload/v1784134325/IMG_0958_hxjkbt.jpg',
      ],
      accent: 'blue',
      highlights: [t('journey.milestone10.highlight1'), t('journey.milestone10.highlight2'), t('journey.milestone10.highlight3')],
    },
  ], [t]);

  /* ─── Active milestone tracking (IntersectionObserver) ─── */
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

  /* ─── Swipe gesture for lightbox ─── */
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
          font-family: 'Inter', sans-serif;
          font-weight: 300;
        }
        .vj h1, .vj h2, .vj h3 {
          font-family: 'Inter', sans-serif;
          font-weight: 800;
        }
        .vj ::-webkit-scrollbar { width: 4px; }
        .vj ::-webkit-scrollbar-track { background: ${C.blue50}; }
        .vj ::-webkit-scrollbar-thumb { background: ${C.blue200}; border-radius: 2px; }

        .vj-btn {
          display: inline-flex; align-items: center; gap: 7px;
          font-family: 'Inter', sans-serif; font-weight: 500;
          font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;
          padding: 12px 22px; border-radius: 12px;
          border-width: 1.5px; border-style: solid;
          cursor: pointer; text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .vj-btn:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 12px 28px rgba(37,99,235,0.12);
        }
        .vj-btn:active {
          transform: translateY(-1px) scale(0.98);
        }

        .vj-tag {
          font-family: 'Inter', sans-serif; font-weight: 500;
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

        /* Mobile layout fix */
        @media (max-width: 768px) {
          .vj-text-col { order: 1 !important; }
          .vj-gallery-col { order: 2 !important; }
        }

        /* Lightbox thumbnail active ring */
        .vj-lb-thumb-active {
          outline: 2px solid white !important;
          outline-offset: 2px;
          opacity: 1 !important;
        }
      `}</style>

      <div className="vj" style={{ minHeight: '100dvh' }}>

        {/* ══════════════ STICKY PROGRESS NAV ══════════════ */}
        <StickyProgressNav milestones={MILESTONES} activeIdx={activeIdx} />

        {/* ══════════════ HERO ══════════════ */}
        <section style={{
          position: 'relative',
          minHeight: '100dvh',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          background: `linear-gradient(160deg, #E8F2FF 0%, #F5FAFF 50%, #EAF1FF 100%)`,
          paddingTop: 140,
          paddingBottom: 140,
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
              filter: 'saturate(0.15) brightness(1.4) contrast(0.8)',
              opacity: 0.12,
              zIndex: 0,
            }}
          />

          {/* Deepened and smoothed gradient overlay for cinematic backdrop and high text contrast */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.95) 0%, rgba(245, 250, 255, 0.88) 50%, rgba(232, 242, 255, 0.95) 100%)`,
            zIndex: 1,
            pointerEvents: 'none',
          }} />

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
              zIndex: 2,
            }} />
          ))}

          {/* Left data strip */}
          <div style={{
            position: 'absolute', left: 20, top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: "'Inter', monospace", fontSize: 9,
            color: C.blueMid, letterSpacing: '0.1em',
            lineHeight: 2.5, overflow: 'hidden', height: 220,
            opacity: 0.22, userSelect: 'none',
            zIndex: 2,
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
                fontFamily: "'Inter', sans-serif", fontWeight: 600,
                fontSize: 11, letterSpacing: '0.16em', color: C.blue,
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.95)',
                border: `1.5px solid ${C.blue200}`,
                padding: '8px 22px', borderRadius: 100,
                boxShadow: '0 4px 20px rgba(37,99,235,0.06)',
              }}>
                <span className="vj-blink" style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: C.blue, display: 'inline-block',
                }} />
                {t('journey.badge')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.25 }}
              style={{
                fontFamily: "'Inter', sans-serif", fontWeight: 900,
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
                fontSize: 14,
                color: C.blue,
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 36,
                fontFamily: "'Inter', sans-serif",
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
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer' }}
                  onClick={() => document.getElementById(`ms-${i}`)?.scrollIntoView({ behavior: 'smooth' })}>
                  <motion.div
                    whileHover={{ scaleY: 2.5, backgroundColor: C.blue }}
                    style={{
                      width: 48,
                      height: 4,
                      borderRadius: 2,
                      background: accents[ms.accent].hex,
                      opacity: 0.8,
                      transition: 'background-color 0.2s',
                    }}
                  />
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 12,
                    fontWeight: 600,
                    color: C.navy, opacity: 0.9, letterSpacing: '0.05em',
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
              whileHover={{
                scale: 1.03,
                y: -3,
                backgroundColor: '#1E40AF',
                borderColor: '#1E40AF',
                boxShadow: '0 12px 30px rgba(37,99,235,0.25)',
                transition: { type: 'spring', stiffness: 400, damping: 15 }
              }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: C.blue,
                border: `1.5px solid ${C.blue}`,
                color: C.white,
                padding: '16px 36px',
                borderRadius: 12,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: '0 4px 20px rgba(37,99,235,0.15)',
                transition: 'color 0.3s, background-color 0.3s, border-color 0.3s',
              }}
            >
              {t('journey.exploreCta')}
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>↓</motion.span>
            </motion.button>
          </div>

          {/* Scroll hint */}
          <div className="vj-scroll-hint" style={{
            position: 'absolute', bottom: 26, left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: "'Inter', sans-serif", fontWeight: 600,
            fontSize: 11, color: C.blue,
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
                minHeight: '100dvh',
                display: 'flex', alignItems: 'center',
                overflow: 'hidden',
                padding: 'clamp(140px, 15vw, 220px) 0',
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
                fontFamily: "'Inter', sans-serif", fontWeight: 900,
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
                gap: 'clamp(64px, 8vw, 100px)',
                alignItems: 'center',
              }}>

                {/* ── Text column ── */}
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
                      fontFamily: "'Inter', monospace", fontSize: 11,
                      color: C.slate400, letterSpacing: '0.06em',
                      borderLeft: `1px solid ${C.slate200}`, paddingLeft: 14,
                    }}>
                      {ms.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "'Inter', sans-serif", fontWeight: 800,
                    fontSize: 'clamp(30px, 3.5vw, 54px)',
                    color: C.navy, lineHeight: 1.15,
                    letterSpacing: '-0.028em', marginBottom: 8,
                  }}>
                    {ms.title}
                  </h2>

                  {/* Subtitle */}
                  <p style={{
                    fontSize: 15, fontWeight: 500,
                    color: ac.text, marginBottom: 22,
                    fontFamily: "'Inter', sans-serif",
                    lineHeight: 1.5,
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
                      fontSize: 15, fontStyle: 'italic',
                      color: C.navy, lineHeight: 1.82,
                      margin: 0, opacity: 0.88,
                      fontFamily: "'Inter', sans-serif",
                      fontWeight: 300,
                    }}>
                      {ms.quote}
                    </p>
                    <p style={{
                      fontSize: 10, fontWeight: 500,
                      color: ac.text, marginTop: 10,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      fontFamily: "'Inter', sans-serif",
                    }}>
                      — Nhóm VISTA
                    </p>
                  </div>

                  {/* Description */}
                  <p style={{
                    fontSize: 16, color: C.slate700,
                    lineHeight: 1.75, marginBottom: 24, fontWeight: 300,
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {ms.description}
                  </p>

                  {/* Highlights */}
                  {ms.highlights && ms.highlights.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <p style={{
                        fontSize: 10, fontWeight: 500, color: C.slate400,
                        letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 10,
                        fontFamily: "'Inter', sans-serif",
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

                {/* ── Gallery column — Double-Bezel nested architecture ── */}
                <motion.div
                  className="vj-gallery-col"
                  initial={{ opacity: 0, x: isEven ? 36 : -36 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
                  style={{ order: isEven ? 2 : 1 }}
                >
                  {/* Outer Bezel Shell */}
                  <div style={{
                    background: 'rgba(37, 99, 235, 0.015)',
                    border: '1px solid rgba(37, 99, 235, 0.06)',
                    borderRadius: 32,
                    padding: 12,
                    boxShadow: '0 30px 60px -15px rgba(37, 99, 235, 0.05)',
                    position: 'relative',
                  }}>
                    {/* Inner Core Enclosure */}
                    <div style={{
                      background: C.white,
                      border: '1px solid rgba(0, 0, 0, 0.05)',
                      borderRadius: 22,
                      padding: 20,
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
                          fontFamily: "'Inter', monospace", fontSize: 10,
                          color: C.slate400, letterSpacing: '0.05em', marginLeft: 4,
                        }}>
                          VISTA_CAM · {ms.images.length} FRAMES
                        </span>
                        <span style={{
                          marginLeft: 'auto',
                          fontFamily: "'Inter', monospace", fontSize: 9, fontWeight: 600,
                          color: ac.text, background: ac.bg,
                          border: `1px solid ${ac.border}`,
                          padding: '3px 9px', borderRadius: 5, letterSpacing: '0.07em',
                        }}>
                          ● REC
                        </span>
                      </div>

                      {/* Photo grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: imgCols, gap: 16 }}>
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
                    </div>

                    {/* Concentric Bottom-Right Border Bracket */}
                    <div style={{
                      position: 'absolute', bottom: -1.5, right: -1.5,
                      width: 44, height: 44,
                      borderRight: `2px solid ${ac.hex}40`,
                      borderBottom: `2px solid ${ac.hex}40`,
                      borderRadius: '0 0 32px 0',
                      pointerEvents: 'none',
                    }} />
                  </div>
                </motion.div>
              </div>
            </section>
          );
        })}

        {/* ══════════════ LIGHTBOX ══════════════ */}
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
                fontFamily: "'Inter', sans-serif", fontWeight: 800,
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
                    objectFit: 'contain', borderRadius: 20, display: 'block',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                  }}
                />
              </motion.div>

              {/* Thumbnail strip */}
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
                  fontFamily: "'Inter', monospace", fontSize: 11,
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