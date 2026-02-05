import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Article } from '../types';
import api from '../services/api';

const eyeCareTips = [
  {
    title: 'Quy tắc 20-20-20',
    description: 'Mỗi 20 phút nhìn màn hình, hãy nhìn xa 20 feet (6m) trong 20 giây.',
    icon: '👁️',
  },
  {
    title: 'Bảo vệ khỏi UV',
    description: 'Đeo kính râm khi ra ngoài trời để bảo vệ mắt khỏi tia UV.',
    icon: '🕶️',
  },
  {
    title: 'Dinh dưỡng cho mắt',
    description: 'Bổ sung vitamin A, omega-3 từ cá, rau xanh và trái cây.',
    icon: '🥕',
  },
  {
    title: 'Khám mắt định kỳ',
    description: 'Khám mắt 6 tháng - 1 năm/lần để phát hiện sớm các vấn đề.',
    icon: '📋',
  },
];

const features = [
  {
    title: 'Trải nghiệm kính mắt',
    description: 'Lựa chọn mắt kính phù hợp với gương mặt của bạn',
    icon: '🎧',
    href: '/podcast',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'Trải nghiệm thị giác',
    description: 'Nhìn thế giới qua đôi mắt khác',
    icon: '📸',
    href: 'https://vista-camera-eyes.vercel.app/',
    external: true,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Kiểm tra thị lực',
    description: 'Kiểm tra thị lực của đôi mắt bạn',
    icon: '✅',
    href: '/quiz',
    color: 'bg-green-50 text-green-600',
  },
];

export default function KnowledgePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getArticles({ limit: 10 })
      .then((res: any) => setArticles(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kiến thức nhãn khoa
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Tìm hiểu về các bệnh lý về mắt và cách chăm sóc đôi mắt khỏe mạnh
          </p>
        </div>
      </section>

      {/* Features - Podcast, 3D Model, Quiz */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Component = feature.external ? 'a' : Link;
              const props = feature.external 
                ? { href: feature.href, target: '_blank', rel: 'noopener noreferrer' }
                : { to: feature.href };
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Component
                    {...props as any}
                    className="block bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                  >
                    <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      {feature.title}
                      {feature.external && (
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </h3>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </Component>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Eye Care Tips */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Mẹo bảo vệ mắt hàng ngày
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {eyeCareTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Visual Experience Banner */}

      {/* Articles */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Bài viết mới nhất</h2>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-500">Chưa có bài viết nào</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <motion.article
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  <div className="p-5">
                    {article.category && (
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded mb-2">
                        {article.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section> */}

      {/* CTA */}
      {/* <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bạn có thắc mắc về sức khỏe mắt?
          </h2>
          <p className="text-gray-600 mb-8">
            Đặt lịch khám để được bác sĩ chuyên khoa tư vấn trực tiếp
          </p>
          <Link to="/booking" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
            Đặt lịch khám
          </Link>
        </div>
      </section> */}
    </div>
  );
}
