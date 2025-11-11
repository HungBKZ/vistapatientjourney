// Studio 360° Page - VISTA Patient Journey
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'
// Skybox 360° Interactive Viewer from Blockade Labs
const SKYBOX_360_URL = 'https://skybox.blockadelabs.com/e/a4a35bb78bf856af69b9beccb1625023'

const Studio360Page = () => {

  const features = [
    {
      icon: '🏥',
      title: 'Phòng Mổ Ảo 360°',
      description: 'Trải nghiệm phòng mổ nhãn khoa chân thực với công nghệ Skybox 360°'
    },
    {
      icon: '👨‍⚕️',
      title: 'Tương Tác Thực Tế',
      description: 'Kéo để xoay góc nhìn 360°, khám phá toàn bộ không gian phòng mổ'
    },
    {
      icon: '🎓',
      title: 'Học Tập Tương Tác',
      description: 'Quan sát chi tiết thiết bị y tế và không gian phẫu thuật'
    },
    {
      icon: '🔍',
      title: 'Chất Lượng Cao',
      description: 'Hình ảnh 360° sắc nét, trải nghiệm như đang ở thực tế'
    }
  ]

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
              {/* Skybox 360° Interactive Viewer */}
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 shadow-2xl">
                <iframe 
                  src={SKYBOX_360_URL}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
                  title="Phòng mổ 360° - Vista Patient Journey"
                />
                
                {/* Corner Labels */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-100 backdrop-blur-sm border border-blue-200 text-blue-700 text-xs font-semibold shadow-lg">
                  🎬 Skybox 360°
                </div>
                
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-sky-100 backdrop-blur-sm border border-sky-200 text-sky-700 text-xs font-semibold shadow-lg">
                  🔄 Interactive VR
                </div>
              </div>

              {/* Info Banner */}
              <Motion.div 
                className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 text-blue-700 text-sm text-center shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🎮</span>
                  <div>
                    <strong>Hướng dẫn tương tác:</strong> Kéo chuột để xoay 360°, cuộn để zoom, click vào góc để fullscreen
                  </div>
                </div>
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
