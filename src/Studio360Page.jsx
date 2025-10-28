// Studio 360° Page - VISTA Patient Journey
import { useState, useRef } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'
// High quality 360° Video with interactive controls
const STUDIO_360_VIDEO = 'https://res.cloudinary.com/dvucotc8z/video/upload/v1761413824/20251026_0029_New_Video_simple_compose_01k8e6ng8pej0rr0ne0d140866_eftwd1.mp4'

const Studio360Page = () => {
  const [showControls, setShowControls] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
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
      title: 'Tương Tác Chuột',
      description: 'Zoom bằng chuột cuộn, kéo để di chuyển, double-click để reset'
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
    setPan({ x: 0, y: 0 })
  }

  // Mouse interaction handlers for Video
  const handleWheel = (e) => {
    e.preventDefault()
    const delta = e.deltaY * -0.001
    setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 2))
  }

  const handleMouseDown = (e) => {
    setIsDragging(true)
    setDragStart({
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    })
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleDoubleClick = () => {
    handleReset()
  }

  // Video play/pause handler
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Header */}
      <Motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/95 border-b border-blue-100 shadow-lg shadow-blue-500/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <img 
              src={LOGO_URL}
              alt="VISTA Logo"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-400/30 group-hover:ring-blue-400/60 transition-all"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-800">VISTA</span>
              <span className="text-xs text-gray-600">Hành trình chăm sóc mắt</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-100 border border-blue-200 text-blue-700 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              360° Interactive
            </div>
            <Link 
              to="/"
              className="px-6 py-2 rounded-xl border-2 border-blue-500 text-blue-600 font-semibold hover:bg-blue-50 transition-all"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </Motion.header>

      {/* Main Content */}
      <div className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Title Section */}
          <Motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span>🎬</span>
              Trải nghiệm 360°
            </Motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-blue-700 bg-clip-text text-transparent letter-spacing-wide">
                Studio 360° Phòng Mổ Ảo
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed letter-spacing-wide">
              Khám phá không gian phẫu thuật nhãn khoa với công nghệ 3D 360° tương tác
            </p>
          </Motion.div>

          {/* 360° Viewer */}
          <Motion.div
            className="mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="relative rounded-3xl overflow-hidden bg-white border border-blue-100 p-4 shadow-xl shadow-blue-500/10">
              {/* Controls Overlay */}
              {showControls && (
                <Motion.div 
                  className="absolute top-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 px-6 py-3 rounded-full bg-white/95 backdrop-blur-xl border border-blue-200 shadow-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={handleZoomOut}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition-all"
                    title="Zoom Out"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                    </svg>
                  </button>
                  
                  <div className="text-gray-800 font-semibold min-w-[80px] text-center">
                    {Math.round(zoom * 100)}%
                  </div>
                  
                  <button
                    onClick={handleZoomIn}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition-all"
                    title="Zoom In"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </button>
                  
                  <div className="w-px h-8 bg-blue-200" />
                  
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/30"
                  >
                    Reset
                  </button>
                  
                  <button
                    onClick={() => setShowControls(false)}
                    className="w-10 h-10 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition-all"
                    title="Hide Controls"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </Motion.div>
              )}

              {/* Show Controls Button (when hidden) */}
              {!showControls && (
                <button
                  onClick={() => setShowControls(true)}
                  className="absolute top-8 left-1/2 -translate-x-1/2 z-10 px-6 py-3 rounded-full bg-white/95 backdrop-blur-xl border border-blue-200 text-gray-800 font-semibold hover:bg-blue-50 transition-all shadow-lg"
                >
                  Hiển thị điều khiển
                </button>
              )}

              {/* 360° Video Player with Interactive Controls */}
              <div 
                className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onDoubleClick={handleDoubleClick}
              >
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
                  }}
                >
                  <video 
                    ref={videoRef}
                    src={STUDIO_360_VIDEO}
                    className="w-full h-full object-contain select-none"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm border-2 border-blue-200 hover:border-blue-400 text-blue-700 flex items-center justify-center transition-all hover:scale-110 group shadow-lg"
                >
                  {isPlaying ? (
                    <svg className="w-8 h-8 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 ml-1 group-hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>

                {/* Interactive Hint */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm border border-blue-200 text-gray-700 text-sm shadow-lg">
                  <Motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🔄
                  </Motion.div>
                  <span>Cuộn để zoom, kéo để di chuyển</span>
                </div>

                {/* Corner Labels */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-100 backdrop-blur-sm border border-blue-200 text-blue-700 text-xs font-semibold">
                  3D View
                </div>
                
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sky-100 backdrop-blur-sm border border-sky-200 text-sky-700 text-xs font-semibold">
                  360° Interactive
                </div>
              </div>

              {/* Info Banner */}
              <Motion.div 
                className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                💡 <strong>Hướng dẫn:</strong> Cuộn chuột để zoom, kéo để di chuyển, double-click để reset, nhấn Play/Pause để điều khiển video
              </Motion.div>
            </div>
          </Motion.div>

          {/* Features Grid */}
          <Motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-center mb-8">
              <span className="bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                Tính Năng Nổi Bật
              </span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <Motion.div
                  key={i}
                  className="p-6 rounded-2xl bg-white backdrop-blur-xl border border-blue-100 hover:border-blue-300 transition-all group shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 letter-spacing-wide">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm letter-spacing-wide">
                    {feature.description}
                  </p>
                </Motion.div>
              ))}
            </div>
          </Motion.div>

          {/* Coming Soon Section */}
          <Motion.div
            className="text-center p-12 rounded-3xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 shadow-xl shadow-blue-500/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <div className="text-6xl mb-6">🚀</div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Sắp Ra Mắt
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-6">
              Phiên bản VR tương tác hoàn toàn, cho phép bạn di chuyển tự do trong không gian 3D
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm">
                🥽 VR Headset Support
              </div>
              <div className="px-4 py-2 rounded-full bg-sky-100 border border-sky-200 text-sky-700 text-sm">
                🎮 Interactive Controls
              </div>
              <div className="px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm">
                📱 Mobile AR
              </div>
            </div>
          </Motion.div>
        </div>
      </div>
    </div>
  )
}

export default Studio360Page
