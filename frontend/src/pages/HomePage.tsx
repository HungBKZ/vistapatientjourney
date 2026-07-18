import { useEffect, useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

/* Rotating gradient ring for avatar glow effect */
const avatarRingStyle = `
  @keyframes spin-glow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .avatar-glow-ring {
    position: relative;
  }
  .avatar-glow-ring::before {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 9999px;
    background: conic-gradient(
      from 0deg,
      rgba(59, 130, 246, 0.6),
      rgba(14, 165, 233, 0.4),
      rgba(99, 102, 241, 0.5),
      rgba(59, 130, 246, 0.2),
      rgba(14, 165, 233, 0.6),
      rgba(59, 130, 246, 0.6)
    );
    animation: spin-glow 4s linear infinite;
    z-index: -1;
    opacity: 0.7;
    transition: opacity 0.5s ease;
  }
  .group:hover .avatar-glow-ring::before {
    opacity: 1;
    inset: -4px;
  }
  .avatar-glow-ring::after {
    content: '';
    position: absolute;
    inset: -12px;
    border-radius: 9999px;
    background: radial-gradient(
      circle,
      rgba(59, 130, 246, 0.15) 0%,
      transparent 70%
    );
    z-index: -2;
    opacity: 0;
    transition: opacity 0.5s ease;
  }
  .group:hover .avatar-glow-ring::after {
    opacity: 1;
  }
`;

const IMAGES = {
  hero: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1770316668/626784497_122119516335062997_710351683700892706_n_wsoxsy.jpg',
  eyeExam: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1784124345/FPT00743.png_gaci6n.jpg',
  equipment: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1784124263/IMG_3524_ozyraw.jpg',
  clinic: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1784124263/IMG_3542_mpzbid.jpg',
  patient: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1784124262/IMG_6789_aqpunj.jpg',
};

const VISTA_TEAM = [
  { name: 'Nguyễn Hữu Lượng', major: 'Digital Marketing', title: 'CEO', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1768712466/z7442634880142_d1779c60ccfa68bc2b718ba79d8d3ba8_s5iju9.jpg' },
  { name: 'Cao Tấn Lộc', major: 'Digital Marketing', title: 'CFO', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1768712466/z7442634925500_413fc3f62c978bfaf62aa66199e81a31_tohe3n.jpg' },
  { name: 'Phan Thành Hưng', major: 'Kỹ thuật phần mềm', title: 'CMO', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1768712464/z7442634833477_2286a80cd4f6393795e49ddfffd71623_mawixx.jpg' },
  { name: 'Bùi Trung Kiên', major: 'Kỹ thuật phần mềm', title: 'CTO', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1768712462/z7442634788388_7d5938f76594d416c83fb6de684724c6_u7ndnr.jpg' },
  { name: 'Lê Lý Đức', major: 'Ngôn ngữ Anh', title: 'COO', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1768712462/z7442634742484_b0208a6d8ad19b123814f6aab2254929_c7cubq.jpg' },
  { name: 'Đoàn Hoài Ánh Dương', major: 'Thiết kế mỹ thuật số', title: 'CCO', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1768712464/z7442634696050_e53b234f0d72a1ffa7f25cb0b7fd9907_m2rqag.jpg' },
] as const;

const ADVISORS = [
  { name: 'BS.CKII Trần Bá Kiền', title: 'Cố vấn chuyên môn', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1784122482/BS.CKII_Tr%E1%BA%A7n_B%C3%A1_Ki%E1%BB%81n_nvqsem.jpg' },
  { name: 'BSNT. Trần Thị Khánh Linh', title: 'Cố vấn chuyên môn', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784374480/1784182257352_254186820795534410_254186820795534410_424e527efe083078c86edb7fde03db5c_jkhukb.jpg' },
  { name: 'BS.CKII Nguyễn Hữu Đức', title: 'Cố vấn chuyên môn', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1784122485/BS.CKII_Nguy%E1%BB%85n_H%E1%BB%AFu_%C4%90%E1%BB%A9c_jnqbpp.png' },
  { name: 'BS.CKI Tôn Quang Anh', title: 'Cố vấn chuyên môn', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/q_auto,f_auto/v1784122935/BS.CKI_T%C3%B4n_Quang_Anh_buj3rg.jpg' },
  { name: 'THS.BS Mai Ngọc Ánh', title: 'Cố vấn chuyên môn', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784374708/THS.BS_MAI_NG%E1%BB%8CC_%C3%81NH_qh1jdv.jpg' },
  { name: 'BS.CKI Lê Thị Bích Huệ', title: 'Cố vấn chuyên môn', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784375367/copy_of_bscki_l_th_bch_hu_jbryty.jpg' },
  { name: 'BS.CKI Lâm Đức Thiện', title: 'Cố vấn chuyên môn', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784375276/copy_of_bscki_lm_c_thin-photoroom_tyyxlj.png' },
  { name: 'BS.CKI Lâm Thị Ngọc Bích', title: 'Cố vấn chuyên môn', image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1784374802/BSCK1_L%C3%82M_TH%E1%BB%8A_NG%E1%BB%8CC_B%C3%8DCH-Photoroom_csycup.png' },
] as const;

// --- Premium Animation Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
};

const teamCardVariants: Variants = {
  hidden: { y: 80, opacity: 0, scale: 0.92 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
};

const advisorCardVariants: Variants = {
  hidden: { y: 60, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 90, damping: 18 },
  },
};

const fadeInUpVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } },
};

const headingVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 80, damping: 16 } },
};

export default function HomePage() {
  const { t } = useLanguage();
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observerOptions = { root: null, rootMargin: '-15% 0px -30% 0px', threshold: 0 };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          sectionsRef.current.indexOf(entry.target as HTMLElement);
        }
      });
    };
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sectionsRef.current.forEach((section) => { if (section) observer.observe(section); });
    return () => observer.disconnect();
  }, []);

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };

  return (
    <div className="bg-slate-50 selection:bg-blue-600 selection:text-white overflow-hidden">
      {/* Inject avatar glow animation CSS */}
      <style>{avatarRingStyle}</style>
      
      {/* 🚀 1. Hero Section (Đã tái cấu trúc Full Responsive & Nguyên vẹn ảnh trên Mobile) */}
      <section 
        ref={setSectionRef(0)} 
        className="relative w-full h-auto md:h-screen flex flex-col md:block overflow-hidden bg-slate-950"
      >
        {/* Khung chứa ảnh: Mobile sử dụng tỷ lệ gốc không cắt xén, Desktop tràn màn hình */}
        <motion.div 
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative md:absolute md:inset-0 w-full aspect-[4/3] sm:aspect-[16/10] md:aspect-auto md:h-full bg-slate-900"
        >
          {/* Trên mobile dùng object-contain để hiển thị 100% đầy đủ ảnh, desktop dùng object-cover */}
          <img 
            src={IMAGES.hero} 
            alt="Nhóm VISTA" 
            className="w-full h-full object-contain md:object-cover md:object-[50%_35%]" 
          />
          
          {/* Lớp phủ phim nghệ thuật bảo vệ độ tương phản chữ */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-transparent hidden md:block" />
        </motion.div>

        {/* Khối chữ: Tự động căn chỉnh thông minh. Mobile nằm ở dưới ảnh, Desktop đè lên góc ảnh */}
        <div className="relative md:absolute md:inset-0 max-w-7xl mx-auto flex items-center md:items-end pt-8 pb-16 md:pb-28 px-4 sm:px-6 z-10">
          <div className="w-full md:max-w-3xl space-y-4">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-blue-400 font-bold tracking-widest text-xs uppercase bg-blue-500/10 w-fit px-3 py-1 rounded-full border border-blue-500/20"
            >
              VISTA - PATIENT JOURNEY
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="font-black text-white leading-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight"
            >
              {t('home.hero.title2')}<br />
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                {t('home.hero.subtitle2')}
              </span>
            </motion.h1>
          </div>
        </div>
        
        {/* Dải ngăn cách chuyển giao giữa các Section mềm mại */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none hidden md:block" />
      </section>

      {/* 🚀 2. About Section */}
      <section ref={setSectionRef(1)} className="py-20 md:py-32 flex flex-col justify-center bg-slate-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Khối Gallery ảnh */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid grid-cols-2 gap-4 md:gap-6 relative"
            >
              <div className="space-y-4 md:space-y-6">
                <motion.img variants={fadeInUpVariants} whileHover={{ scale: 1.03 }} src={IMAGES.eyeExam} alt="Khám mắt" className="w-full h-44 sm:h-60 object-cover rounded-3xl shadow-md border-4 border-white" />
                <motion.img variants={fadeInUpVariants} whileHover={{ scale: 1.03 }} src={IMAGES.equipment} alt="Thiết bị hiện đại" className="w-full h-56 sm:h-72 object-cover rounded-3xl shadow-md border-4 border-white" />
              </div>
              <div className="space-y-4 md:space-y-6 pt-12">
                <motion.img variants={fadeInUpVariants} whileHover={{ scale: 1.03 }} src={IMAGES.clinic} alt="Phòng khám" className="w-full h-56 sm:h-72 object-cover rounded-3xl shadow-md border-4 border-white" />
                <motion.img variants={fadeInUpVariants} whileHover={{ scale: 1.03 }} src={IMAGES.patient} alt="Chăm sóc bệnh nhân" className="w-full h-44 sm:h-60 object-cover rounded-3xl shadow-md border-4 border-white" />
              </div>
            </motion.div>

            {/* Nội dung text giới thiệu */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="lg:pl-6 space-y-6"
            >
              <div className="space-y-2">
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 w-fit px-3 py-1 rounded-md">{t('home.whyChoose.badge')}</p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">{t('home.whyChoose.title')}</h2>
              </div>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">{t('home.whyChoose.description')}</p>
              
              <ul className="grid sm:grid-cols-2 gap-4 pt-4">
                {[t('home.whyChoose.list1'), t('home.whyChoose.list2'), t('home.whyChoose.list3'), t('home.whyChoose.list4')].map((item) => (
                  <motion.li 
                    whileHover={{ x: 4 }}
                    key={item} 
                    className="flex items-start gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white mt-0.5 shadow-sm shadow-emerald-200">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-sm sm:text-base text-slate-800 font-semibold">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🚀 3. CORE TEAM — Premium "Double-Bezel" Editorial Section
          ═══════════════════════════════════════════════════════════════════ */}
      <section ref={setSectionRef(2)} className="relative py-28 md:py-40 overflow-hidden">
        {/* Deep editorial background — no pure black, warm zinc-950 */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-slate-950 to-zinc-950" />
        
        {/* Ambient light orbs — subtle, elegant mesh gradient */}
        <div className="absolute top-[10%] left-[15%] w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-sky-500/6 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-[60%] left-[60%] w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full z-10">
          {/* Section heading with eyebrow pill badge */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="text-center mb-20 md:mb-24 space-y-5"
          >
            <motion.div variants={headingVariants}>
              <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-blue-300 bg-blue-500/10 border border-blue-500/15 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {t('home.team.badge')}
              </span>
            </motion.div>
            <motion.h2 
              variants={headingVariants}
              className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none"
            >
              {t('home.team.title')}
            </motion.h2>
            <motion.div variants={headingVariants} className="mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-blue-500 to-sky-400" />
          </motion.div>

          {/* Team Grid — 3 columns with staggered waterfall reveal */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {VISTA_TEAM.map((member) => (
              <motion.div
                key={member.name}
                variants={teamCardVariants}
                whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group relative"
              >
                {/* Double-Bezel: Outer Shell */}
                <div className="rounded-[2rem] bg-white/[0.04] p-1.5 ring-1 ring-white/[0.06] hover:ring-blue-500/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  {/* Inner Core */}
                  <div className="relative rounded-[calc(2rem-0.375rem)] bg-gradient-to-b from-white/[0.06] to-white/[0.02] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
                    {/* Gradient banner — shifts hue on hover */}
                    <div className="h-32 md:h-36 bg-gradient-to-br from-blue-600/15 via-sky-500/8 to-indigo-600/15 group-hover:from-blue-500/25 group-hover:via-sky-400/15 group-hover:to-indigo-500/25 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_70%)] group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
                    </div>
                    
                    {/* Avatar — Animated Glow Ring + Double-Bezel */}
                    <div className="px-6 pb-8 text-center relative">
                      <div className="flex justify-center -mt-[72px]">
                        <div className="avatar-glow-ring rounded-full p-[3px] relative z-0">
                          <div className="rounded-full p-0.5 bg-gradient-to-b from-white/15 to-white/[0.04]">
                            <div className="w-36 h-36 md:w-40 md:h-40 rounded-full overflow-hidden bg-zinc-900 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                              <motion.img 
                                whileHover={{ scale: 1.08 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                src={member.image} 
                                alt={member.name} 
                                className="w-full h-full object-cover object-top" 
                                loading="lazy" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Info block */}
                      <div className="mt-5 space-y-2.5">
                        <div className="flex items-center justify-center gap-2.5 flex-wrap">
                          <h3 className="font-extrabold text-xl text-white/95 tracking-tight group-hover:text-blue-300 transition-colors duration-500">{member.name}</h3>
                          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.15em] border border-blue-500/15 shadow-sm">{member.title}</span>
                        </div>
                        <p className="text-zinc-500 text-sm font-medium tracking-wide">{member.major}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════
          🚀 3.5. ADVISORS — Premium Editorial Section with Soft Structuralism
          ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        {/* Darker depth layer to distinguish from team section */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-[#0a0e1a] to-zinc-950" />
        
        {/* Ambient light — cooler, more refined than team section */}
        <div className="absolute top-[20%] left-[40%] w-[600px] h-[600px] bg-sky-600/5 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full z-10">
          {/* Section heading */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
            className="text-center mb-20 md:mb-24 space-y-5"
          >
            <motion.div variants={headingVariants}>
              <span className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-sky-300 bg-sky-500/10 border border-sky-500/15 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                {t('home.advisors.badge')}
              </span>
            </motion.div>
            <motion.h2 
              variants={headingVariants}
              className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none"
            >
              {t('home.advisors.title')}
            </motion.h2>
            <motion.div variants={headingVariants} className="mx-auto w-16 h-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-400" />
          </motion.div>

          {/* Advisors Grid — 4 columns */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6"
          >
            {ADVISORS.map((advisor) => (
              <motion.div
                key={advisor.name}
                variants={advisorCardVariants}
                whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                className="group relative"
              >
                {/* Double-Bezel: Outer Shell */}
                <div className="rounded-[1.75rem] bg-white/[0.03] p-1.5 ring-1 ring-white/[0.05] hover:ring-sky-500/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  {/* Inner Core */}
                  <div className="relative rounded-[calc(1.75rem-0.375rem)] bg-gradient-to-b from-white/[0.05] to-white/[0.015] overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]">
                    {/* Gradient banner */}
                    <div className="h-28 md:h-32 bg-gradient-to-br from-sky-600/12 via-blue-500/6 to-indigo-600/12 group-hover:from-sky-500/22 group-hover:via-blue-400/12 group-hover:to-indigo-500/22 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_70%)] group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
                    </div>
                    
                    {/* Avatar — Animated Glow Ring */}
                    <div className="px-4 pb-7 text-center relative">
                      <div className="flex justify-center -mt-16">
                        <div className="avatar-glow-ring rounded-full p-[3px] relative z-0">
                          <div className="rounded-full p-0.5 bg-gradient-to-b from-white/15 to-white/[0.04]">
                            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden bg-zinc-900 shadow-[0_16px_35px_-10px_rgba(0,0,0,0.5)]">
                              <motion.img 
                                whileHover={{ scale: 1.08 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                src={advisor.image} 
                                alt={advisor.name} 
                                className="w-full h-full object-cover object-top" 
                                loading="lazy" 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Info block */}
                      <div className="mt-4 space-y-1.5">
                        <h3 className="font-extrabold text-base md:text-lg text-white/95 tracking-tight group-hover:text-sky-300 transition-colors duration-500 leading-snug">{advisor.name}</h3>
                        <p className="text-zinc-500 text-xs font-medium tracking-wider uppercase">{advisor.title}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 🚀 4. Features Section */}
      <section ref={setSectionRef(3)} className="py-24 md:py-32 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20 space-y-3">
            <p className="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 w-fit px-3 py-1 rounded-md mx-auto">{t('home.features.badge')}</p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">{t('home.features.title')}</h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">{t('home.features.description')}</p>
          </div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />, title: t('home.features.feature1'), desc: 'Cam kết bảo mật tuyệt đối dữ liệu y tế và hành trình của từng khách hàng.' },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />, title: t('home.features.feature2'), desc: 'Đội ngũ chuyên nghiệp luôn đồng hành hỗ trợ, kết nối người bệnh và bác sĩ.' },
              { icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />, title: t('home.features.feature3'), desc: 'Đặt sức khỏe và sự an tâm của bệnh nhân làm kim chỉ nam cho mọi giải pháp.' },
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUpVariants}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-blue-500/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                </div>
                <h3 className="font-extrabold text-xl text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}