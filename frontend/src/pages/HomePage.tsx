import { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Service } from '../types';
import api from '../services/api';

// Professional hospital images
const IMAGES = {
  hero: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768710325/z7187641781717_35e4a88e7c6e52e45478bc4761b36cbf_uwiuar.jpg',
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
  const [services, setServices] = useState<Service[]>([]);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);
  const isScrollingRef = useRef(false);
  const lastScrollTime = useRef(0);

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
      isScrollingRef.current = true;
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 800);
    }
  }, []);

  useEffect(() => {
    let scrollAccumulator = 0;
    let scrollTimeout: NodeJS.Timeout;

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 800 || isScrollingRef.current) return;
      
      const windowHeight = window.innerHeight;
      
      // Find current section index
      let currentIndex = -1;
      for (let i = 0; i < sectionsRef.current.length; i++) {
        const section = sectionsRef.current[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= windowHeight / 2 && rect.bottom > windowHeight / 2) {
            currentIndex = i;
            break;
          }
        }
      }
      
      // If not in snap sections, allow normal scroll
      if (currentIndex === -1 || currentIndex >= 5) return;
      
      // If at last snap section (4) and scrolling down, allow normal scroll
      if (currentIndex === 4 && e.deltaY > 0) return;
      
      // Accumulate scroll to detect intentional scroll
      scrollAccumulator += e.deltaY;
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollAccumulator = 0;
      }, 150);
      
      // Lower threshold for more sensitive snapping
      const threshold = 30;
      if (Math.abs(scrollAccumulator) < threshold) return;
      
      const direction = scrollAccumulator > 0 ? 1 : -1;
      const nextIndex = Math.max(0, Math.min(4, currentIndex + direction));
      
      if (nextIndex !== currentIndex) {
        e.preventDefault();
        lastScrollTime.current = now;
        scrollAccumulator = 0;
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
      {/* Hero Section - Full width image with overlay */}
      <section ref={setSectionRef(0)} className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src={IMAGES.hero}
            alt="VISTA Eye Care"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/50 to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <p className="text-blue-400 font-medium mb-4 tracking-wide">
              VISTA - PATIENT JOURNEY
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Khi đôi mắt
              <br />
              <span className="text-blue-400">được thấu hiểu</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              VISTA là dự án với sứ mệnh nâng cao nhận thức cộng đồng về sức khỏe của mắt – những vấn đề tưởng chừng nhỏ nhưng ảnh hưởng lớn đến chất lượng sống.
              Chúng tôi tin rằng khi mỗi người hiểu đúng về đôi mắt của mình, họ sẽ nhìn rõ hơn không chỉ thế giới, mà cả tương lai phía trước.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* <Link 
                to="/booking"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium 
                  rounded-lg transition-colors duration-200"
              >
                Trải nghiệm đặt lịch (demo)
              </Link> */}
              {/* <a 
                href="tel:+84388833157"
                className="px-8 py-4 border border-white/30 hover:bg-white/10 text-white 
                  font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Liên hệ nhóm: 038 883 3157
              </a> */}
            </div>

            {/* <p className="mt-6 text-sm text-gray-300/90 max-w-xl">
              Lưu ý: Nội dung trên website phục vụ mục đích học tập/dự án; không thay thế tư vấn y khoa.
            </p> */}
          </motion.div>
        </div>

        {/* Quick Stats Bar */}
        {/* <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '6', label: 'Thành viên dự án' },
                { value: 'FA25', label: 'Học kỳ triển khai' },
                { value: 'Web + API', label: 'Sản phẩm demo' },
                { value: 'V1', label: 'Bản thử nghiệm' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div> */}
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
      <section ref={setSectionRef(2)} className="py-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src={IMAGES.eyeExam}
                  alt="Khám mắt"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <img 
                  src={IMAGES.equipment}
                  alt="Thiết bị hiện đại"
                  className="w-full h-64 object-cover rounded-xl"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src={IMAGES.clinic}
                  alt="Phòng khám"
                  className="w-full h-64 object-cover rounded-xl"
                />
                <img 
                  src={IMAGES.patient}
                  alt="Chăm sóc bệnh nhân"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-blue-600 font-medium mb-2">VỀ CHÚNG TÔI</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nhóm sinh viên Đại học FPT Cần Thơ
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                VISTA - Patient Journey là dự án do nhóm sinh viên phát triển với mục tiêu nâng cao nhận thức cộng đồng về sức khỏe mắt và các vấn đề nhãn khoa thường gặp.
                Thông qua việc hỗ trợ bệnh viện và đơn vị đối tác truyền tải thông tin một cách rõ ràng, dễ tiếp cận, dự án hướng đến việc giúp người dùng hiểu đúng, chăm sóc đúng và bảo vệ đôi mắt khỏe mạnh mỗi ngày, đặc biệt là trong thời đại số ngày nay.
              </p>
              
              <ul className="space-y-4 mb-8">
                {[
                  'Kiến thức về mắt',
                  'Chăm sóc sức khỏe mắt',
                  'Các vấn đề thường gặp về mắt',
                  'Kiến thức xác thực từ tổ chức chuyên môn',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{item}</span>
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
      <section ref={setSectionRef(3)} className="relative py-20 overflow-hidden min-h-screen flex flex-col justify-center">
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
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-2 tracking-wide uppercase text-sm">Đội ngũ Vista</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Những thành viên của dự án
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        {member.title}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{member.major}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={setSectionRef(4)} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-medium mb-2">TẠI SAO CHỌN VISTA?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Vì sao chọn giải pháp này?
            </h2>
          </div>
              {/* grid md:grid-cols-2 lg:grid-cols-4 gap-8  */}
              {/* flex flex-wrap justify-center gap-8 */}
          <div className="flex flex-wrap justify-center gap-16">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Thông tin xác thực',
                // description: 'Giao diện rõ ràng, ưu tiên trải nghiệm người dùng',
              },
              // {
              //   icon: (
              //     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              //         d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              //     </svg>
              //   ),
              //   title: 'Dễ phát triển',
              //   description: 'Kiến trúc web + API, thuận tiện mở rộng tính năng',
              // },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Vì sức khỏe cộng đồng',
                // description: 'Tổ chức kiến thức, dịch vụ và hướng dẫn theo luồng',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: 'Đối tác chuyên môn cao',
                // description: 'Tối ưu truyền thông và chuyển đổi người dùng (demo)',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                {/* <p className="text-gray-600 text-sm">{item.description}</p> */}
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

    </div>
  );
}
