import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Service, Doctor, TimeSlot } from '../types';
import api from '../services/api';

type Step = 'service' | 'doctor' | 'time' | 'info' | 'confirm';

export default function BookingPage() {
  const [step, setStep] = useState<Step>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    service_id: 0,
    doctor_id: 0,
    time_slot_id: 0,
    appointment_date: '',
    appointment_time: '',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    symptoms: '',
  });

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    api.getServices(true).then((res: any) => setServices(res.data || []));
  }, []);

  useEffect(() => {
    if (formData.service_id) {
      api.getDoctors({ active: true }).then((res: any) => setDoctors(res.data || []));
    }
  }, [formData.service_id]);

  useEffect(() => {
    if (formData.doctor_id && formData.appointment_date) {
      setLoading(true);
      api.getDoctorSlots(formData.doctor_id, formData.appointment_date)
        .then((res: any) => setSlots(res.data || []))
        .finally(() => setLoading(false));
    }
  }, [formData.doctor_id, formData.appointment_date]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await api.createAppointment({
        service_id: formData.service_id,
        doctor_id: formData.doctor_id,
        time_slot_id: formData.time_slot_id,
        appointment_date: formData.appointment_date,
        appointment_time: formData.appointment_time,
        symptoms: formData.symptoms,
        guest_name: formData.guest_name,
        guest_email: formData.guest_email,
        guest_phone: formData.guest_phone,
      });
      setSuccess(true);
    } catch (error) {
      alert('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 'service', label: 'Dịch vụ' },
    { id: 'doctor', label: 'Bác sĩ' },
    { id: 'time', label: 'Thời gian' },
    { id: 'info', label: 'Thông tin' },
    { id: 'confirm', label: 'Xác nhận' },
  ];
  const currentStepIndex = steps.findIndex(s => s.id === step);

  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    if (date.getDay() === 0) return null;
    return date.toISOString().split('T')[0];
  }).filter(Boolean) as string[];

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gray-50">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Đặt lịch thành công!</h1>
            <p className="text-gray-600 mb-6">Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Dịch vụ:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Bác sĩ:</span>
                  <span className="font-medium">{selectedDoctor?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Ngày:</span>
                  <span className="font-medium">{formData.appointment_date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Giờ:</span>
                  <span className="font-medium">{selectedSlot?.start_time.slice(0, 5)}</span>
                </div>
              </div>
            </div>
            
            <a href="/" className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg">
              Về trang chủ
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đặt lịch khám</h1>
          <p className="text-gray-600">Chọn dịch vụ và thời gian phù hợp</p>
        </div>

        {/* Progress */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex items-center justify-between max-w-lg mx-auto min-w-[320px] px-2">
            {steps.map((s, i) => (
              <div key={s.id} className="flex flex-col items-center">
                <div className="flex items-center">
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium
                    ${i <= currentStepIndex ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-6 sm:w-12 h-0.5 mx-0.5 sm:mx-1 ${i < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  )}
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 mt-1 hidden sm:block">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          {step === 'service' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn dịch vụ</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => { setFormData({ ...formData, service_id: service.id }); setSelectedService(service); }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors
                      ${formData.service_id === service.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <h3 className="font-medium text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{service.short_description}</p>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="font-semibold text-blue-600">{new Intl.NumberFormat('vi-VN').format(service.price)}đ</span>
                      <span className="text-gray-400">{service.duration_minutes} phút</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={() => setStep('doctor')} disabled={!formData.service_id}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50">
                  Tiếp tục
                </button>
              </div>
            </motion.div>
          )}

          {step === 'doctor' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn bác sĩ</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    onClick={() => { setFormData({ ...formData, doctor_id: doctor.id }); setSelectedDoctor(doctor); }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-colors
                      ${formData.doctor_id === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {doctor.full_name.split(' ').slice(-1)[0].charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.full_name}</h3>
                        <p className="text-sm text-blue-600">{doctor.specialization}</p>
                        <p className="text-xs text-gray-500">{doctor.experience_years} năm KN</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep('service')} className="px-6 py-2.5 text-gray-600 font-medium">Quay lại</button>
                <button onClick={() => setStep('time')} disabled={!formData.doctor_id}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50">
                  Tiếp tục
                </button>
              </div>
            </motion.div>
          )}

          {step === 'time' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Chọn ngày và giờ</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày</label>
                <div className="flex flex-wrap gap-2">
                  {availableDates.map((date) => {
                    const d = new Date(date);
                    return (
                      <button
                        key={date}
                        onClick={() => setFormData({ ...formData, appointment_date: date, time_slot_id: 0 })}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors
                          ${formData.appointment_date === date ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        {d.getDate()}/{d.getMonth() + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {formData.appointment_date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chọn giờ</label>
                  {loading ? (
                    <p className="text-gray-500 py-4">Đang tải...</p>
                  ) : (
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {slots.filter(s => s.is_available).map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => { 
                            setFormData({ ...formData, time_slot_id: slot.id, appointment_time: slot.start_time }); 
                            setSelectedSlot(slot); 
                          }}
                          className={`py-2 rounded-lg text-sm transition-colors
                            ${formData.time_slot_id === slot.id ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                          {slot.start_time.slice(0, 5)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep('doctor')} className="px-6 py-2.5 text-gray-600 font-medium">Quay lại</button>
                <button onClick={() => setStep('info')} disabled={!formData.time_slot_id}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50">
                  Tiếp tục
                </button>
              </div>
            </motion.div>
          )}

          {step === 'info' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin liên hệ</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                  <input type="text" value={formData.guest_name} 
                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Nhập họ và tên" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" value={formData.guest_email}
                    onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                  <input type="tel" value={formData.guest_phone}
                    onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="0912345678" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Triệu chứng (tuỳ chọn)</label>
                  <textarea rows={3} value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Mô tả triệu chứng..." />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <button onClick={() => setStep('time')} className="px-6 py-2.5 text-gray-600 font-medium">Quay lại</button>
                <button onClick={() => setStep('confirm')} 
                  disabled={!formData.guest_name || !formData.guest_email || !formData.guest_phone}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50">
                  Tiếp tục
                </button>
              </div>
            </motion.div>
          )}

          {step === 'confirm' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Xác nhận thông tin</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dịch vụ:</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Chi phí:</span>
                  <span className="font-medium text-blue-600">{new Intl.NumberFormat('vi-VN').format(selectedService?.price || 0)}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Bác sĩ:</span>
                  <span className="font-medium">{selectedDoctor?.full_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ngày khám:</span>
                  <span className="font-medium">{formData.appointment_date}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Giờ khám:</span>
                  <span className="font-medium">{selectedSlot?.start_time.slice(0, 5)}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Họ tên:</span>
                    <span>{formData.guest_name}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">SĐT:</span>
                    <span>{formData.guest_phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button onClick={() => setStep('info')} className="px-6 py-2.5 text-gray-600 font-medium">Quay lại</button>
                <button onClick={handleSubmit} disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg disabled:opacity-50">
                  {submitting ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
