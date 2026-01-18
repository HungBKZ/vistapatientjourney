// Podcast Page - VISTA Audio Content (Spotify-style)
import { useState, useRef, useEffect } from 'react'
import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'

const podcastData = {
  episodes: [
    {
      id: 1,
      title: 'Dùng thuốc & vệ sinh mắt đúng cách',
      audioUrl: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762868105/1110_nru1wb.mp4',
      description: 'Hướng dẫn chi tiết cách nhỏ thuốc và vệ sinh mắt an toàn sau phẫu thuật khúc xạ',
      scriptSections: [
        {
          step: 1,
          title: 'Chào mừng đến với VISTA Podcast',
          content: 'Chào mừng bạn đến với VISTA Podcast – kênh chia sẻ kiến thức chăm sóc mắt sau phẫu thuật khúc xạ, được biên soạn cùng đội ngũ chuyên môn từ bệnh viện mắt Visi. Ở tập đầu tiên hôm nay, chúng ta sẽ cùng nhau tìm hiểu cách nhỏ thuốc và vệ sinh mắt đúng cách, để giúp mắt hồi phục nhanh và an toàn nhất.'
        },
        {
          step: 2,
          title: 'Rửa tay sạch trước khi chạm mắt',
          content: 'Trước hết, hãy luôn rửa tay thật sạch trước khi chạm vào mắt. Đây là bước quan trọng để tránh nhiễm trùng.'
        },
        {
          step: 3,
          title: 'Chuẩn bị và tư thế nhỏ thuốc',
          content: 'Lắc đều lọ thuốc nhỏ mắt, rồi nằm hoặc ngồi – hơi ngửa đầu ra sau để thuốc dễ dàng vào mắt hơn.'
        },
        {
          step: 4,
          title: 'Kỹ thuật nhỏ thuốc chính xác',
          content: 'Dùng tay kéo nhẹ mi dưới, nhỏ 1 đến 2 giọt thuốc, nhớ nhé – đừng nhỏ trực tiếp vào tròng đen. Sau đó, chớp mắt nhẹ nhàng để thuốc loang đều.'
        },
        {
          step: 5,
          title: 'Thứ tự sử dụng nhiều loại thuốc',
          content: 'Nếu đơn thuốc có nhiều loại, hãy nhỏ nước mắt nhân tạo trước, rồi mới đến thuốc kháng viêm. Nếu thấy đau, rát, hoặc cộm kéo dài, hãy gọi ngay hotline của bệnh viện nơi bạn phẫu thuật để được hỗ trợ.'
        },
        {
          step: 6,
          title: 'Vệ sinh mắt khi có ghèn',
          content: 'Khi mắt tiết nhiều ghèn, chỉ cần nhỏ nước muối sinh lý Natri Clorua, sau đó dùng gạc vô trùng để lau sạch – nhẹ nhàng thôi, không chà mạnh nhé.'
        },
        {
          step: 7,
          title: 'Lời kết & hẹn gặp lại',
          content: 'Vậy là bạn đã biết cách dùng thuốc và vệ sinh mắt an toàn sau phẫu thuật. Hãy nghe lại tập này nếu cần nhắc lại các bước, và luôn tuân thủ hướng dẫn của bác sĩ. Hẹn gặp bạn ở Tập 2, nơi VISTA Podcast sẽ chia sẻ 4 điều tuyệt đối cần tránh trong tuần đầu tiên sau phẫu thuật khúc xạ.'
        }
      ],
      coverImage: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1762871747/z7213899486898_ffb7cd852297c45da38cac78d9e643fe_mznf6r.jpg',
      duration: '5:30',
      releaseDate: '15/10/2024'
    },
    {
      id: 2,
      title: '4 điều tuyệt đối tránh sau phẫu thuật',
      audioUrl: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762868105/1110_nru1wb.mp4',
      description: 'Những hành động cần tránh tuyệt đối trong tuần đầu tiên sau phẫu thuật khúc xạ',
      scriptSections: [
        {
          step: 1,
          title: 'Không chà xát mắt mạnh',
          content: 'Tuyệt đối không chà xát, day, hoặc ấn mạnh vào mắt trong vòng 1 tháng đầu. Hành động này có thể làm di lệch giác mạc và ảnh hưởng đến kết quả phẫu thuật.'
        },
        {
          step: 2,
          title: 'Tránh nước vào mắt',
          content: 'Không để nước bẩn, nước ao, hồ bơi tiếp xúc với mắt trong 2 tuần đầu. Khi tắm rửa, hãy che chắn cẩn thận để tránh nước và xà phòng.'
        },
        {
          step: 3,
          title: 'Hạn chế vận động mạnh',
          content: 'Tránh các hoạt động thể thao mạnh, nâng vật nặng trong 1 tháng đầu. Điều này giúp giác mạc có thời gian hồi phục ổn định.'
        },
        {
          step: 4,
          title: 'Không tự ý dừng thuốc',
          content: 'Luôn tuân thủ đầy đủ liệu trình thuốc theo chỉ định của bác sĩ. Không tự ý ngừng hoặc thay đổi liều lượng dù mắt đã cảm thấy tốt hơn.'
        }
      ],
      coverImage: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
      duration: '4:15',
      releaseDate: '22/10/2024'
    },
    {
      id: 3,
      title: 'Chế độ dinh dưỡng cho mắt khỏe',
      audioUrl: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762868105/1110_nru1wb.mp4',
      description: 'Thực phẩm và chế độ ăn uống giúp mắt hồi phục nhanh sau phẫu thuật',
      scriptSections: [
        {
          step: 1,
          title: 'Thực phẩm giàu Vitamin A',
          content: 'Cà rốt, rau bina, khoai lang là những nguồn cung cấp Vitamin A tuyệt vời cho mắt. Vitamin A giúp tái tạo tế bào và cải thiện thị lực.'
        },
        {
          step: 2,
          title: 'Omega-3 từ cá biển',
          content: 'Cá hồi, cá thu, cá ngừ chứa nhiều Omega-3 giúp giảm viêm và hỗ trợ sức khỏe võng mạc.'
        },
        {
          step: 3,
          title: 'Trái cây họ cam quýt',
          content: 'Cam, chanh, bưởi giàu Vitamin C - chất chống oxi hóa mạnh mẽ, bảo vệ mắt khỏi tổn thương tự do.'
        }
      ],
      coverImage: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
      duration: '6:00',
      releaseDate: '29/10/2024'
    },
    {
      id: 4,
      title: 'Bài tập thư giãn cho đôi mắt',
      audioUrl: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762868105/1110_nru1wb.mp4',
      description: 'Các bài tập giúp giảm mỏi mắt và tăng cường tuần hoàn máu vùng mắt',
      scriptSections: [
        {
          step: 1,
          title: 'Quy tắc 20-20-20',
          content: 'Cứ sau 20 phút làm việc, hãy nhìn vật cách xa 20 feet (6m) trong 20 giây để mắt được nghỉ ngơi.'
        },
        {
          step: 2,
          title: 'Xoa bóp huyệt đạo',
          content: 'Massage nhẹ nhàng các huyệt xung quanh mắt giúp tăng tuần hoàn máu và giảm căng thẳng.'
        }
      ],
      coverImage: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
      duration: '5:45',
      releaseDate: '05/11/2024',
      isNew: true
    }
  ]
}

const PodcastPage = () => {
  const [currentEpisode, setCurrentEpisode] = useState(podcastData.episodes[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showScript, setShowScript] = useState(true)
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleDurationChange = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('durationchange', handleDurationChange)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('durationchange', handleDurationChange)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (e) => {
    const seekTime = (e.target.value / 100) * duration
    audioRef.current.currentTime = seekTime
    setCurrentTime(seekTime)
  }

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100
    setVolume(newVolume)
    audioRef.current.volume = newVolume
  }

  const skipForward = () => {
    audioRef.current.currentTime = Math.min(currentTime + 10, duration)
  }

  const skipBackward = () => {
    audioRef.current.currentTime = Math.max(currentTime - 10, 0)
  }

  const changeEpisode = (episode) => {
    // Pause current audio if playing
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
    // Reset states
    setCurrentTime(0)
    setDuration(0)
    // Change episode
    setCurrentEpisode(episode)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100">
      {/* Header */}
      <Motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/95 border-b border-blue-300/50 shadow-lg shadow-blue-500/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <img 
                src={LOGO_URL}
                alt="VISTA Logo"
                className="relative w-10 h-10 sm:w-14 sm:h-14 rounded-2xl object-cover ring-2 ring-white shadow-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">VISTA Podcast</span>
              <span className="text-xs sm:text-sm text-gray-600 font-medium hidden sm:block">Tập 1: Chăm sóc mắt sau phẫu thuật</span>
            </div>
          </Link>
          
          <Link 
            to="/"
            className="px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105"
          >
            <span className="hidden sm:inline">← Về trang chủ</span>
            <span className="sm:hidden">← Về</span>
          </Link>
        </div>
      </Motion.header>

      {/* Main Content */}
      <div className="pt-20 sm:pt-28 pb-24 sm:pb-36 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left: Player Section */}
            <Motion.div
              className="lg:col-span-1 space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Cover Art Card */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-square relative">
                    <img 
                      src={currentEpisode.coverImage}
                      alt={currentEpisode.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Episode Badge */}
                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-white/95 backdrop-blur-sm shadow-lg">
                      <span className="text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        TẬP {currentEpisode.id}
                      </span>
                    </div>
                    
                    {/* Playing Animation */}
                    {isPlaying && (
                      <Motion.div 
                        className="absolute top-2 right-2 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-green-500 text-white text-xs sm:text-sm font-bold shadow-xl"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <div className="flex gap-0.5 sm:gap-1">
                          <Motion.div className="w-0.5 sm:w-1 h-3 sm:h-4 bg-white rounded-full" animate={{ height: ['12px', '6px', '12px'] }} transition={{ duration: 0.6, repeat: Infinity }} />
                          <Motion.div className="w-0.5 sm:w-1 h-3 sm:h-4 bg-white rounded-full" animate={{ height: ['6px', '12px', '6px'] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} />
                          <Motion.div className="w-0.5 sm:w-1 h-3 sm:h-4 bg-white rounded-full" animate={{ height: ['12px', '6px', '12px'] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} />
                        </div>
                        <span className="hidden sm:inline">Đang phát</span>
                        <span className="sm:hidden">▶</span>
                      </Motion.div>
                    )}
                  </div>

                  {/* Episode Info Inside Card */}
                  <div className="p-4 sm:p-6">
                    <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3">
                      {currentEpisode.title}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                      {currentEpisode.description}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 text-blue-700 text-xs sm:text-sm font-bold">
                        🎧 Podcast
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls Card */}
              <div className="sticky top-20 sm:top-28">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-white rounded-2xl border-2 border-blue-100 p-4 sm:p-6 shadow-xl">
                {/* Progress Bar */}
                <div className="mb-3 sm:mb-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="w-full h-1.5 sm:h-2 bg-blue-100 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 sm:[&::-webkit-slider-thumb]:w-4 sm:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer hover:[&::-webkit-slider-thumb]:bg-blue-700"
                  />
                  <div className="flex justify-between text-xs sm:text-sm text-gray-500 mt-1.5 sm:mt-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Play Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <button
                    onClick={skipBackward}
                    className="w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition-all"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.10-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.11-.32.04-.29.04-.48v-.97z"/>
                    </svg>
                  </button>

                  <Motion.button
                    onClick={togglePlay}
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-sky-600 hover:from-blue-600 hover:to-sky-700 text-white flex items-center justify-center shadow-xl shadow-blue-500/30 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? (
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </Motion.button>

                  <button
                    onClick={skipForward}
                    className="w-12 h-12 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 flex items-center justify-center transition-all"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.01 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm-.86 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.10-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.11-.32.04-.29.04-.48v-.97z"/>
                    </svg>
                  </button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume * 100}
                    onChange={handleVolumeChange}
                    className="flex-1 h-1.5 sm:h-2 bg-gray-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:h-2.5 sm:[&::-webkit-slider-thumb]:w-3 sm:[&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-600 [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
                  </div>
                </div>
              </div>
            </Motion.div>

            {/* Right: Script Timeline Section */}
            <Motion.div
              className="lg:col-span-2 space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                    📝
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Nội dung chi tiết</h2>
                    <p className="text-xs sm:text-sm text-gray-500">{currentEpisode.scriptSections.length} bước hướng dẫn</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowScript(!showScript)}
                  className="px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm sm:text-base font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all transform hover:scale-105"
                >
                  <span className="hidden sm:inline">{showScript ? '👁️ Ẩn' : '👁️ Hiện'}</span>
                  <span className="sm:hidden">{showScript ? '👁️' : '👁️'}</span>
                </button>
              </div>

              {/* Timeline Steps */}
              {showScript && (
                <Motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {currentEpisode.scriptSections.map((section, index) => (
                    <Motion.div
                      key={section.step}
                      className="relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex gap-3 sm:gap-4">
                        {/* Step Number Circle */}
                        <div className="flex-shrink-0 relative">
                          <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/30">
                            <span className="text-white text-base sm:text-xl font-bold">{section.step}</span>
                          </div>
                          {/* Connecting Line */}
                          {index < currentEpisode.scriptSections.length - 1 && (
                            <div className="absolute top-10 left-5 sm:top-14 sm:left-7 w-0.5 h-8 sm:h-12 bg-gradient-to-b from-blue-400 to-purple-400 opacity-30" />
                          )}
                        </div>

                        {/* Content Card */}
                        <div className="flex-1 group">
                          <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity" />
                            <div className="relative bg-white rounded-xl sm:rounded-2xl border-2 border-gray-100 group-hover:border-blue-200 p-4 sm:p-5 shadow-lg transition-all">
                              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1.5 sm:mb-2 flex items-center gap-2">
                                <span className="flex-1">{section.title}</span>
                                {section.step === 1 && <span className="text-lg sm:text-xl">👋</span>}
                                {section.step === 2 && <span className="text-lg sm:text-xl">🧼</span>}
                                {section.step === 3 && <span className="text-lg sm:text-xl">💊</span>}
                                {section.step === 4 && <span className="text-lg sm:text-xl">💧</span>}
                                {section.step === 5 && <span className="text-lg sm:text-xl">📋</span>}
                                {section.step === 6 && <span className="text-lg sm:text-xl">🧹</span>}
                                {section.step === 7 && <span className="text-lg sm:text-xl">✨</span>}
                              </h3>
                              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                {section.content}
                              </p>
                              
                              {/* Progress indicator for current playing time could go here */}
                              {section.step === 1 && (
                                <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                  <span className="font-semibold">Phần giới thiệu</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Motion.div>
                  ))}
                </Motion.div>
              )}
            </Motion.div>
          </div>

          {/* All Episodes Section */}
          <Motion.div
            className="mt-8 sm:mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl sm:text-2xl shadow-lg">
                  🎙️
                </div>
                <div>
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-800">Tất cả các tập</h2>
                  <p className="text-xs sm:text-sm text-gray-500">{podcastData.episodes.length} tập podcast</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {podcastData.episodes.map((episode, index) => (
                <Motion.div
                  key={episode.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => changeEpisode(episode)}
                >
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity" />
                    <div className={`relative rounded-xl sm:rounded-2xl border-2 p-4 sm:p-5 transition-all ${
                      currentEpisode.id === episode.id 
                        ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-400 shadow-xl' 
                        : 'bg-white border-gray-200 group-hover:border-blue-300 shadow-lg group-hover:shadow-xl'
                    }`}>
                      <div className="flex gap-3 sm:gap-4">
                        {/* Episode Thumbnail */}
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                            <img 
                              src={episode.coverImage}
                              alt={episode.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {/* Episode Number Badge */}
                          <div className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg">
                            {episode.id}
                          </div>
                          {/* New Badge */}
                          {episode.isNew && (
                            <Motion.div 
                              className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 px-1.5 py-0.5 sm:px-2 rounded-sm sm:rounded-md bg-red-500 text-white text-[10px] sm:text-xs font-bold shadow-lg"
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              NEW
                            </Motion.div>
                          )}
                        </div>

                        {/* Episode Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm sm:text-base font-bold mb-1 line-clamp-2 ${
                            currentEpisode.id === episode.id ? 'text-blue-700' : 'text-gray-800 group-hover:text-blue-600'
                          }`}>
                            {episode.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-1.5 sm:mb-2">
                            {episode.description}
                          </p>
                          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              ⏱️ {episode.duration}
                            </span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:flex items-center gap-1">
                              📅 {episode.releaseDate}
                            </span>
                          </div>
                        </div>

                        {/* Play Button Overlay */}
                        <div className="flex-shrink-0 flex items-center">
                          {currentEpisode.id === episode.id && isPlaying ? (
                            <Motion.div 
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white shadow-lg"
                              animate={{ scale: [1, 1.05, 1] }}
                              transition={{ duration: 1, repeat: Infinity }}
                            >
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                              </svg>
                            </Motion.div>
                          ) : (
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
                              currentEpisode.id === episode.id
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 text-gray-600 group-hover:text-white'
                            }`}>
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentEpisode.audioUrl} preload="metadata" />
    </div>
  )
}

export default PodcastPage
