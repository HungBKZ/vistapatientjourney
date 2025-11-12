// Video Learning Page - VISTA Video Courses
import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'

const videoData = {
  courses: [
    {
      id: 1,
      title: 'Điều cần biết về thoái hóa điểm vàng',
      videoUrl: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762870959/%C4%90i%E1%BB%81u_c%E1%BA%A7n_bi%E1%BA%BFt_v%E1%BB%81_THO%C3%81I_H%C3%93A_%C4%90I%E1%BB%82M_V%C3%80NG_HO%C3%80NG_%C4%90I%E1%BB%82M_-_B%E1%BB%87nh_vi%E1%BB%87n_M%E1%BA%AFt_Hoa_L%C6%B0_oxvkbh.mp4',
      thumbnail: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
      category: 'Bệnh lý',
      level: 'Cơ bản',
      description: 'Thoái hóa điểm vàng (AMD) là nguyên nhân hàng đầu gây mất thị lực ở người cao tuổi. Tìm hiểu triệu chứng, nguyên nhân và cách phòng ngừa hiệu quả.',
      topics: ['Triệu chứng nhận biết', 'Các yếu tố nguy cơ', 'Phương pháp điều trị', 'Chế độ dinh dưỡng phù hợp'],
      views: '2.4K',
      instructor: 'BS. Nguyễn Văn A',
      rating: 4.8,
      students: 156
    },
    {
      id: 2,
      title: 'Tìm hiểu về thể thủy tinh nhân tạo',
      videoUrl: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762871745/52_T%C3%8CM_HI%E1%BB%82U_V%E1%BB%80_TH%E1%BB%82_TH%E1%BB%A6Y_TINH_NH%C3%82N_T%E1%BA%A0O_-_YouTube_qyibb9.mp4',
      thumbnail: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
      category: 'Phẫu thuật',
      level: 'Nâng cao',
      description: 'Thủy tinh thể nhân tạo (IOL) là giải pháp thay thế thủy tinh thể tự nhiên trong phẫu thuật đục thủy tinh thể. Tìm hiểu các loại IOL và lựa chọn phù hợp.',
      topics: ['Các loại IOL', 'Quy trình phẫu thuật', 'Chăm sóc sau mổ', 'Lợi ích & rủi ro'],
      views: '3.1K',
      instructor: 'PGS.TS Trần Thị B',
      rating: 4.9,
      students: 203,
      isNew: true
    },
    {
      id: 3,
      title: 'Viêm kết mạc - Đau mắt đỏ là gì?',
      videoUrl: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762908688/54_VI%C3%8AM_K%E1%BA%BET_M%E1%BA%A0C_%C4%90AU_M%E1%BA%AET_%C4%90%E1%BB%8E_L%C3%80_G%C3%8C-_-_YouTube_ctefo6.mp4',
      thumbnail: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
      category: 'Bệnh lý',
      level: 'Cơ bản',
      description: 'Viêm kết mạc (đau mắt đỏ) là tình trạng viêm nhiễm phổ biến. Học cách nhận biết, xử lý và phòng tránh lây lan hiệu quả.',
      topics: ['Nguyên nhân viêm', 'Triệu chứng đặc trưng', 'Cách điều trị', 'Phòng ngừa lây lan'],
      views: '1.8K',
      instructor: 'BS. Lê Văn C',
      rating: 4.7,
      students: 142,
      isNew: true
    }
  ],
  categories: ['Tất cả', 'Bệnh lý', 'Phẫu thuật', 'Chăm sóc', 'Khúc xạ']
}

const VideoPage = () => {
  const [selectedVideo, setSelectedVideo] = useState(videoData.courses[0])
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')
  const [showDescription, setShowDescription] = useState(true)

  const filteredCourses = selectedCategory === 'Tất cả' 
    ? videoData.courses 
    : videoData.courses.filter(course => course.category === selectedCategory)

  const selectVideo = (course) => {
    setSelectedVideo(course)
    // Scroll to top of video player
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <Motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/90 border-b border-indigo-200/50 shadow-lg shadow-indigo-500/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <img 
                src={LOGO_URL}
                alt="VISTA Logo"
                className="relative w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">VISTA Learning</span>
              <span className="text-sm text-gray-600 font-medium">Video hướng dẫn chuyên môn</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
              <span className="text-2xl">📚</span>
              <div className="text-sm">
                <div className="font-bold text-indigo-700">{videoData.courses.length} khóa học</div>
                <div className="text-gray-600 text-xs">Miễn phí</div>
              </div>
            </div>
            <Link 
              to="/"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all transform hover:scale-105"
            >
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </Motion.header>

      {/* Main Content */}
      <div className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Video Player & Info (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              <Motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video">
                    <video 
                      key={selectedVideo.id}
                      controls 
                      className="w-full h-full"
                      poster={selectedVideo.thumbnail}
                    >
                      <source src={selectedVideo.videoUrl} type="video/mp4" />
                      Trình duyệt của bạn không hỗ trợ video.
                    </video>
                    
                    {/* Video Overlay Info */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-sm font-bold border border-white/20">
                        ⏱️ {selectedVideo.duration}
                      </span>
                      <span className={`px-3 py-1.5 rounded-lg backdrop-blur-sm text-white text-sm font-bold border ${
                        selectedVideo.level === 'Cơ bản' 
                          ? 'bg-green-500/80 border-green-300/50' 
                          : 'bg-orange-500/80 border-orange-300/50'
                      }`}>
                        {selectedVideo.level}
                      </span>
                      {selectedVideo.isNew && (
                        <Motion.span 
                          className="px-3 py-1.5 rounded-lg bg-red-500/90 backdrop-blur-sm text-white text-sm font-bold border border-red-300/50"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          🔥 MỚI
                        </Motion.span>
                      )}
                    </div>
                  </div>
                </div>
              </Motion.div>

              {/* Video Info Card */}
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-2xl blur opacity-20" />
                  <div className="relative bg-white rounded-2xl border-2 border-indigo-100 p-6 shadow-xl">
                    {/* Title & Category */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                          {selectedVideo.title}
                        </h1>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-300 text-indigo-700 text-sm font-bold">
                            📂 {selectedVideo.category}
                          </span>
                          <span className="text-gray-500 text-sm">👁️ {selectedVideo.views} lượt xem</span>
                          <span className="text-gray-500 text-sm">👨‍🎓 {selectedVideo.students} học viên</span>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          <span className="text-2xl">⭐</span>
                          <span className="text-2xl font-bold text-gray-800">{selectedVideo.rating}</span>
                        </div>
                        <div className="text-xs text-gray-500">Đánh giá</div>
                      </div>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        👨‍⚕️
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Giảng viên</div>
                        <div className="font-bold text-gray-800">{selectedVideo.instructor}</div>
                      </div>
                    </div>

                    {/* Toggle Description */}
                    <button
                      onClick={() => setShowDescription(!showDescription)}
                      className="w-full flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors mb-4"
                    >
                      <span className="font-bold text-gray-800">📝 Mô tả khóa học</span>
                      <Motion.span
                        animate={{ rotate: showDescription ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        ▼
                      </Motion.span>
                    </button>

                    {/* Description Content */}
                    <AnimatePresence>
                      {showDescription && (
                        <Motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="space-y-4">
                            <p className="text-gray-700 leading-relaxed">
                              {selectedVideo.description}
                            </p>
                            
                            {/* Topics */}
                            <div>
                              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span className="text-xl">📚</span>
                                Nội dung chính:
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {selectedVideo.topics.map((topic, index) => (
                                  <Motion.div
                                    key={index}
                                    className="flex items-center gap-2 p-3 rounded-lg bg-white border border-indigo-100 shadow-sm"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                  >
                                    <span className="text-indigo-600 font-bold">✓</span>
                                    <span className="text-gray-700 text-sm">{topic}</span>
                                  </Motion.div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </Motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </Motion.div>
            </div>

            {/* Right: Course List (1/3 width) */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                {/* Category Filter */}
                <Motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <div className="bg-white rounded-2xl border-2 border-indigo-100 p-4 shadow-xl">
                    <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-xl">🏷️</span>
                      Danh mục
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {videoData.categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all transform hover:scale-105 ${
                            selectedCategory === category
                              ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </Motion.div>

                {/* Course List */}
                <Motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <div className="bg-white rounded-2xl border-2 border-indigo-100 p-4 shadow-xl">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">📺</span>
                      Khóa học khác ({filteredCourses.length})
                    </h3>
                    
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                      {filteredCourses.map((course, index) => (
                        <Motion.div
                          key={course.id}
                          className="group cursor-pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          onClick={() => selectVideo(course)}
                        >
                          <div className={`relative rounded-xl border-2 p-3 transition-all ${
                            selectedVideo.id === course.id
                              ? 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-400 shadow-lg'
                              : 'bg-gray-50 border-gray-200 hover:border-indigo-300 hover:bg-white hover:shadow-md'
                          }`}>
                            <div className="flex gap-3">
                              {/* Thumbnail */}
                              <div className="relative flex-shrink-0">
                                <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-200">
                                  <img 
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover"
                                  />
                                  {/* Duration Overlay */}
                                  <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/80 text-white text-xs font-bold">
                                    {course.duration}
                                  </div>
                                </div>
                                {course.isNew && (
                                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                                    N
                                  </div>
                                )}
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <h4 className={`font-bold text-sm line-clamp-2 mb-1 ${
                                  selectedVideo.id === course.id ? 'text-indigo-700' : 'text-gray-800 group-hover:text-indigo-600'
                                }`}>
                                  {course.title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <span>👁️ {course.views}</span>
                                  <span>•</span>
                                  <span>⭐ {course.rating}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Motion.div>
                      ))}
                    </div>
                  </div>
                </Motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6366f1, #a855f7);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #4f46e5, #9333ea);
        }
      `}</style>
    </div>
  )
}

export default VideoPage
