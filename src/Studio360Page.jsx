// Studio 360° Page - VISTA Patient Journey
import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'
// High quality 360° Video
const STUDIO_360_VIDEO = 'https://res.cloudinary.com/dvucotc8z/video/upload/v1761413824/20251026_0029_New_Video_simple_compose_01k8e6ng8pej0rr0ne0d140866_eftwd1.mp4'

const Studio360Page = () => {
  const [showControls, setShowControls] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef(null)

  const features = [
    {
      icon: '🏥',
      title: 'Phòng Mổ Ảo',
      description: 'Trải nghiệm phòng mổ nhãn khoa chân thực với công nghệ 360°'
    },
    {
      icon: '👨‍⚕️',
      title: 'Tương Tác Thực Tế',
      description: 'Quan sát quy trình phẫu thuật từ mọi góc độ'
    },
    {
      icon: '🎓',
      title: 'Học Tập Tương Tác',
      description: 'Hiểu rõ từng bước trong ca phẫu thuật mắt'
    },
    {
      icon: '🔍',
      title: 'Chi Tiết 3D',
      description: 'Zoom vào từng thiết bị y tế và dụng cụ phẫu thuật'
    }
  ]

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5))
  }

  const handleReset = () => {
    setZoom(1)
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={LOGO_URL}
              alt="VISTA Logo"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-sky-400/30 group-hover:ring-sky-400/60 transition-all"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white">VISTA</span>
              <span className="text-xs text-slate-400">Patient Journey</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
              </span>
              360° Interactive
            </div>
            <Link 
              to="/"
              className="px-6 py-2 rounded-xl border-2 border-sky-400 text-sky-400 font-semibold hover:bg-sky-400/10 transition-all"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span>🎬</span>
              Trải nghiệm 360°
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent letter-spacing-wide">
                Studio 360° Phòng Mổ Ảo
              </span>
            </h1>
            
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed letter-spacing-wide">
              Khám phá không gian phẫu thuật nhãn khoa với công nghệ 3D 360° tương tác
            </p>
          </motion.div>

          {/* 360° Viewer */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-slate-800/50 border border-white/10 p-4">
              {/* Controls Overlay */}
              {showControls && (
                <motion.div 
                  className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 px-6 py-3 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all"
                    title="Zoom Out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </button>
                  
                  <div className="text-white font-semibold min-w-[80px] text-center">
                    {Math.round(zoom * 100)}%
                  </div>
                  
                  <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all"
                    title="Zoom In"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </button>
                  
                  <div className="w-px h-8 bg-white/20" />
                  
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-all"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={() => setShowControls(false)}
                    className="w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-all"
                    title="Hide Controls"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              )}

              {/* Show Controls Button (when hidden) */}
              {!showControls && (
                <button
                  onClick={() => setShowControls(true)}
                  className="absolute top-8 left-1/2 -translate-x-1/2 z-10 px-6 py-3 rounded-full bg-slate-900/90 backdrop-blur-xl border border-white/10 text-white font-semibold hover:bg-slate-800/90 transition-all"
                >
                  Hiển thị điều khiển
                </button>
              )}

              {/* 360° Video Player */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-900/50">
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  animate={{ scale: zoom }}
                  transition={{ type: "spring", damping: 20 }}
                >
                  <video 
                    ref={videoRef}
                    src={STUDIO_360_VIDEO}
                    className="w-full h-full object-contain"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </motion.div>

                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-slate-900/90 backdrop-blur-sm border-2 border-white/20 hover:border-sky-400/50 text-white flex items-center justify-center transition-all hover:scale-110 group"
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8 group-hover:text-sky-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 ml-1 group-hover:text-sky-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                {/* Rotation Indicator */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-sm border border-white/10 text-white text-sm">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🔄
                  </motion.div>
                  <span>360° View</span>
                </div>

                {/* Corner Labels */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 text-xs font-semibold">
                  3D View
                </div>
                
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sky-500/20 backdrop-blur-sm border border-sky-500/30 text-sky-300 text-xs font-semibold">
                  360° Rotation
                </div>
              </div>

              {/* Info Banner */}
              <motion.div 
                className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                💡 <strong>Tip:</strong> Video HD 360° - Sử dụng Zoom để xem chi tiết, nhấn nút Play/Pause để điều khiển
              </motion.div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-sky-400 to-purple-600 bg-clip-text text-transparent">
                Tính Năng Nổi Bật
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={i}
                  className="p-6 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-xl border border-white/10 hover:border-sky-500/30 transition-all group"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ y: -5, boxShadow: '0 25px 50px -12px rgba(14, 165, 233, 0.3)' }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 letter-spacing-wide">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm letter-spacing-wide">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Coming Soon Section */}
          <motion.div
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-6xl mb-6">🚀</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Sắp Ra Mắt
            </h3>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-6">
              Phiên bản VR tương tác hoàn toàn, cho phép bạn di chuyển tự do trong không gian 3D
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm">
                🥽 VR Headset Support
              </div>
              <div className="px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-sm">
                🎮 Interactive Controls
              </div>
              <div className="px-4 py-2 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-sm">
                📱 Mobile AR
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Studio360Page
