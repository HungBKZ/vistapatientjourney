import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const effectiveDate = '10/02/2026';

const sections = {
  vi: [
    {
      heading: '1. Tổng quan',
      body: 'Vista Patient Journey ("Ứng dụng") cung cấp nội dung về nhãn khoa (bài viết, video, podcast, quiz), tính năng đặt lịch và chatbot hỏi đáp. Chính sách này giải thích thông tin nào được xử lý khi bạn sử dụng Ứng dụng và cách sử dụng thông tin đó.',
    },
    {
      heading: '2. Thông tin bạn cung cấp',
      body: 'Tùy cách bạn sử dụng, bạn có thể nhập: họ tên, email, số điện thoại, ngày sinh, địa chỉ, và ghi chú tiền sử/bệnh sử. Nếu bạn dùng chatbot, nội dung tin nhắn bạn nhập có thể được lưu trên thiết bị như lịch sử chat.',
    },
    {
      heading: '3. Quyền truy cập thiết bị',
      body: 'Ứng dụng có thể yêu cầu quyền truy cập để hoạt động đúng: thông báo (nhắc lịch hẹn), camera/thư viện ảnh (chụp/chọn avatar), và camera trong tính năng Trải nghiệm bệnh lý về mắt. Bạn có thể từ chối quyền, nhưng một số chức năng có thể bị hạn chế.',
    },
    {
      heading: '4. Lưu trữ trên thiết bị',
      body: 'Dữ liệu được lưu chủ yếu trên thiết bị (ví dụ: hồ sơ, tiến độ quiz, lịch hẹn, dữ liệu FAQ/chat) thông qua cơ sở dữ liệu cục bộ. Khi gỡ ứng dụng, dữ liệu cục bộ thường sẽ bị xóa. Hệ điều hành có thể sao lưu dữ liệu tùy theo cài đặt sao lưu của bạn.',
    },
    {
      heading: '5. Nội dung & dịch vụ bên thứ ba',
      body: 'Một số nội dung được tải từ dịch vụ bên thứ ba (ví dụ: media từ Cloudinary, avatar từ ui-avatars.com, và MediaPipe từ CDN như jsDelivr trong tính năng trải nghiệm). Khi thiết bị kết nối các dịch vụ này, họ có thể nhận thông tin mạng cơ bản như địa chỉ IP. Ứng dụng cũng có thể mở liên kết ngoài (ví dụ Facebook) khi bạn chọn.',
    },
    {
      heading: '6. Cách chúng tôi sử dụng thông tin',
      body: 'Chúng tôi sử dụng thông tin để vận hành chức năng của Ứng dụng (hiển thị nội dung, lưu tiến độ/lịch sử cục bộ, hỗ trợ nhắc lịch hẹn), cải thiện độ ổn định và phản hồi yêu cầu của bạn trong Ứng dụng.',
    },
    {
      heading: '7. Chia sẻ thông tin',
      body: 'Chúng tôi không bán thông tin cá nhân. Thông tin chỉ được chia sẻ với nhà cung cấp nội dung bên thứ ba trong phạm vi cần thiết để tải nội dung bạn yêu cầu, hoặc theo yêu cầu pháp luật.',
    },
    {
      heading: '8. Bảo mật',
      body: 'Chúng tôi thực hiện các biện pháp hợp lý để bảo vệ thông tin lưu trên thiết bị của bạn. Không có phương thức lưu trữ hay truyền dữ liệu nào an toàn 100%; vui lòng sử dụng Ứng dụng có trách nhiệm và bảo vệ thiết bị bằng mã PIN/sinh trắc học khi có thể.',
    },
    {
      heading: '9. Quyền riêng tư của trẻ em',
      body: 'Ứng dụng không dành cho trẻ em dưới 13 tuổi. Nếu bạn cho rằng một trẻ em đã cung cấp thông tin cá nhân qua Ứng dụng, vui lòng liên hệ chúng tôi để được hỗ trợ.',
    },
    {
      heading: '10. Lựa chọn của bạn',
      body: 'Bạn có thể xem và cập nhật thông tin hồ sơ trong Ứng dụng, cũng như kiểm soát quyền (thông báo/camera/ảnh) từ cài đặt thiết bị. Việc gỡ cài đặt Ứng dụng thường xóa dữ liệu lưu cục bộ khỏi thiết bị.',
    },
    {
      heading: '11. Thay đổi chính sách',
      body: 'Chúng tôi có thể cập nhật Chính sách bảo mật này theo thời gian. Khi có thay đổi, chúng tôi sẽ cập nhật ngày hiệu lực và cung cấp chính sách mới trong Ứng dụng.',
    },
    {
      heading: '12. Liên hệ',
      body: 'Nếu bạn có câu hỏi về Chính sách này, vui lòng liên hệ:\nEmail: vistapatientjourney@gmail.com\nSĐT: +84 38 883 3157\nĐịa chỉ: 600 Nguyễn Văn Cừ nối dài, An Bình, Bình Thuỷ, Cần Thơ 900000',
    },
  ],
  en: [
    {
      heading: '1. Overview',
      body: 'Vista Patient Journey (the "App") is an educational and patient-journey experience app focused on eye health content (articles, videos, podcasts, quizzes), appointment booking features, and an in-app Q&A chatbot. This Privacy Policy explains what information is processed when you use the App and how it is used.',
    },
    {
      heading: '2. Information you provide',
      body: 'Depending on how you use the App, you may provide information such as your name, email, phone number, date of birth, address, and medical history notes you choose to enter in your profile. If you use the chatbot, the messages you type are processed to generate responses and may be stored on your device as chat history.',
    },
    {
      heading: '3. Device permissions',
      body: 'The App may request certain device permissions to enable features: (a) Notifications — to show appointment reminders; (b) Camera / Photo library — if you choose to take or select an avatar photo; (c) Camera access in the Eye Condition Experience — to simulate vision effects. You can deny permissions, but some features may not work correctly.',
    },
    {
      heading: '4. On-device storage',
      body: 'The App stores data locally on your device (for example, profile details, quiz progress, appointment entries, FAQ/chat data) using a local database. If you uninstall the App, local data is typically removed. Your device operating system may include the App\'s data in device backups depending on your backup settings.',
    },
    {
      heading: '5. Third-party content & network requests',
      body: 'Some App content is loaded from third-party services (for example, media files hosted on Cloudinary, avatar images generated by ui-avatars.com, and MediaPipe scripts from a CDN such as jsDelivr). When your device connects to these services, they may receive standard network information such as your IP address and user-agent. The App may also open external links when you choose to do so.',
    },
    {
      heading: '6. How we use information',
      body: 'We use the information processed by the App to provide and operate features (show content, personalize basic profile display, store local progress/history, and support appointment reminders), to improve reliability, and to respond to your in-app requests.',
    },
    {
      heading: '7. Sharing of information',
      body: 'We do not sell your personal information. The App may share information with third-party providers only to the extent necessary to deliver third-party content you request or as required by law.',
    },
    {
      heading: '8. Security',
      body: 'We take reasonable measures within the App to protect information stored on your device. No method of storage or transmission is 100% secure; please use the App responsibly and keep your device protected (PIN/biometrics) where possible.',
    },
    {
      heading: '9. Children\'s privacy',
      body: 'The App is not intended for children under 13. If you believe a child has provided personal information through the App, please contact us so we can assist.',
    },
    {
      heading: '10. Your choices',
      body: 'You can review and update your profile information within the App. You can also control permissions (notifications/camera/photos) from your device settings. Uninstalling the App typically removes locally stored data from the device.',
    },
    {
      heading: '11. Changes to this policy',
      body: 'We may update this Privacy Policy from time to time. If we make changes, we will update the effective date above and provide the updated policy in the App.',
    },
    {
      heading: '12. Contact',
      body: 'If you have questions about this Privacy Policy, contact us at:\nEmail: vistapatientjourney@gmail.com\nPhone: +84 38 883 3157\nAddress: 600 Nguyễn Văn Cừ nối dài, An Bình, Bình Thuỷ, Cần Thơ 900000, Vietnam',
    },
  ],
};

export default function PrivacyPolicyPage() {
  const { language } = useLanguage();
  const isVi = language !== 'en';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const content = isVi ? sections.vi : sections.en;
  const title = isVi ? 'Chính sách bảo mật' : 'Privacy Policy';
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
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
