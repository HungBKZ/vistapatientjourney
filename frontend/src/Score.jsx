// Rewards & Points System - Hệ thống tích điểm thưởng
import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'

// Cách kiếm điểm
const pointActivities = [
  { id: 1, name: 'Hoàn thành bài học', points: 10, icon: '📚', color: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Làm quiz kiến thức', points: 15, icon: '🎯', color: 'from-purple-500 to-pink-500' },
  { id: 3, name: 'Xem video hướng dẫn', points: 5, icon: '📹', color: 'from-green-500 to-emerald-500' },
  { id: 4, name: 'Nghe podcast', points: 8, icon: '🎧', color: 'from-orange-500 to-red-500' },
  { id: 5, name: 'Đặt lịch khám thành công', points: 20, icon: '📅', color: 'from-indigo-500 to-purple-500' },
  { id: 6, name: 'Đăng nhập hàng ngày', points: 5, icon: '🔥', color: 'from-yellow-500 to-orange-500' },
  { id: 7, name: 'Giới thiệu bạn bè', points: 50, icon: '👥', color: 'from-pink-500 to-rose-500' }
]

// Cấp độ thành viên
const memberLevels = [
  { level: 1, name: 'Đồng', minPoints: 0, color: 'from-amber-600 to-amber-800', icon: '🥉', benefits: ['Giảm 5% dịch vụ', 'Tích điểm cơ bản'] },
  { level: 2, name: 'Bạc', minPoints: 500, color: 'from-gray-400 to-gray-600', icon: '🥈', benefits: ['Giảm 10% dịch vụ', 'Tích điểm x1.2', 'Ưu tiên đặt lịch'] },
  { level: 3, name: 'Vàng', minPoints: 1500, color: 'from-yellow-400 to-yellow-600', icon: '🥇', benefits: ['Giảm 15% dịch vụ', 'Tích điểm x1.5', 'Tư vấn miễn phí', 'Voucher sinh nhật'] },
  { level: 4, name: 'Bạch kim', minPoints: 3000, color: 'from-cyan-400 to-blue-600', icon: '💎', benefits: ['Giảm 20% dịch vụ', 'Tích điểm x2', 'Chăm sóc VIP', 'Khám miễn phí 1 lần/năm'] }
]

// Phần thưởng có thể đổi
const rewards = [
  {
    id: 1,
    name: 'Voucher khám mắt miễn phí',
    points: 200,
    icon: '👁️',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
    color: 'from-blue-500 to-cyan-500',
    description: 'Voucher khám mắt tổng quát tại Bệnh viện Mắt Sài Gòn Cần Thơ',
    stock: 'Còn 15 voucher',
    value: '200.000đ',
    popular: true
  },
  {
    id: 2,
    name: 'Voucher mua kính 200K',
    points: 300,
    icon: '👓',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
    color: 'from-purple-500 to-pink-500',
    description: 'Giảm 200K khi mua kính mắt tại cửa hàng đối tác',
    stock: 'Còn 25 voucher',
    value: '200.000đ',
    popular: true
  },
  {
    id: 3,
    name: 'Voucher thuốc nhỏ mắt',
    points: 150,
    icon: '💊',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
    color: 'from-green-500 to-emerald-500',
    description: 'Voucher 150K mua thuốc nhỏ mắt tại nhà thuốc',
    stock: 'Còn 30 voucher',
    value: '150.000đ'
  },
  {
    id: 4,
    name: 'Mũ bảo hiểm có kính',
    points: 500,
    icon: '🪖',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
    color: 'from-orange-500 to-red-500',
    description: 'Mũ bảo hiểm 3/4 có kính chống UV cao cấp',
    stock: 'Còn 10 chiếc',
    value: '500.000đ',
    popular: true
  },
  {
    id: 5,
    name: 'Gọng kính thời trang',
    points: 400,
    icon: '🕶️',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
    color: 'from-indigo-500 to-purple-500',
    description: 'Gọng kính thời trang chính hãng (chưa có tròng)',
    stock: 'Còn 12 chiếc',
    value: '400.000đ'
  },
  {
    id: 6,
    name: 'Combo chăm sóc mắt',
    points: 250,
    icon: '🧴',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
    color: 'from-teal-500 to-cyan-500',
    description: 'Bộ sản phẩm chăm sóc mắt: Nước rửa + Thuốc nhỏ + Khăn lau',
    stock: 'Còn 20 bộ',
    value: '250.000đ'
  },
  {
    id: 7,
    name: 'Kính chống ánh sáng xanh',
    points: 350,
    icon: '💻',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
    color: 'from-blue-600 to-indigo-600',
    description: 'Kính chống ánh sáng xanh cho dân văn phòng',
    stock: 'Còn 18 chiếc',
    value: '350.000đ'
  },
  {
    id: 8,
    name: 'Voucher phẫu thuật 500K',
    points: 600,
    icon: '⚕️',
    image: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
    color: 'from-rose-500 to-pink-600',
    description: 'Giảm 500K cho phẫu thuật khúc xạ Lasik/Smile',
    stock: 'Còn 8 voucher',
    value: '500.000đ'
  }
]

const ScorePage = () => {
  const [userPoints, setUserPoints] = useState(() => {
    const saved = localStorage.getItem('vistaUserPoints')
    return saved ? parseInt(saved) : 450 // Demo: 450 điểm
  })
  
  const [redeemHistory, setRedeemHistory] = useState(() => {
    const saved = localStorage.getItem('vistaRedeemHistory')
    return saved ? JSON.parse(saved) : []
  })
  
  const [selectedReward, setSelectedReward] = useState(null)
  const [showRedeemModal, setShowRedeemModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('Tất cả')

  // Tính cấp độ hiện tại
  const currentLevel = memberLevels.reduce((prev, curr) => {
    return userPoints >= curr.minPoints ? curr : prev
  }, memberLevels[0])

  // Tính điểm cần để lên cấp tiếp theo
  const nextLevel = memberLevels.find(level => level.minPoints > userPoints)
  const progressToNextLevel = nextLevel 
    ? ((userPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100

  // Categories for filtering
  const categories = ['Tất cả', 'Voucher', 'Sản phẩm', 'Dịch vụ']

  const filteredRewards = selectedCategory === 'Tất cả' 
    ? rewards 
    : rewards.filter(r => {
        if (selectedCategory === 'Voucher') return r.name.includes('Voucher')
        if (selectedCategory === 'Sản phẩm') return ['Mũ', 'Gọng', 'Kính', 'Combo'].some(k => r.name.includes(k))
        if (selectedCategory === 'Dịch vụ') return r.name.includes('khám') || r.name.includes('phẫu thuật')
        return true
      })

  const handleRedeemClick = (reward) => {
    setSelectedReward(reward)
    setShowRedeemModal(true)
  }

  const handleConfirmRedeem = () => {
    if (userPoints >= selectedReward.points) {
      const newPoints = userPoints - selectedReward.points
      setUserPoints(newPoints)
      localStorage.setItem('vistaUserPoints', newPoints)

      const newHistory = [{
        id: Date.now(),
        reward: selectedReward,
        date: new Date().toISOString(),
        code: 'VISTA' + Math.random().toString(36).substr(2, 9).toUpperCase()
      }, ...redeemHistory]
      setRedeemHistory(newHistory)
      localStorage.setItem('vistaRedeemHistory', JSON.stringify(newHistory))

      setShowRedeemModal(false)
      setShowSuccessModal(true)

      setTimeout(() => {
        setShowSuccessModal(false)
      }, 4000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      {/* Header */}
      <Motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/90 border-b border-amber-200/50 shadow-lg shadow-amber-500/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <img 
                src={LOGO_URL}
                alt="VISTA Logo"
                className="relative w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">VISTA Rewards</span>
              <span className="text-sm text-gray-600 font-medium">Hệ thống tích điểm thưởng</span>
            </div>
          </Link>
          
          <Link 
            to="/"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105"
          >
            ← Về trang chủ
          </Link>
        </div>
      </Motion.header>

      {/* Redeem Confirmation Modal */}
      <AnimatePresence>
        {showRedeemModal && selectedReward && (
          <Motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRedeemModal(false)}
          >
            <Motion.div
              className="relative max-w-md w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`absolute -inset-1 bg-gradient-to-r ${selectedReward.color} rounded-3xl blur-xl opacity-50`} />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${selectedReward.color} flex items-center justify-center text-4xl shadow-xl`}>
                    {selectedReward.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Xác nhận đổi thưởng
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {selectedReward.name}
                  </p>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Giá trị:</span>
                      <span className="font-bold text-amber-600">{selectedReward.value}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-600">Chi phí:</span>
                      <span className="font-bold text-orange-600">{selectedReward.points} điểm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Điểm còn lại:</span>
                      <span className="font-bold text-gray-800">{userPoints - selectedReward.points} điểm</span>
                    </div>
                  </div>

                  {userPoints >= selectedReward.points ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowRedeemModal(false)}
                        className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={handleConfirmRedeem}
                        className={`flex-1 px-6 py-3 rounded-xl bg-gradient-to-r ${selectedReward.color} text-white font-semibold hover:shadow-lg transition-all`}
                      >
                        Đổi ngay
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-red-600 font-semibold mb-4">
                        Bạn cần thêm {selectedReward.points - userPoints} điểm
                      </p>
                      <button
                        onClick={() => setShowRedeemModal(false)}
                        className="w-full px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                      >
                        Đóng
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && selectedReward && (
          <Motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Motion.div
              className="relative max-w-md w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <Motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-5xl shadow-xl"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    🎉
                  </Motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Đổi thưởng thành công!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Bạn đã đổi <span className="font-bold text-amber-600">{selectedReward.name}</span>
                  </p>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 mb-6 border-2 border-amber-200">
                    <div className="text-sm text-gray-600 mb-2">Mã voucher của bạn:</div>
                    <div className="text-2xl font-bold text-amber-600 tracking-wider">
                      {redeemHistory[0]?.code}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Mã đã được gửi đến email của bạn
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold hover:shadow-lg transition-all"
                  >
                    Tuyệt vời!
                  </button>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* User Points & Level Card */}
          <Motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className={`absolute -inset-1 bg-gradient-to-r ${currentLevel.color} rounded-3xl blur-xl opacity-40`} />
              <div className="relative bg-white rounded-3xl border-2 border-amber-200 p-8 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Points Display */}
                  <div className="text-center lg:text-left">
                    <div className="text-gray-600 mb-2">Điểm hiện có</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                      {userPoints}
                    </div>
                    <div className="text-sm text-gray-500">điểm VISTA</div>
                  </div>

                  {/* Level Display */}
                  <div className="text-center">
                    <div className="text-gray-600 mb-2">Cấp độ thành viên</div>
                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r ${currentLevel.color} text-white text-2xl font-bold shadow-xl`}>
                      <span className="text-3xl">{currentLevel.icon}</span>
                      <span>{currentLevel.name}</span>
                    </div>
                    {nextLevel && (
                      <div className="mt-4">
                        <div className="text-xs text-gray-600 mb-2">
                          Còn {nextLevel.minPoints - userPoints} điểm đến cấp {nextLevel.name}
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <Motion.div 
                            className={`h-full bg-gradient-to-r ${nextLevel.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progressToNextLevel}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Benefits */}
                  <div>
                    <div className="text-gray-600 mb-2 text-center lg:text-left">Quyền lợi hiện tại</div>
                    <div className="space-y-2">
                      {currentLevel.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                          <span className="text-green-500">✓</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Earn Points Section */}
              <Motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-white rounded-2xl border-2 border-amber-100 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    Cách kiếm điểm
                  </h3>
                  <div className="space-y-3">
                    {pointActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center text-lg shadow-md`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-gray-800 truncate">{activity.name}</div>
                          <div className="text-xs text-amber-600 font-bold">+{activity.points} điểm</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Motion.div>

              {/* History Section */}
              <Motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="bg-white rounded-2xl border-2 border-amber-100 p-6 shadow-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="text-2xl">📜</span>
                    Lịch sử đổi thưởng
                  </h3>
                  {redeemHistory.length > 0 ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {redeemHistory.slice(0, 5).map((item) => (
                        <div key={item.id} className="p-3 rounded-xl bg-gray-50 border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{item.reward.icon}</span>
                            <div className="text-sm font-semibold text-gray-800">{item.reward.name}</div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(item.date).toLocaleDateString('vi-VN')}
                          </div>
                          <div className="text-xs font-mono text-amber-600 mt-1">
                            {item.code}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🎁</div>
                      <div className="text-sm">Chưa có lịch sử đổi thưởng</div>
                    </div>
                  )}
                </div>
              </Motion.div>
            </div>

            {/* Right: Rewards Grid */}
            <div className="lg:col-span-3 space-y-6">
              {/* Category Filter */}
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <span>🎁</span>
                    Quà tặng có thể đổi
                  </h2>
                  <div className="flex gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                          selectedCategory === cat
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                            : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </Motion.div>

              {/* Rewards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredRewards.map((reward, index) => (
                  <Motion.div
                    key={reward.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleRedeemClick(reward)}
                  >
                    <div className="relative h-full">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${reward.color} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity`} />
                      <div className="relative bg-white rounded-2xl border-2 border-gray-200 group-hover:border-transparent overflow-hidden shadow-lg group-hover:shadow-2xl transition-all h-full flex flex-col">
                        {/* Popular Badge */}
                        {reward.popular && (
                          <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-lg bg-red-500 text-white text-xs font-bold shadow-lg">
                            🔥 Phổ biến
                          </div>
                        )}
                        
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gray-100">
                          <img 
                            src={reward.image}
                            alt={reward.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          <div className={`absolute bottom-4 left-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${reward.color} flex items-center justify-center text-3xl shadow-xl`}>
                            {reward.icon}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex-1 flex flex-col">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                            {reward.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 flex-1">
                            {reward.description}
                          </p>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-500">{reward.stock}</span>
                              <span className="text-sm font-bold text-green-600">{reward.value}</span>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl">💎</span>
                                <span className="text-2xl font-bold text-amber-600">{reward.points}</span>
                              </div>
                              <button className={`px-4 py-2 rounded-lg bg-gradient-to-r ${reward.color} text-white font-semibold shadow-lg hover:shadow-xl transition-all ${
                                userPoints < reward.points ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                              }`}>
                                {userPoints >= reward.points ? 'Đổi ngay' : 'Chưa đủ điểm'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Member Levels Section */}
          <Motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
              <span>🏆</span>
              Các cấp độ thành viên
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {memberLevels.map((level, index) => (
                <Motion.div
                  key={level.level}
                  className={`relative ${currentLevel.level === level.level ? 'scale-105' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${level.color} rounded-2xl blur ${currentLevel.level === level.level ? 'opacity-60' : 'opacity-20'}`} />
                  <div className={`relative bg-white rounded-2xl border-2 p-6 shadow-xl ${
                    currentLevel.level === level.level ? 'border-amber-400' : 'border-gray-200'
                  }`}>
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-2">{level.icon}</div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${level.color} bg-clip-text text-transparent`}>
                        {level.name}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">Từ {level.minPoints.toLocaleString()} điểm</div>
                    </div>
                    <div className="space-y-2">
                      {level.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                    {currentLevel.level === level.level && (
                      <div className="mt-4 text-center">
                        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold">
                          Cấp hiện tại
                        </span>
                      </div>
                    )}
                  </div>
                </Motion.div>
              ))}
            </div>
          </Motion.div>
        </div>
      </div>
    </div>
  )
}

export default ScorePage
