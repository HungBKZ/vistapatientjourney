import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Service } from '../types';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';

// Professional hospital images
const IMAGES = {
  hero: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1770316668/626784497_122119516335062997_710351683700892706_n_wsoxsy.jpg',
  doctor1: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
  doctor2: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  eyeExam: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/b_cvek81.jpg',
  equipment: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/d_cuvmbv.jpg',
  clinic: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768712371/Screenshot_2026-01-18_115905_oj9yww.png',
  patient: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710759/a_xnxud3.jpg',
};

const VISTA_TEAM = [
  {
    name: 'Nguyễn Hữu Lượng',
    major: 'Truyền thông kỹ thuật số',
    title: 'CEO',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768712466/z7442634880142_d1779c60ccfa68bc2b718ba79d8d3ba8_s5iju9.jpg',
  },
  {
    name: 'Cao Tấn Lộc',
    major: 'Truyền thông kỹ thuật số',
    title: 'CFO',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768712466/z7442634925500_413fc3f62c978bfaf62aa66199e81a31_tohe3n.jpg',
  },
  {
    name: 'Phan Thành Hưng',
    major: 'Kỹ thuật phần mềm',
    title: 'CMO',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768712464/z7442634833477_2286a80cd4f6393795e49ddfffd71623_mawixx.jpg',
  },
  {
    name: 'Bùi Trung Kiên',
    major: 'Kỹ thuật phần mềm',
    title: 'CTO',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768712462/z7442634788388_7d5938f76594d416c83fb6de684724c6_u7ndnr.jpg',
  },
  {
    name: 'Lê Lý Đức',
    major: 'Ngôn ngữ Anh',
    title: 'COO',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768712462/z7442634742484_b0208a6d8ad19b123814f6aab2254929_c7cubq.jpg',
  },
  {
    name: 'Đoàn Hoài Ánh Dương',
    major: 'Thiết kế mỹ thuật',
    title: 'CCO',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768712464/z7442634696050_e53b234f0d72a1ffa7f25cb0b7fd9907_m2rqag.jpg',
  },
] as const;

export default function HomePage() {
  const { t } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [currentSection, setCurrentSection] = useState(0);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const lastScrollTime = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const SECTION_NAMES = [
    t('nav.home'),
    t('home.whyChoose.badge'),
    'VISTA Team',
    t('home.features.title')
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await api.getServices(true) as { data: Service[] };
        setServices(servicesRes.data?.slice(0, 6) || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Snap scroll logic
  const scrollToSection = useCallback((index: number) => {
    const section = sectionsRef.current[index];
    if (section && !isScrollingRef.current) {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      isScrollingRef.current = true;
      setCurrentSection(index);
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  }, []);

  // Track current section on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isScrollingRef.current) return;
      
      const windowHeight = window.innerHeight;
      let foundSection = 0;
      let closestDistance = Infinity;
      
      // Find the section closest to the center of viewport
      for (let i = 0; i < sectionsRef.current.length; i++) {
        const section = sectionsRef.current[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionCenter = rect.top + rect.height / 2;
          const viewportCenter = windowHeight / 2;
          const distance = Math.abs(sectionCenter - viewportCenter);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            foundSection = i;
          }
        }
      }
      
      setCurrentSection(foundSection);
      
      // Only enable auto-snap on desktop
      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      if (!isDesktop) return;

      // Auto-snap to nearest section after scroll stops
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        const section = sectionsRef.current[foundSection];
        if (section) {
          const rect = section.getBoundingClientRect();
          // If section is not perfectly aligned at top, snap to it
          if (Math.abs(rect.top) > 5) {
            isScrollingRef.current = true;
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
              isScrollingRef.current = false;
            }, 600);
          }
        }
      }, 150); // Wait 150ms after scroll stops
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrollingRef.current) return;
      
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        const nextIndex = Math.min(SECTION_NAMES.length - 1, currentSection + 1);
        if (nextIndex !== currentSection) {
          scrollToSection(nextIndex);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevIndex = Math.max(0, currentSection - 1);
        if (prevIndex !== currentSection) {
          scrollToSection(prevIndex);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        scrollToSection(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        scrollToSection(SECTION_NAMES.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, scrollToSection]);

  useEffect(() => {
    // Only enable snap scroll on desktop (lg breakpoint and above)
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
    if (!isDesktop) return;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      // Shorter cooldown for more responsive scrolling
      if (now - lastScrollTime.current < 600 || isScrollingRef.current) return;
      
      const windowHeight = window.innerHeight;
      
      // Find current section index - use closest section
      let currentIndex = -1;
      let closestDistance = Infinity;
      
      for (let i = 0; i < sectionsRef.current.length; i++) {
        const section = sectionsRef.current[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          const sectionTop = rect.top;
          const distance = Math.abs(sectionTop);
          
          if (distance < closestDistance) {
            closestDistance = distance;
            currentIndex = i;
          }
        }
      }
      
      // If not in snap sections, allow normal scroll
      if (currentIndex === -1 || currentIndex >= SECTION_NAMES.length) return;
      
      // If at last snap section and scrolling down, allow normal scroll
      if (currentIndex === SECTION_NAMES.length - 1 && e.deltaY > 0) return;
      
      // If at first section and scrolling up, allow normal scroll
      if (currentIndex === 0 && e.deltaY < 0) return;
      
      // Very sensitive threshold - any intentional scroll will trigger
      const threshold = 10;
      if (Math.abs(e.deltaY) < threshold) return;
      
      // Prevent default scroll behavior
      e.preventDefault();
      
      // Determine direction
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(SECTION_NAMES.length - 1, currentIndex + direction));
      
      if (nextIndex !== currentIndex) {
        lastScrollTime.current = now;
        scrollToSection(nextIndex);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [scrollToSection]);

  const setSectionRef = (index: number) => (el: HTMLElement | null) => {
    sectionsRef.current[index] = el;
  };

  return (
    <div className="bg-white">
      {/* Hero Section - Full width team image */}
      <section ref={setSectionRef(0)} className="relative w-full md:h-screen">
      {/* WRAPPER ẢNH:
         - Mobile: relative (để height tự giãn theo ảnh), w-full.
         - PC: absolute inset-0 (để phủ kín background h-screen như cũ).
      */}
      <div className="relative w-full md:absolute md:inset-0 md:h-full">
        <img 
          src={IMAGES.hero}
          alt="Nhóm VISTA"
          // Mobile: h-auto (chiều cao tự nhiên), object-contain (đủ nội dung).
          // PC: h-full, object-cover, object-[50%_35%] (Giữ nguyên như cũ).
          className="w-full h-auto md:h-full md:object-cover md:object-[50%_35%]"
        />
        {/* Gradient phủ lên ảnh */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/30" />
      </div>

      {/* WRAPPER NỘI DUNG:
         - Mobile: absolute inset-0 (đè lên ảnh), padding tính theo % để scale.
         - PC: Giữ nguyên max-w-7xl, padding px-4...
      */}
      <div className="absolute inset-0 flex items-end pb-[8%] px-[5%] md:relative md:h-full md:max-w-7xl md:mx-auto md:px-6 md:pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full md:max-w-2xl md:mb-0"
        >
          {/* TEXT RESPONSIVE:
             - Mobile: Dùng text-[Xvw] (ví dụ 3.5vw) -> Màn hình nhỏ chữ tự bé lại.
             - PC (md:): Quay về text-sm, text-6xl cố định như cũ.
          */}
          <p className="text-blue-400 font-semibold mb-[2%] md:mb-4 tracking-wide text-[3.5vw] md:text-sm uppercase">
            VISTA - PATIENT JOURNEY
          </p>
          <h1 className="font-bold text-white leading-tight mb-[4%] md:mb-6 text-[4vw] md:text-5xl lg:text-6xl">
            {t('home.hero.title2')}
            <br />
            <span className="text-blue-400">{t('home.hero.subtitle2')}</span>
          </h1>
        </motion.div>
      </div>
    </section>

      {/* Services Section */}
      {/* <section ref={setSectionRef(1)} className="py-20 bg-gray-50 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-medium mb-2">DỊCH VỤ</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Dịch vụ tham khảo trên hệ thống
            </h2>
            <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
              Danh sách dưới đây hiển thị từ dữ liệu demo để minh hoạ cách trình bày dịch vụ.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{service.short_description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-600">
                    {new Intl.NumberFormat('vi-VN').format(service.price)}đ
                  </span>
                  <Link 
                    to="/booking" 
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Đặt lịch (demo) →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link 
              to="/services"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Xem tất cả dịch vụ
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section> */}

      {/* About / Image Gallery Section */}
      <section ref={setSectionRef(1)} className="py-12 sm:py-16 md:py-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-3 sm:space-y-4">
                <img 
                  src={IMAGES.eyeExam}
                  alt="Khám mắt"
                  className="w-full h-36 sm:h-48 object-cover rounded-lg sm:rounded-xl"
                />
                <img 
                  src={IMAGES.equipment}
                  alt="Thiết bị hiện đại"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg sm:rounded-xl"
                />
              </div>
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                <img 
                  src={IMAGES.clinic}
                  alt="Phòng khám"
                  className="w-full h-48 sm:h-64 object-cover rounded-lg sm:rounded-xl"
                />
                <img 
                  src={IMAGES.patient}
                  alt="Chăm sóc bệnh nhân"
                  className="w-full h-36 sm:h-48 object-cover rounded-lg sm:rounded-xl"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-blue-600 font-medium mb-2 text-sm">{t('home.whyChoose.badge')}</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                {t('home.whyChoose.title')}
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {t('home.whyChoose.description')}
              </p>
              
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {[
                  t('home.whyChoose.list1'),
                  t('home.whyChoose.list2'),
                  t('home.whyChoose.list3'),
                  t('home.whyChoose.list4'),
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm sm:text-base text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              {/* <Link 
                to="/booking"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
                  text-white font-medium rounded-lg transition-colors"
              >
                Xem luồng đặt lịch (demo)
              </Link> */}
            </div>
          </div>
        </div>
      </section>

      {/* Vista Team Section */}
      <section ref={setSectionRef(2)} className="relative py-12 sm:py-16 md:py-20 overflow-hidden min-h-screen flex flex-col justify-center">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-sky-50 to-purple-50"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent"></div>
        
        {/* Subtle Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <p className="text-blue-600 font-semibold mb-2 tracking-wide uppercase text-xs sm:text-sm">{t('home.team.badge')}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
              {t('home.team.title')}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {VISTA_TEAM.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden 
                  shadow-sm hover:shadow-xl transition-all duration-300 border border-white/50
                  hover:scale-[1.02] hover:-translate-y-1"
              >
                <div className="h-16 bg-gradient-to-br from-blue-500/20 via-sky-500/10 to-purple-500/20 
                  group-hover:from-blue-500/30 group-hover:via-sky-500/20 group-hover:to-purple-500/30 
                  transition-all duration-300" 
                />

                <div className="px-6 pb-6">
                  <div className="flex justify-center -mt-10">
                    <div className="w-24 h-24 rounded-full ring-4 ring-white shadow-lg overflow-hidden bg-gray-100
                      group-hover:ring-blue-100 group-hover:shadow-xl transition-all duration-300">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900">{member.name}</h3>
                      <span className="px-2 sm:px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        {member.title}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mt-2">{member.major}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={setSectionRef(3)} className="py-12 sm:py-16 md:py-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <p className="text-blue-600 font-medium mb-2 text-xs sm:text-sm">{t('home.features.badge')}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
              {t('home.features.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              {t('home.features.description')}
            </p>
          </div>
              {/* grid md:grid-cols-2 lg:grid-cols-4 gap-8  */}
              {/* flex flex-wrap justify-center gap-8 */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-16">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: t('home.features.feature1'),
              },
              {
                icon: (
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: t('home.features.feature2'),
              },
              {
                icon: (
                  <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: t('home.features.feature3'),
              },
            ].map((item) => (
              <div key={item.title} className="text-center max-w-[140px] sm:max-w-none">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-3 sm:mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-2">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Trải nghiệm bản demo
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Xem luồng đặt lịch và cách chúng mình trình bày thông tin dịch vụ/kiến thức.
            Nếu bạn là đối tác, nhóm có thể tuỳ biến theo nhu cầu thực tế.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/booking"
              className="px-8 py-4 bg-white text-blue-600 font-medium rounded-lg 
                hover:bg-gray-100 transition-colors"
            >
              Vào trang đặt lịch (demo)
            </Link>
            <a 
              href="tel:+84388833157"
              className="px-8 py-4 border border-white/50 text-white font-medium rounded-lg 
                hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              038 883 3157
            </a>
          </div>
        </div>
      </section> */}

      {/* Snap Scroll Navigation - Desktop */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col gap-4">
          {SECTION_NAMES.map((name, index) => (
            <div key={index} className="group relative">
              {/* Tooltip */}
              <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 
                group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg 
                  whitespace-nowrap shadow-lg">
                  {name}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full 
                    border-8 border-transparent border-l-gray-900" />
                </div>
              </div>
              
              {/* Dot Button */}
              <button
                onClick={() => scrollToSection(index)}
                className={`relative w-3 h-3 rounded-full transition-all duration-300 
                  ${currentSection === index 
                    ? 'bg-blue-600 scale-125 shadow-lg shadow-blue-600/50' 
                    : 'bg-gray-300 hover:bg-blue-400 hover:scale-110'
                  }`}
                aria-label={`Go to ${name}`}
              >
                {/* Pulse animation for active section */}
                {currentSection === index && (
                  <span className="absolute inset-0 rounded-full bg-blue-600 
                    animate-ping opacity-75" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Snap Scroll Navigation - Mobile/Tablet */}
      {/* <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <div className="bg-white/95 backdrop-blur-md rounded-full shadow-lg px-3 sm:px-4 py-2.5 sm:py-3 
          border border-gray-200/50">
          <div className="flex items-center gap-2 sm:gap-3">
            {SECTION_NAMES.map((name, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(index)}
                className={`relative transition-all duration-300 rounded-full touch-manipulation
                  ${currentSection === index 
                    ? 'w-7 sm:w-8 h-2.5 sm:h-3 bg-blue-600' 
                    : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-300 active:bg-blue-400'
                  }`}
                aria-label={`Go to ${name}`}
              >
                {currentSection === index && (
                  <span className="absolute inset-0 rounded-full bg-blue-600 
                    animate-pulse opacity-75" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div> */}

    </div>
  );
}
