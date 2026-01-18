// Booking Page - Đặt lịch khám tại Bệnh viện Mắt Sài Gòn Cần Thơ
import { useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const LOGO_URL = 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761407529/567696130_122104196085062997_7245508250228661975_n_nu6jbt.jpg'

// Dữ liệu bệnh viện
const hospitalInfo = {
  name: 'Bệnh viện Mắt Sài Gòn Cần Thơ',
  address: '123 Đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ',
  phone: '0292 3812 345',
  email: 'booking@matsaigon-cantho.vn',
  workingHours: 'Thứ 2 - Thứ 7: 7:30 - 17:00 | Chủ nhật: 8:00 - 12:00'
}

// Các chuyên khoa
const departments = [
  { id: 1, name: 'Khúc xạ - Cận thị', icon: '👓', color: 'from-blue-500 to-cyan-500' },
  { id: 2, name: 'Phẫu thuật khúc xạ', icon: '⚕️', color: 'from-purple-500 to-pink-500' },
  { id: 3, name: 'Đục thủy tinh thể', icon: '👁️', color: 'from-green-500 to-emerald-500' },
  { id: 4, name: 'Võng mạc - Điểm vàng', icon: '🔬', color: 'from-orange-500 to-red-500' },
  { id: 5, name: 'Tăng nhãn áp - Glaucoma', icon: '💊', color: 'from-indigo-500 to-purple-500' },
  { id: 6, name: 'Khám tổng quát', icon: '🏥', color: 'from-teal-500 to-cyan-500' }
]

// Bác sĩ theo chuyên khoa
const doctors = {
  1: [
    { id: 'bs1', name: 'BS. Nguyễn Văn An', title: 'Bác sĩ CKI', experience: '15 năm' },
    { id: 'bs2', name: 'BS. Trần Thị Bình', title: 'Bác sĩ CKII', experience: '12 năm' }
  ],
  2: [
    { id: 'bs3', name: 'PGS.TS. Lê Văn Cường', title: 'Phó Giáo sư', experience: '20 năm' },
    { id: 'bs4', name: 'TS.BS. Phạm Thị Dung', title: 'Tiến sĩ', experience: '18 năm' }
  ],
  3: [
    { id: 'bs5', name: 'BS. Hoàng Văn Em', title: 'Bác sĩ CKI', experience: '14 năm' },
    { id: 'bs6', name: 'BS. Võ Thị Phương', title: 'Bác sĩ CKII', experience: '16 năm' }
  ],
  4: [
    { id: 'bs7', name: 'PGS.TS. Đỗ Văn Giang', title: 'Phó Giáo sư', experience: '22 năm' },
    { id: 'bs8', name: 'BS. Ngô Thị Hoa', title: 'Bác sĩ CKI', experience: '13 năm' }
  ],
  5: [
    { id: 'bs9', name: 'TS.BS. Phan Văn Inh', title: 'Tiến sĩ', experience: '19 năm' },
    { id: 'bs10', name: 'BS. Lý Thị Kim', title: 'Bác sĩ CKII', experience: '11 năm' }
  ],
  6: [
    { id: 'bs11', name: 'BS. Trương Văn Long', title: 'Bác sĩ', experience: '10 năm' },
    { id: 'bs12', name: 'BS. Mai Thị Nhung', title: 'Bác sĩ', experience: '9 năm' }
  ]
}

// Khung giờ khám
const timeSlots = [
  { id: 't1', time: '07:30 - 08:00', available: true },
  { id: 't2', time: '08:00 - 08:30', available: true },
  { id: 't3', time: '08:30 - 09:00', available: false },
  { id: 't4', time: '09:00 - 09:30', available: true },
  { id: 't5', time: '09:30 - 10:00', available: true },
  { id: 't6', time: '10:00 - 10:30', available: true },
  { id: 't7', time: '10:30 - 11:00', available: false },
  { id: 't8', time: '11:00 - 11:30', available: true },
  { id: 't9', time: '13:30 - 14:00', available: true },
  { id: 't10', time: '14:00 - 14:30', available: true },
  { id: 't11', time: '14:30 - 15:00', available: true },
  { id: 't12', time: '15:00 - 15:30', available: false },
  { id: 't13', time: '15:30 - 16:00', available: true },
  { id: 't14', time: '16:00 - 16:30', available: true }
]

const BookingPage = () => {
  const [step, setStep] = useState(1) // 1: Chọn khoa, 2: Chọn bác sĩ & thời gian, 3: Thông tin cá nhân, 4: Xác nhận
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    birthYear: '',
    gender: 'male',
    address: '',
    symptoms: '',
    insurance: false
  })

  // Lấy ngày hôm nay để làm min date
  const today = new Date().toISOString().split('T')[0]

  // Lấy ngày 30 ngày sau để làm max date
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  const handleDepartmentSelect = (dept) => {
    setSelectedDepartment(dept)
    setSelectedDoctor(null)
    setSelectedTime(null)
    setStep(2)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setShowSuccess(true)
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Reset form sau 5 giây
    setTimeout(() => {
      setShowSuccess(false)
      setStep(1)
      setSelectedDepartment(null)
      setSelectedDoctor(null)
      setSelectedDate('')
      setSelectedTime(null)
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        birthYear: '',
        gender: 'male',
        address: '',
        symptoms: '',
        insurance: false
      })
    }, 5000)
  }

  const canProceedToStep3 = selectedDoctor && selectedDate && selectedTime
  const canSubmit = formData.fullName && formData.phone && formData.birthYear

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      {/* Header */}
      <Motion.header 
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-white/90 border-b border-cyan-200/50 shadow-lg shadow-cyan-500/5"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <img 
                src={LOGO_URL}
                alt="VISTA Logo"
                className="relative w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-xl"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Đặt lịch khám</span>
              <span className="text-sm text-gray-600 font-medium">{hospitalInfo.name}</span>
            </div>
          </Link>
          
          <Link 
            to="/"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105"
          >
            ← Về trang chủ
          </Link>
        </div>
      </Motion.header>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <Motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Motion.div
              className="relative max-w-lg w-full"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-50" />
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center">
                  <Motion.div
                    className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-5xl shadow-xl"
                    animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    ✓
                  </Motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-3">
                    Đặt lịch thành công!
                  </h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Chúng tôi đã gửi thông tin xác nhận đến số điện thoại <span className="font-bold text-cyan-600">{formData.phone}</span>
                    <br />
                    Vui lòng đến đúng giờ để được phục vụ tốt nhất.
                  </p>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 mb-6 border-2 border-cyan-200">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="text-left">
                        <div className="text-gray-500 mb-1">Chuyên khoa</div>
                        <div className="font-bold text-gray-800">{selectedDepartment?.name}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-gray-500 mb-1">Bác sĩ</div>
                        <div className="font-bold text-gray-800">{selectedDoctor?.name}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-gray-500 mb-1">Ngày khám</div>
                        <div className="font-bold text-gray-800">{new Date(selectedDate).toLocaleDateString('vi-VN')}</div>
                      </div>
                      <div className="text-left">
                        <div className="text-gray-500 mb-1">Giờ khám</div>
                        <div className="font-bold text-gray-800">{selectedTime?.time}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={`tel:${hospitalInfo.phone}`}
                      className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold hover:shadow-lg transition-all"
                    >
                      📞 Gọi bệnh viện
                    </a>
                    <button
                      onClick={() => setShowSuccess(false)}
                      className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-28 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Progress Steps */}
          <Motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3, 4].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                    step >= s 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {s}
                  </div>
                  {s < 4 && (
                    <div className={`w-16 h-1 mx-2 rounded-full transition-all ${
                      step > s ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-3 text-sm text-gray-600">
              <span className={step >= 1 ? 'font-bold text-cyan-600' : ''}>Chọn khoa</span>
              <span className={step >= 2 ? 'font-bold text-cyan-600' : ''}>Chọn bác sĩ</span>
              <span className={step >= 3 ? 'font-bold text-cyan-600' : ''}>Thông tin</span>
              <span className={step >= 4 ? 'font-bold text-cyan-600' : ''}>Xác nhận</span>
            </div>
          </Motion.div>

          {/* Step 1: Chọn chuyên khoa */}
          {step === 1 && (
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">
                  Chọn chuyên khoa khám
                </h1>
                <p className="text-gray-600 text-lg">
                  Vui lòng chọn chuyên khoa phù hợp với tình trạng của bạn
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, index) => (
                  <Motion.div
                    key={dept.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleDepartmentSelect(dept)}
                  >
                    <div className="relative">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${dept.color} rounded-2xl blur opacity-0 group-hover:opacity-40 transition-opacity`} />
                      <div className="relative bg-white rounded-2xl border-2 border-gray-200 group-hover:border-transparent p-6 shadow-lg group-hover:shadow-2xl transition-all">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center text-3xl shadow-lg`}>
                          {dept.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
                          {dept.name}
                        </h3>
                        <div className="text-center">
                          <span className={`inline-block px-4 py-2 rounded-lg bg-gradient-to-r ${dept.color} text-white text-sm font-semibold`}>
                            Chọn khoa này →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </div>
            </Motion.div>
          )}

          {/* Step 2: Chọn bác sĩ & thời gian */}
          {step === 2 && selectedDepartment && (
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">
                  Chọn bác sĩ & thời gian
                </h1>
                <p className="text-gray-600 text-lg">
                  Chuyên khoa: <span className="font-bold text-cyan-600">{selectedDepartment.name}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Chọn bác sĩ */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>👨‍⚕️</span>
                    Chọn bác sĩ khám
                  </h3>
                  <div className="space-y-3">
                    {doctors[selectedDepartment.id].map((doctor) => (
                      <Motion.div
                        key={doctor.id}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                          selectedDoctor?.id === doctor.id
                            ? 'border-cyan-500 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-lg'
                            : 'border-gray-200 bg-white hover:border-cyan-300 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedDoctor(doctor)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${selectedDepartment.color} flex items-center justify-center text-white text-xl font-bold shadow-lg`}>
                            {doctor.name.charAt(3)}
                          </div>
                          <div className="flex-1">
                            <div className="font-bold text-gray-800">{doctor.name}</div>
                            <div className="text-sm text-gray-600">{doctor.title} • {doctor.experience} kinh nghiệm</div>
                          </div>
                          {selectedDoctor?.id === doctor.id && (
                            <div className="text-2xl">✓</div>
                          )}
                        </div>
                      </Motion.div>
                    ))}
                  </div>

                  {/* Chọn ngày */}
                  <div className="mt-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <span>📅</span>
                      Chọn ngày khám
                    </h3>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={today}
                      max={maxDateStr}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-cyan-500 focus:outline-none text-lg font-semibold"
                    />
                  </div>
                </div>

                {/* Chọn giờ */}
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <span>⏰</span>
                    Chọn giờ khám
                  </h3>
                  <div className="grid grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-2">
                    {timeSlots.map((slot) => (
                      <Motion.button
                        key={slot.id}
                        disabled={!slot.available}
                        onClick={() => setSelectedTime(slot)}
                        className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                          !slot.available
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : selectedTime?.id === slot.id
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                            : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-cyan-500 hover:shadow-md'
                        }`}
                        whileHover={slot.available ? { scale: 1.05 } : {}}
                        whileTap={slot.available ? { scale: 0.95 } : {}}
                      >
                        {slot.time}
                        {!slot.available && <div className="text-xs mt-1">Đã đầy</div>}
                      </Motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  ← Quay lại
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!canProceedToStep3}
                  className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all ${
                    canProceedToStep3
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Tiếp tục →
                </button>
              </div>
            </Motion.div>
          )}

          {/* Step 3: Thông tin cá nhân */}
          {step === 3 && (
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">
                  Thông tin bệnh nhân
                </h1>
                <p className="text-gray-600 text-lg">
                  Vui lòng điền đầy đủ thông tin để hoàn tất đặt lịch
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-3xl blur opacity-20" />
                  <div className="relative bg-white rounded-3xl border-2 border-cyan-100 p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Họ và tên */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-cyan-500 focus:outline-none"
                          placeholder="Nguyễn Văn A"
                        />
                      </div>

                      {/* Số điện thoại & Email */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Số điện thoại <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-cyan-500 focus:outline-none"
                            placeholder="0901234567"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Email (tùy chọn)
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-cyan-500 focus:outline-none"
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>

                      {/* Năm sinh & Giới tính */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Năm sinh <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            required
                            value={formData.birthYear}
                            onChange={(e) => setFormData({...formData, birthYear: e.target.value})}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-cyan-500 focus:outline-none"
                            placeholder="1990"
                            min="1900"
                            max="2025"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Giới tính
                          </label>
                          <div className="flex gap-4">
                            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all hover:border-cyan-500" style={{
                              borderColor: formData.gender === 'male' ? '#06b6d4' : '#d1d5db',
                              backgroundColor: formData.gender === 'male' ? '#ecfeff' : 'white'
                            }}>
                              <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                className="w-4 h-4"
                              />
                              <span className="font-semibold">Nam</span>
                            </label>
                            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all hover:border-cyan-500" style={{
                              borderColor: formData.gender === 'female' ? '#06b6d4' : '#d1d5db',
                              backgroundColor: formData.gender === 'female' ? '#ecfeff' : 'white'
                            }}>
                              <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                                className="w-4 h-4"
                              />
                              <span className="font-semibold">Nữ</span>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Địa chỉ */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Địa chỉ (tùy chọn)
                        </label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-cyan-500 focus:outline-none"
                          placeholder="123 Đường ABC, Quận XYZ, TP. Cần Thơ"
                        />
                      </div>

                      {/* Triệu chứng */}
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Triệu chứng / Lý do khám (tùy chọn)
                        </label>
                        <textarea
                          value={formData.symptoms}
                          onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-cyan-500 focus:outline-none resize-none"
                          rows="4"
                          placeholder="Mô tả triệu chứng hoặc lý do bạn muốn khám..."
                        />
                      </div>

                      {/* Bảo hiểm y tế */}
                      <div>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.insurance}
                            onChange={(e) => setFormData({...formData, insurance: e.target.checked})}
                            className="w-5 h-5 rounded border-gray-300"
                          />
                          <span className="text-gray-700 font-semibold">
                            Tôi có thẻ bảo hiểm y tế
                          </span>
                        </label>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-4 pt-4">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                          ← Quay lại
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(4)}
                          disabled={!canSubmit}
                          className={`flex-1 px-8 py-4 rounded-xl font-semibold transition-all ${
                            canSubmit
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/30'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Xem lại thông tin →
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}

          {/* Step 4: Xác nhận */}
          {step === 4 && (
            <Motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-3">
                  Xác nhận thông tin
                </h1>
                <p className="text-gray-600 text-lg">
                  Vui lòng kiểm tra lại thông tin trước khi xác nhận
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-3xl blur opacity-20" />
                  <div className="relative bg-white rounded-3xl border-2 border-cyan-100 p-8 shadow-2xl space-y-6">
                    {/* Thông tin lịch khám */}
                    <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>📋</span>
                        Thông tin lịch khám
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Chuyên khoa</div>
                          <div className="font-bold text-gray-800">{selectedDepartment?.name}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Bác sĩ khám</div>
                          <div className="font-bold text-gray-800">{selectedDoctor?.name}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Ngày khám</div>
                          <div className="font-bold text-gray-800">{new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Giờ khám</div>
                          <div className="font-bold text-gray-800">{selectedTime?.time}</div>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin bệnh nhân */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>👤</span>
                        Thông tin bệnh nhân
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Họ và tên</div>
                          <div className="font-bold text-gray-800">{formData.fullName}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Số điện thoại</div>
                          <div className="font-bold text-gray-800">{formData.phone}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Năm sinh</div>
                          <div className="font-bold text-gray-800">{formData.birthYear}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 text-sm mb-1">Giới tính</div>
                          <div className="font-bold text-gray-800">{formData.gender === 'male' ? 'Nam' : 'Nữ'}</div>
                        </div>
                        {formData.email && (
                          <div className="col-span-2">
                            <div className="text-gray-600 text-sm mb-1">Email</div>
                            <div className="font-bold text-gray-800">{formData.email}</div>
                          </div>
                        )}
                        {formData.address && (
                          <div className="col-span-2">
                            <div className="text-gray-600 text-sm mb-1">Địa chỉ</div>
                            <div className="font-bold text-gray-800">{formData.address}</div>
                          </div>
                        )}
                        {formData.symptoms && (
                          <div className="col-span-2">
                            <div className="text-gray-600 text-sm mb-1">Triệu chứng</div>
                            <div className="font-bold text-gray-800">{formData.symptoms}</div>
                          </div>
                        )}
                        <div className="col-span-2">
                          <div className="text-gray-600 text-sm mb-1">Bảo hiểm y tế</div>
                          <div className="font-bold text-gray-800">{formData.insurance ? 'Có thẻ BHYT' : 'Không có BHYT'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Thông tin bệnh viện */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
                      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span>🏥</span>
                        Địa điểm khám
                      </h3>
                      <div className="space-y-2 text-gray-700">
                        <div><span className="font-semibold">{hospitalInfo.name}</span></div>
                        <div>📍 {hospitalInfo.address}</div>
                        <div>📞 {hospitalInfo.phone}</div>
                        <div>⏰ {hospitalInfo.workingHours}</div>
                      </div>
                    </div>

                    {/* Lưu ý */}
                    <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200">
                      <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center gap-2">
                        <span>⚠️</span>
                        Lưu ý quan trọng
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>✓ Vui lòng đến trước giờ hẹn 15 phút để làm thủ tục</li>
                        <li>✓ Mang theo CMND/CCCD và thẻ BHYT (nếu có)</li>
                        <li>✓ Nếu cần hủy lịch, vui lòng liên hệ trước 24 giờ</li>
                        <li>✓ Hotline hỗ trợ: {hospitalInfo.phone}</li>
                      </ul>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4 pt-4">
                      <button
                        onClick={() => setStep(3)}
                        className="px-8 py-4 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                      >
                        ← Sửa thông tin
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex-1 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all transform hover:scale-105"
                      >
                        ✓ Xác nhận đặt lịch
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default BookingPage
