import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Service } from '../types';
import api from '../services/api';

const IMAGES = {
  hero: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1768713160/Screenshot_2026-01-18_121215_faajy1.png',
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.getServices(true) as { data: Service[] };
        setServices(res.data || []);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[300px]">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/70" />
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Dịch vụ của chúng tôi
            </h1>
            <p className="text-gray-300 max-w-xl mx-auto px-4">
              Đầy đủ các dịch vụ khám và điều trị mắt với công nghệ hiện đại
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description || service.short_description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xl font-bold text-blue-600">
                        {new Intl.NumberFormat('vi-VN').format(service.price)}
                      </span>
                      <span className="text-gray-500 text-sm">đ</span>
                    </div>
                    <span className="text-gray-500 text-sm">{service.duration_minutes} phút</span>
                  </div>
                  
                  <Link 
                    to="/booking"
                    className="mt-4 block w-full text-center py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Đặt lịch ngay
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bạn cần tư vấn?
          </h2>
          <p className="text-blue-100 mb-8">
            Liên hệ ngay để được hỗ trợ chọn dịch vụ phù hợp
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking" className="px-8 py-3 bg-white text-blue-600 font-medium rounded-lg">
              Đặt lịch tư vấn
            </Link>
            <a href="tel:+84388833157" className="px-8 py-3 border border-white/50 text-white font-medium rounded-lg">
              038 883 3157
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
