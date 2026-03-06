import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const effectiveDate = '10/02/2026';

const sections = {
  vi: [
    {
      heading: '1. Chấp nhận điều khoản',
      body: 'Khi bạn tải xuống, truy cập hoặc sử dụng Vista Patient Journey ("Ứng dụng"), bạn đồng ý với Điều khoản dịch vụ này. Nếu không đồng ý, vui lòng không sử dụng Ứng dụng.',
    },
    {
      heading: '2. Mục đích (không thay thế tư vấn y khoa)',
      body: 'Ứng dụng cung cấp nội dung giáo dục và trải nghiệm liên quan đến sức khỏe mắt. Ứng dụng không thay thế tư vấn, chẩn đoán hoặc điều trị của bác sĩ. Hãy liên hệ nhân viên y tế có chuyên môn nếu bạn có thắc mắc về tình trạng sức khỏe. Trong trường hợp khẩn cấp y tế, hãy gọi ngay đường dây cấp cứu địa phương.',
    },
    {
      heading: '3. Trách nhiệm của người dùng',
      body: 'Bạn chịu trách nhiệm đối với thông tin mình nhập (hồ sơ, nội dung chat, lịch hẹn...). Vui lòng không nhập các thông tin nhạy cảm nếu bạn không muốn dữ liệu được lưu trên thiết bị.',
    },
    {
      heading: '4. Sử dụng hợp lệ',
      body: 'Bạn đồng ý không: (a) lạm dụng Ứng dụng; (b) cố ý làm gián đoạn hoặc phá hoại Ứng dụng; (c) can thiệp trái phép vào mã nguồn hoặc tạo sản phẩm phái sinh ngoài phạm vi pháp luật cho phép; (d) sử dụng Ứng dụng để truyền tải nội dung vi phạm pháp luật, gây hại hoặc xâm phạm quyền của người khác.',
    },
    {
      heading: '5. Dịch vụ & nội dung bên thứ ba',
      body: 'Một số nội dung có thể được cung cấp bởi bên thứ ba (ví dụ: dịch vụ lưu trữ media, dịch vụ tạo avatar, thư viện dùng trong trải nghiệm bệnh lý). Việc sử dụng các dịch vụ đó có thể chịu điều khoản và chính sách riêng của bên thứ ba.',
    },
    {
      heading: '6. Sở hữu trí tuệ',
      body: 'Ứng dụng, bao gồm thiết kế và mã nguồn, thuộc sở hữu của nhà cung cấp Ứng dụng và được bảo vệ theo luật hiện hành. Bạn được cấp giấy phép hạn chế, không độc quyền, không chuyển nhượng để sử dụng Ứng dụng cho mục đích cá nhân, phi thương mại, trong phạm vi Điều khoản này.',
    },
    {
      heading: '7. Thay đổi & tính sẵn sàng',
      body: 'Chúng tôi có thể cập nhật, chỉnh sửa, tạm ngừng hoặc ngừng cung cấp Ứng dụng (toàn bộ hoặc một phần) bất kỳ lúc nào. Chúng tôi cũng có thể cập nhật Điều khoản này; việc tiếp tục sử dụng Ứng dụng sau khi thay đổi đồng nghĩa với việc bạn chấp nhận Điều khoản mới.',
    },
    {
      heading: '8. Tuyên bố miễn trừ bảo đảm',
      body: 'Ứng dụng được cung cấp "nguyên trạng" và "tùy khả dụng". Trong phạm vi pháp luật cho phép, chúng tôi từ chối mọi bảo đảm, dù rõ ràng hay ngụ ý, bao gồm bảo đảm về tính thương mại, sự phù hợp cho mục đích cụ thể và không xâm phạm.',
    },
    {
      heading: '9. Giới hạn trách nhiệm',
      body: 'Trong phạm vi pháp luật tối đa cho phép, chúng tôi không chịu trách nhiệm đối với bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt, hậu quả hoặc trừng phạt nào, hoặc mất dữ liệu hay lợi nhuận, phát sinh từ việc bạn sử dụng Ứng dụng.',
    },
    {
      heading: '10. Luật điều chỉnh',
      body: 'Điều khoản này được điều chỉnh bởi luật pháp của Việt Nam, không áp dụng các nguyên tắc xung đột pháp luật.',
    },
    {
      heading: '11. Liên hệ',
      body: 'Nếu bạn có câu hỏi về Điều khoản này, vui lòng liên hệ:\nEmail: vistapatientjourney@gmail.com\nSĐT: +84 38 883 3157\nĐịa chỉ: 600 Nguyễn Văn Cừ nối dài, An Bình, Bình Thuỷ, Cần Thơ 900000',
    },
  ],
  en: [
    {
      heading: '1. Acceptance of Terms',
      body: 'By downloading, accessing, or using Vista Patient Journey (the "App"), you agree to these Terms of Service ("Terms"). If you do not agree, do not use the App.',
    },
    {
      heading: '2. Purpose of the App (No Medical Advice)',
      body: 'The App provides educational content and interactive experiences related to eye health. The App does not provide medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare professional with questions about a medical condition. If you believe you may have a medical emergency, contact your local emergency number immediately.',
    },
    {
      heading: '3. App features & user content',
      body: 'The App may allow you to enter profile information, book appointments, take quizzes, and chat with the in-app chatbot. You are responsible for the information you provide. Please do not submit sensitive personal data that you do not want stored on your device.',
    },
    {
      heading: '4. Acceptable use',
      body: 'You agree not to: (a) misuse the App; (b) attempt to interfere with or disrupt the App; (c) reverse engineer, modify, or create derivative works of the App except to the extent permitted by law; (d) use the App to transmit unlawful, harmful, or infringing content.',
    },
    {
      heading: '5. Third-party services and content',
      body: 'Some content may be hosted or delivered by third-party providers (for example, video/audio hosting, avatar image services, or libraries loaded for the Eye Condition Experience). Your use of third-party services may be subject to their own terms and privacy policies.',
    },
    {
      heading: '6. Intellectual property',
      body: 'The App, including its design and code, is owned by the App provider and protected by applicable laws. You are granted a limited, non-exclusive, non-transferable license to use the App for personal, non-commercial purposes, subject to these Terms.',
    },
    {
      heading: '7. Availability and changes',
      body: 'We may update, modify, suspend, or discontinue the App (in whole or in part) at any time. We may also update these Terms; continued use of the App after changes means you accept the updated Terms.',
    },
    {
      heading: '8. Disclaimer of warranties',
      body: 'The App is provided "as is" and "as available." To the maximum extent permitted by law, we disclaim all warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement.',
    },
    {
      heading: '9. Limitation of liability',
      body: 'To the maximum extent permitted by law, we are not liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data or profits, arising out of or related to your use of the App.',
    },
    {
      heading: '10. Governing law',
      body: 'These Terms are governed by the laws of Vietnam, without regard to conflict of law principles.',
    },
    {
      heading: '11. Contact',
      body: 'Questions about these Terms:\nEmail: vistapatientjourney@gmail.com\nPhone: +84 38 883 3157\nAddress: 600 Nguyễn Văn Cừ nối dài, An Bình, Bình Thuỷ, Cần Thơ 900000, Vietnam',
    },
  ],
};

export default function TermsOfServicePage() {
  const { language } = useLanguage();
  const isVi = language !== 'en';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const content = isVi ? sections.vi : sections.en;
  const title = isVi ? 'Điều khoản dịch vụ' : 'Terms of Service';
  const subtitle = isVi ? `Ngày hiệu lực: ${effectiveDate}` : `Effective date: ${effectiveDate}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-6 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {isVi ? 'Quay lại trang chủ' : 'Back to home'}
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-blue-100 text-sm mt-1">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {content.map((section, idx) => (
              <div key={idx} className="px-6 sm:px-8 py-6">
                <h2 className="text-base font-semibold text-gray-900 mb-2">{section.heading}</h2>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-xs text-gray-400 space-y-1">
          <p>© {new Date().getFullYear()} VISTA Eye Care.</p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/privacy-policy" className="hover:text-blue-600 transition-colors underline underline-offset-2">
              {isVi ? 'Chính sách bảo mật' : 'Privacy Policy'}
            </Link>
            <span>·</span>
            <Link to="/terms-of-service" className="hover:text-blue-600 transition-colors underline underline-offset-2">
              {isVi ? 'Điều khoản dịch vụ' : 'Terms of Service'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
