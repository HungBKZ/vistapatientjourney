// Vista Quizventure – Modern Developer-Focused Landing Page
// Features: Bento Grid, Auto-scroll, Hover Expand, Cloudinary Ready
import { useState } from 'react'
import { motion as Motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import VistaChatbot from './VistaChatbot'

/* ================= CONFIG ================= */
const CLOUDINARY_BASE = 'https://res.cloudinary.com/dvucotc8z/image/upload/'
const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'

// 3D Eye Animation GIFs
const EYE_GIF_1 = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409722/20251025_2322_New_Video_simple_compose_01k8e2tp2gfpxsexwrv4jks7k6_iis0jw.gif'
const EYE_GIF_2 = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409726/20251025_2322_New_Video_simple_compose_01k8e2tp00ej88rnay4f1v2jvn_hnqsod.gif'

// Company Info
const COMPANY_INFO = {
  name: 'VISTA - Patient Journey',
  address: '600 Nguyễn Văn Cừ nối dài, An Bình, Bình Thuỷ, Cần Thơ 900000',
  phone: '+84 38 883 3157',
  email: 'vistapatientjourney@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61581889931780'
}

/* ================= SHARED COMPONENTS ================= */
const BentoCard = ({ children, className = '', span = 1, rowSpan = 1, hover = true }) => {
  return (
    <Motion.div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 ${className}`}
      style={{ 
        gridColumn: `span ${span}`,
        gridRow: `span ${rowSpan}`
      }}
      whileHover={hover ? { 
        scale: 1.02, 
        zIndex: 10,
        boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.5)'
      } : {}}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {children}
    </Motion.div>
  )
}

const GlowButton = ({ children, variant = 'primary', onClick, href, className = '' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-lg shadow-sky-500/50',
    secondary: 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 shadow-lg shadow-purple-500/50',
    outline: 'border-2 border-sky-400 text-sky-400 hover:bg-sky-400/10'
  }
  
  const Comp = href ? 'a' : 'button'
  
  return (
    <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
      <Comp
        href={href}
        onClick={onClick}
        className={`inline-block px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${variants[variant]} ${className}`}
      >
        {children}
      </Comp>
    </Motion.div>
  )
}

const ScrollingText = ({ items, speed = 20 }) => {
  return (
    <div className="relative overflow-hidden py-4">
      <Motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: speed, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-slate-400 font-medium flex items-center gap-2">
            {item}
            <span className="text-sky-400">✦</span>
          </span>
        ))}
      </Motion.div>
    </div>
  )
}

/* ================= VIDEO MODAL ================= */
const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null
  
  return (
    <Motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Motion.div
        className="relative w-full max-w-5xl mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-sky-400 transition-colors duration-200"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Video Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-sky-500/50">
          <video
            className="w-full h-auto"
            controls
            autoPlay
            src={videoUrl}
          >
            Trình duyệt của bạn không hỗ trợ video.
          </video>
        </div>
      </Motion.div>
    </Motion.div>
  )
}

/* ================= HEADER ================= */
const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <Motion.header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Motion.a 
          href="#" 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.05 }}
        >
          <img 
            src={LOGO_URL}
            alt="VISTA Logo"
            className="w-12 h-12 rounded-xl object-cover ring-2 ring-sky-400/30"
          />
          <div className="flex flex-col">
            <span className="text-lg font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent leading-tight">
              VISTA
            </span>
            <span className="text-xs text-slate-400 leading-tight">
              Patient Journey
            </span>
          </div>
        </Motion.a>
        
        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Motion.a
            href="#features"
            className="text-slate-300 hover:text-sky-400 transition-colors"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            Tính năng
          </Motion.a>
          <Motion.a
            href="/quiz"
            className="text-slate-300 hover:text-sky-400 transition-colors"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Quizventure
          </Motion.a>
          <Motion.a
            href="/knowledge"
            className="text-slate-300 hover:text-sky-400 transition-colors"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Kiến thức
          </Motion.a>
          <Motion.a
            href="https://www.facebook.com/profile.php?id=61581889931780"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-sky-400 transition-colors"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Liên hệ
          </Motion.a>
        </nav>
        
        <div className="hidden md:block">
          <GlowButton href="#cta">Đăng ký Beta</GlowButton>
        </div>
        
        {/* Mobile menu */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Mobile menu dropdown */}
      {isOpen && (
        <Motion.div
          className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <nav className="flex flex-col p-6 gap-4">
            <a
              href="#features"
              className="text-slate-300 hover:text-sky-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Tính năng
            </a>
            <a
              href="/quiz"
              className="text-slate-300 hover:text-sky-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Quizventure
            </a>
            <a
              href="/knowledge"
              className="text-slate-300 hover:text-sky-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Kiến thức
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61581889931780"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-sky-400 transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Liên hệ
            </a>
            <div className="pt-2">
              <GlowButton href="#cta">Đăng ký Beta</GlowButton>
            </div>
          </nav>
        </Motion.div>
      )}
    </Motion.header>
  )
}

/* ================= HERO SECTION ================= */
const HeroSection = ({ onDemoClick }) => {
  const { scrollY } = useScroll()
  const _y = useTransform(scrollY, [0, 500], [0, 150]) // Parallax effect (unused but ready)
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20">
      {/* Animated background */}
      <div className="absolute inset-0">
        <Motion.div 
          className="absolute top-20 left-20 w-96 h-96 bg-sky-500/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <Motion.div 
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6 text-center z-10">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <Motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            Y tế · Nhãn khoa · Gamification
          </Motion.div>
          
          {/* Main title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-sky-200 to-white bg-clip-text text-transparent letter-spacing-wide">
              Học về chăm sóc mắt
            </span>
            <br />
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-transparent letter-spacing-wide">
              qua trò chơi & kiến thức
            </span>
          </h1>
          
          <p className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed letter-spacing-wide">
            Chinh phục <span className="text-sky-400 font-semibold">Vista Quizventure</span>, nghe podcast, xem video, tích điểm đổi quà và đặt lịch khám — tất cả trong một ứng dụng.
          </p>
          
          <div className="flex flex-nowrap justify-center items-center gap-4 mb-16">
            <GlowButton variant="primary" onClick={onDemoClick} className="text-lg px-8 py-4 whitespace-nowrap">
              Xem Demo
            </GlowButton>
            <GlowButton variant="outline" href="#features" className="text-lg px-8 py-4 whitespace-nowrap">
              Tìm hiểu thêm
            </GlowButton>
          </div>
          
          {/* 3D Eye Animations */}
          <Motion.div 
            className="flex justify-center gap-8 mb-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Motion.div
              className="relative group"
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-blue-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <img 
                src={EYE_GIF_1}
                alt="3D Eye Animation"
                className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </Motion.div>
            
            <Motion.div
              className="relative group"
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <img 
                src={EYE_GIF_2}
                alt="3D Eye Animation"
                className="relative w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl"
                loading="lazy"
              />
            </Motion.div>
          </Motion.div>
        </Motion.div>
        
        {/* Stats */}
        <Motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { value: '1000+', label: 'Câu hỏi Quizventure' },
            { value: '50+', label: 'Video & Podcast' },
            { value: '100+', label: 'Phần quà' },
            { value: '24/7', label: 'Hỗ trợ' }
          ].map((stat, i) => (
            <Motion.div 
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-blue-600 bg-clip-text text-transparent mb-2">
                {stat.value}
              </div>
              <div className="text-slate-400 text-sm">{stat.label}</div>
            </Motion.div>
          ))}
        </Motion.div>
      </div>
      
      {/* Scroll indicator */}
      <Motion.button
        onClick={() => {
          const featuresSection = document.getElementById('features')
          if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer bg-transparent border-none p-2 hover:scale-110 transition-transform"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-label="Scroll to features"
      >
        <svg className="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </Motion.button>
    </section>
  )
}

/* ================= 3D EYE ANIMATIONS SHOWCASE ================= */
const EyeAnimationsSection = () => {
  return (
    <section className="py-16 bg-slate-900 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <Motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-sky-400 to-purple-600 bg-clip-text text-transparent letter-spacing-wide">
              Khám Phá Cấu Trúc Mắt 3D
            </span>
          </h2>
          <p className="text-slate-400 letter-spacing-wide">
            Tương tác trực quan với mô hình 3D chân thực
          </p>
        </Motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* GIF Animation 1 */}
          <Motion.div
            className="relative group"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/10 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* GIF */}
              <Motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={EYE_GIF_1}
                  alt="Mô hình mắt 3D - Cấu trúc chi tiết"
                  className="w-full h-auto rounded-xl shadow-2xl"
                  loading="lazy"
                />
                {/* Floating badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sky-500/20 backdrop-blur-sm border border-sky-500/30 text-sky-400 text-xs font-semibold">
                  3D Model
                </div>
              </Motion.div>
              
              {/* Info */}
              <div className="relative mt-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2 letter-spacing-wide">
                  Cấu Trúc Mắt
                </h3>
                <p className="text-slate-400 text-sm letter-spacing-wide">
                  Khám phá các bộ phận chi tiết của mắt
                </p>
              </div>
            </div>
          </Motion.div>
          
          {/* GIF Animation 2 */}
          <Motion.div
            className="relative group"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/10 overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* GIF */}
              <Motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={EYE_GIF_2}
                  alt="Mô hình mắt 3D - Hoạt động"
                  className="w-full h-auto rounded-xl shadow-2xl"
                  loading="lazy"
                />
                {/* Floating badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-400 text-xs font-semibold">
                  Interactive
                </div>
              </Motion.div>
              
              {/* Info */}
              <div className="relative mt-6 text-center">
                <h3 className="text-xl font-bold text-white mb-2 letter-spacing-wide">
                  Hoạt Động Mắt
                </h3>
                <p className="text-slate-400 text-sm letter-spacing-wide">
                  Hiểu cách mắt hoạt động và điều chỉnh
                </p>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>
    </section>
  )
}

/* ================= BENTO GRID FEATURES ================= */
const BentoGridSection = () => {
  const features = [
    {
      title: 'Vista Quizventure',
      description: 'Hơn 1000 thử thách nhãn khoa cá nhân hóa với hành trình gamified.',
      icon: '🚀',
      image: 'v1761408612/unnamed_pzaiys.jpg',
      gradient: 'from-sky-500/30 via-blue-500/20 to-purple-500/30',
      wrapperClass: 'lg:col-span-2 lg:row-span-2 min-h-[420px]',
      emphasis: true,
      highlights: ['Lộ trình cá nhân hóa', 'Leaderboard thời gian thực'],
      cta: 'Vào Vista Quizventure',
      link: '/quiz'
    },
    {
      title: 'Podcast Y Tế',
      description: 'Nghe mọi lúc mọi nơi, kiến thức chuyên sâu',
      icon: '🎧',
      image: 'v1761409108/unnamed_1_g44gjc.jpg',
      gradient: 'from-purple-500/30 via-pink-500/20 to-rose-500/30',
      wrapperClass: 'lg:col-span-1 min-h-[220px]'
    },
    {
      title: 'Video Giáo Dục',
      description: 'Hình ảnh sinh động, dễ hiểu, dễ nhớ',
      icon: '📹',
      image: 'v1761410139/unnamed_2_inzt8g.jpg',
      gradient: 'from-emerald-500/30 via-teal-500/20 to-cyan-500/30',
      wrapperClass: 'lg:col-span-1 min-h-[220px]'
    },
    {
      title: 'Studio 360°',
      description: 'Trải nghiệm phòng mổ ảo chân thực',
      icon: '🏥',
      gradient: 'from-indigo-500/30 via-violet-500/20 to-purple-500/30',
      wrapperClass: 'lg:col-span-2 min-h-[220px]',
      link: '/studio360'
    },
    {
      title: 'Tích Điểm Đổi Quà',
      description: 'Học nhiều - Quà nhiều - Gắn bó lâu dài',
      icon: '🎁',
      gradient: 'from-rose-500/30 via-pink-500/20 to-fuchsia-500/30',
      wrapperClass: 'lg:col-span-2 min-h-[220px]'
    },
    {
      title: 'Kiến Thức Nhãn Khoa',
      description: 'Thư viện bài viết và tài liệu chuyên sâu',
      icon: '📚',
      gradient: 'from-amber-500/30 via-orange-500/20 to-red-500/30',
      wrapperClass: 'lg:col-span-2 min-h-[220px]',
      link: '/knowledge'
    }
  ]
  
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-sky-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <Motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              Tính năng độc đáo
            </div>
          </Motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 bg-clip-text text-transparent letter-spacing-wide">
              Tính năng nổi bật
            </span>
          </h2>
          <p className="text-slate-400 text-lg letter-spacing-wide max-w-2xl mx-auto">
            Trải nghiệm học tập toàn diện về chăm sóc mắt với công nghệ hiện đại
          </p>
        </Motion.div>
        
        {/* Enhanced Bento Grid - Responsive layout with highlighted quiz */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[220px] lg:auto-rows-[240px]">
          {features.map((feature, i) => {
            const CardWrapper = feature.link ? Link : 'div'
            const cardProps = feature.link ? { to: feature.link } : {}
            const isEmphasis = feature.emphasis
            const ctaLabel = feature.cta || 'Khám phá'

            return (
              <CardWrapper
                key={feature.title}
                {...cardProps}
                className={`block h-full no-underline ${feature.wrapperClass || ''}`}
              >
                <Motion.div
                  className={`relative overflow-hidden rounded-2xl group cursor-pointer h-full ${feature.cardClass || ''}`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  whileHover={{
                    scale: isEmphasis ? 1.03 : 1.02,
                    zIndex: 10,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Background image with parallax effect */}
                  {feature.image && (
                    <Motion.div 
                      className="absolute inset-0 overflow-hidden"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    >
                      <img 
                        src={`${CLOUDINARY_BASE}w_900,q_auto,f_auto/${feature.image}`}
                        alt={feature.title}
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                        loading="lazy"
                      />
                      {/* Gradient overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient || 'from-sky-500/30 to-purple-500/30'}`} />
                    </Motion.div>
                  )}

                  {/* Glass card background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/10 group-hover:border-white/20 transition-all duration-300" />

                  {/* Animated gradient border on hover */}
                  <Motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(45deg, transparent, ${feature.gradient?.split(' ')[0].replace('from-', '')?.replace('/30', '') || 'rgba(59, 130, 246, 0.5)'}, transparent)`,
                      backgroundSize: '200% 200%',
                    }}
                    animate={{
                      backgroundPosition: ['0% 0%', '100% 100%', '0% 0%']
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Content */}
                  <div className={`relative h-full ${isEmphasis ? 'p-8 md:p-10 flex flex-col' : 'p-6 flex flex-col'} justify-between z-10`}>
                    <div>
                      {/* Icon with bounce animation */}
                      <Motion.div 
                        className={`${isEmphasis ? 'text-6xl md:text-7xl' : 'text-5xl'} mb-4 inline-block`}
                        whileHover={{ 
                          scale: 1.2,
                          rotate: [0, -10, 10, -10, 0],
                          transition: { duration: 0.5 }
                        }}
                      >
                        {feature.icon}
                      </Motion.div>

                      {/* Title */}
                      <h3 className={`${isEmphasis ? 'text-3xl md:text-4xl' : 'text-2xl'} font-bold text-white mb-3 letter-spacing-wide group-hover:text-sky-300 transition-colors duration-300`}>
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className={`${isEmphasis ? 'text-slate-300 text-lg max-w-xl' : 'text-slate-400'} letter-spacing-wide group-hover:text-slate-300 transition-colors duration-300`}>
                        {feature.description}
                      </p>

                      {isEmphasis && feature.highlights?.length ? (
                        <div className="mt-6 flex flex-wrap gap-3">
                          {feature.highlights.map((item) => (
                            <span
                              key={item}
                              className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-200 text-xs font-semibold tracking-wide"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>

                    {/* Hover arrow indicator */}
                    <Motion.div 
                      className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <div className="flex items-center gap-3 text-sky-400 font-semibold">
                        <span className="text-sm uppercase tracking-wide">{ctaLabel}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Motion.div>
                  </div>

                  {/* Bottom glow bar */}
                  <Motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    animate={{
                      x: ['-100%', '100%']
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />

                  {/* Particle effect on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    {[...Array(6)].map((_, idx) => (
                      <Motion.div
                        key={idx}
                        className="absolute w-1 h-1 bg-sky-400 rounded-full"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          y: [0, -30, 0],
                          opacity: [0, 1, 0],
                          scale: [0, 1.5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: idx * 0.2
                        }}
                      />
                    ))}
                  </div>
                </Motion.div>
              </CardWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ================= AUTO-SCROLL JOURNEY ================= */
const JourneySection = () => {
  const steps = [
    { icon: '📱', title: 'Tải App', desc: 'Đăng ký tài khoản miễn phí' },
    { icon: '🚀', title: 'Vào Quizventure', desc: 'Thử thách kiến thức và tích điểm' },
    { icon: '📚', title: 'Học Kiến Thức', desc: 'Podcast, video, bài viết' },
    { icon: '🎁', title: 'Đổi Quà', desc: 'Sử dụng điểm đổi phần thưởng' },
    { icon: '📅', title: 'Đặt Lịch', desc: 'Khám mắt định kỳ' },
    { icon: '💚', title: 'Chăm Sóc', desc: 'Mắt khỏe mạnh lâu dài' }
  ]
  
  return (
    <section className="py-24 bg-slate-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <Motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent letter-spacing-wide">
              Hành trình của bạn
            </span>
          </h2>
          <p className="text-slate-400 text-lg letter-spacing-wide">
            Từ chơi đến chăm sóc toàn diện
          </p>
        </Motion.div>
        
        {/* Auto-scrolling steps */}
        <div className="relative">
          <Motion.div 
            className="flex gap-6"
            animate={{ x: [0, -1920] }}
            transition={{ 
              duration: 30, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            {[...steps, ...steps, ...steps].map((step, i) => (
              <Motion.div
                key={i}
                className="flex-shrink-0 w-80 p-8 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/10"
                whileHover={{ scale: 1.05, y: -10 }}
              >
                <div className="text-5xl mb-4">{step.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2 letter-spacing-wide">
                  {step.title}
                </h3>
                <p className="text-slate-400 letter-spacing-wide">{step.desc}</p>
              </Motion.div>
            ))}
          </Motion.div>
        </div>
      </div>
    </section>
  )
}

/* ================= REWARDS GRID ================= */
const RewardsSection = () => {
  const rewards = [
    { icon: '🎟️', name: 'Voucher khám', points: '500đ' },
    { icon: '👓', name: 'Gọng kính', points: '1000đ' },
    { icon: '💊', name: 'Thuốc nhỏ mắt', points: '300đ' },
    { icon: '📚', name: 'Sách y khoa', points: '800đ' },
    { icon: '🎁', name: 'Quà bí mật', points: '???đ' }
  ]
  
  return (
    <section className="py-24 bg-gradient-to-b from-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <Motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-600 bg-clip-text text-transparent letter-spacing-wide">
              Thư viện quà tặng
            </span>
          </h2>
          <p className="text-slate-400 text-lg letter-spacing-wide">
            Học nhiều - Quà nhiều - Gắn bó lâu
          </p>
        </Motion.div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {rewards.map((reward, i) => (
            <Motion.div
              key={i}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/10 text-center group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                boxShadow: '0 25px 50px -12px rgba(251, 191, 36, 0.5)'
              }}
            >
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                {reward.icon}
              </div>
              <h3 className="text-white font-bold mb-2 letter-spacing-wide">
                {reward.name}
              </h3>
              <div className="text-yellow-400 font-semibold">{reward.points}</div>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ================= CTA SECTION ================= */
const CTASection = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate submission
    setTimeout(() => {
      setStatus({ type: 'success', message: 'Đăng ký thành công! Chúng tôi sẽ liên hệ sớm.' })
      setFormData({ name: '', email: '', phone: '' })
      setIsSubmitting(false)
    }, 2000)
  }
  
  return (
    <section id="cta" className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <Motion.div 
          className="absolute top-0 left-0 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <Motion.div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>
      
      <div className="relative max-w-4xl mx-auto px-6">
        <Motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-sky-400 to-purple-600 bg-clip-text text-transparent letter-spacing-wide">
              Tham gia Beta Testing
            </span>
          </h2>
          <p className="text-slate-400 text-lg letter-spacing-wide">
            Trải nghiệm sớm và nhận ưu đãi đặc biệt
          </p>
        </Motion.div>
        
        <Motion.div
          className="p-8 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Họ và tên"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none transition-colors letter-spacing-wide"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none transition-colors letter-spacing-wide"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-6 py-4 rounded-xl bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:border-sky-400 focus:outline-none transition-colors letter-spacing-wide"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-sky-500/50 transition-all duration-300 disabled:opacity-50 letter-spacing-wide"
            >
              {isSubmitting ? 'Đang gửi...' : 'Đăng ký ngay'}
            </button>
            
            {status.message && (
              <Motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl ${
                  status.type === 'success' 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-400'
                }`}
              >
                {status.message}
              </Motion.div>
            )}
          </form>
        </Motion.div>
      </div>
    </section>
  )
}

/* ================= FOOTER ================= */
const Footer = () => {
  return (
    <footer className="py-12 bg-slate-950 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={LOGO_URL}
                alt="VISTA Logo"
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-sky-400/30"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white leading-tight">VISTA</span>
                <span className="text-xs text-slate-400 leading-tight">Patient Journey</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm mb-3 letter-spacing-wide">
              Học về chăm sóc mắt qua trò chơi & kiến thức tương tác
            </p>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <span className="text-sky-400">📍</span>
                <span className="leading-relaxed">{COMPANY_INFO.address}</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-sky-400">📞</span>
                <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-sky-400 transition-colors">
                  {COMPANY_INFO.phone}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-sky-400">✉️</span>
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-sky-400 transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </p>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4 letter-spacing-wide">Tính năng</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-sky-400 transition-colors">Vista Quizventure</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Podcast</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Video</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Đặt lịch</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4 letter-spacing-wide">Hỗ trợ</h3>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-sky-400 transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Liên hệ</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Điều khoản</a></li>
              <li><a href="#" className="hover:text-sky-400 transition-colors">Bảo mật</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-bold mb-4 letter-spacing-wide">Kết nối</h3>
            <div className="space-y-3">
              <a 
                href={COMPANY_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-sky-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl group-hover:bg-sky-500/20 group-hover:border-sky-500/30 transition-all">
                  📘
                </div>
                <span className="text-sm">Facebook</span>
              </a>
              <a 
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-3 text-slate-400 hover:text-sky-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl group-hover:bg-sky-500/20 group-hover:border-sky-500/30 transition-all">
                  ✉️
                </div>
                <span className="text-sm">Email</span>
              </a>
              <a 
                href={`tel:${COMPANY_INFO.phone}`}
                className="flex items-center gap-3 text-slate-400 hover:text-sky-400 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-xl group-hover:bg-sky-500/20 group-hover:border-sky-500/30 transition-all">
                  📞
                </div>
                <span className="text-sm">Hotline</span>
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center text-slate-400 letter-spacing-wide">
          <p>© 2025 VISTA - Patient Journey. Made with 💙 for better eye health.</p>
          <p className="text-sm mt-2 text-slate-500">
            {COMPANY_INFO.address}
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ================= MAIN APP ================= */
function App() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const VIDEO_DEMO_URL = 'https://res.cloudinary.com/dvucotc8z/video/upload/v1761540376/20251027_1103_New_Video_simple_compose_01k8hxbwz2e6sreb777hvnabfx_resmmr.mp4'
  
  return (
    <div className="bg-slate-900 text-white">
      <Header />
      <HeroSection onDemoClick={() => setIsVideoModalOpen(true)} />
      
      {/* Scrolling banner */}
      <div className="bg-slate-950 border-y border-white/10">
        <ScrollingText items={['BỀN VỮNG', 'GIẢI PHÁP', 'TÁI TẠO', 'CÔNG NGHỆ']} />
      </div>
      
      {/* 3D Eye Animations Section */}
      <EyeAnimationsSection />
      
      <BentoGridSection />
      <JourneySection />
      <RewardsSection />
      <CTASection />
      <Footer />
      <VistaChatbot />
      
      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
        videoUrl={VIDEO_DEMO_URL}
      />
    </div>
  )
}

export default App
