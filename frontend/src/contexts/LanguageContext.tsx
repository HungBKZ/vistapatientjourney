import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'vi' | 'en' | 'km';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('vista-language');
    return (saved === 'en' || saved === 'vi' || saved === 'km') ? saved : 'vi';
  });

  useEffect(() => {
    localStorage.setItem('vista-language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  const tArray = (key: string): string[] => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return [];
      }
    }
    
    return Array.isArray(value) ? value : [];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
};

const translations = {
  vi: {
    nav: {
      home: 'Trang chủ',
      services: 'Dịch vụ',
      knowledge: 'Mắt ảo',
      explore: 'Kiến thức',
      journey: 'Hành trình',
      quiz: 'Quiz',
    },
    home: {
      hero: {
        badge: 'Công nghệ AI tiên tiến',
        title: 'Trải nghiệm thị giác',
        subtitle: 'Với VISTA',
        title2: 'Khi đôi mắt',
        subtitle2: 'được thấu hiểu',
        description: 'Giải pháp trải nghiệm thị giác tích hợp AI giúp bạn hiểu rõ hơn về sức khỏe đôi mắt của mình',
        cta: 'Trải nghiệm ngay',
        learnMore: 'Tìm hiểu thêm',
      },
      whyChoose: {
        badge: 'Về chúng tôi',
        title: 'Nhóm sinh viên Đại học FPT Cần Thơ',
        title2: 'Giải pháp trải nghiệm thị giác toàn diện',
        description: 'VISTA - Patient Journey là dự án do nhóm sinh viên phát triển với mục tiêu nâng cao nhận thức cộng đồng về sức khỏe mắt và các vấn đề nhãn khoa thường gặp. Thông qua việc hỗ trợ bệnh viện và đơn vị đối tác truyền tải thông tin một cách rõ ràng, dễ tiếp cận, dự án hướng đến việc giúp người dùng hiểu đúng, chăm sóc đúng và bảo vệ đôi mắt khỏe mạnh mỗi ngày, đặc biệt là trong thời đại số ngày nay.',
        list1: 'Kiến thức về mắt',
        list2: 'Chăm sóc sức khỏe mắt',
        list3: 'Các vấn đề thường gặp về mắt',
        list4: 'Kiến thức xác thực từ tổ chức chuyên môn',
      },
      team: {
        badge: 'Đội ngũ Vista',
        title: 'Những thành viên của dự án',
      },
      features: {
        badge: 'TẠI SAO CHỌN VISTA?',
        title: 'Vì sao chọn giải pháp này?',
        description: 'VISTA là dự án với sứ mệnh nâng cao nhận thức cộng đồng về sức khỏe của mắt – những vấn đề tưởng chừng nhỏ nhưng ảnh hưởng lớn đến chất lượng sống. Chúng tôi tin rằng khi mỗi người hiểu đúng về đôi mắt của mình, họ sẽ nhìn rõ hơn không chỉ thế giới, mà cả tương lai phía trước.',
        feature1: 'Thông tin xác thực',
        feature2: 'Vì sức khỏe cộng đồng',
        feature3: 'Đối tác chuyên môn cao',
      },
    },
    knowledge: {
      title: 'Trải nghiệm thị giác',
      hoverHint: 'Di chuột qua từng phần để xem chi tiết',
      virtualTryOn: {
        title: 'Trải nghiệm mắt kính',
        subtitle: 'Virtual Try-On',
        description: 'Lựa chọn mắt kính phù hợp với gương mặt của bạn qua công nghệ của máy ảnh thị giác',
      },
      visualSimulation: {
        title: 'Trải nghiệm thị giác',
        subtitle: 'Visual Simulation',
        description: 'Nhìn thế giới qua đôi mắt của người mắc các bệnh lý về mắt',
      },
      visionTest: {
        title: 'Kiểm tra thị lực',
        subtitle: 'Vision Test',
        description: 'Kiểm tra mù màu của đôi mắt bạn ngay tại nhà một cách nhanh chóng qua máy ảnh thị giác',
      },
      cta: 'Trải nghiệm ngay',
      bottomTitle: 'Sẵn sàng trải nghiệm?',
      bottomDescription: 'Khám phá thế giới thị giác với công nghệ AI tiên tiến của VISTA',
      bottomCta: 'Bắt đầu ngay',
      backHome: 'Về trang chủ',
    },
    journey: {
      badge: 'Hành trình vẫn đang tiếp tục',
      title: 'Hành trình của VISTA',
      subtitle: 'Từ lớp học ra cộng đồng',
      milestones: 'cột mốc quan trọng',
      exploreCta: 'Khám phá hành trình',
      scrollHint: 'Cuộn xuống để xem',
      fbLink: 'Xem bài viết trên Facebook',
      highlights: 'Điểm nổi bật:',
      milestone1: {
        chapter: 'Cột mốc 01',
        title: 'Triển lãm SEE BEYOND',
        subtitle: 'Triển lãm trải nghiệm thị giác đầu tiên tại Việt Nam',
        quote: 'Lần đầu tiên tại Việt Nam, một triển lãm cho phép công chúng trải nghiệm thế giới qua đôi mắt của người mắc bệnh lý thị giác.',
        description: 'Triển lãm SEE BEYOND là sự kiện cộng đồng đầu tiên VISTA tổ chức nhằm nâng cao nhận thức về sức khỏe mắt. Tại đây, khách tham quan được trực tiếp trải nghiệm cách nhìn của người cận thị, viễn thị, loạn thị... thông qua công nghệ AI.',
        highlight1: 'Hơn 300 khách tham quan',
        highlight2: 'AR thử kính trực tiếp',
        highlight3: 'Trải nghiệm công nghệ AI',
      },
      milestone2: {
        chapter: 'Cột mốc 02',
        title: 'Nhận học bổng 50 triệu đồng',
        subtitle: 'Học bổng Khởi nghiệp Sáng tạo 2025',
        quote: 'Sự đầu tư vào tài năng trẻ là sự đầu tư vào tương lai của xã hội.',
        description: 'VISTA vinh dự được lựa chọn vào chương trình Học bổng Khởi nghiệp Sáng tạo do FPT University tổ chức, với giá trị 50 triệu đồng. Học bổng này không chỉ là nguồn tài chính hỗ trợ nhóm phát triển sản phẩm, mà còn là sự khẳng định giá trị ứng dụng thực tế của dự án.',
        highlight1: 'Học bổng 50 triệu',
        highlight2: 'Hỗ trợ phát triển',
        highlight3: 'Định hướng doanh nghiệp',
      },
      milestone3: {
        chapter: 'Cột mốc 03',
        title: 'Hội thảo xoá cận thị',
        subtitle: 'Hội thảo chuyên đề cùng BS CKII Trần Bá Kiền',
        quote: 'Kiến thức y khoa được truyền tải trực tiếp từ chuyên gia là nền tảng vững chắc cho dự án.',
        description: 'Nhóm VISTA có buổi làm việc và học hỏi cùng BS CKII Trần Bá Kiền – chuyên gia hàng đầu trong lĩnh vực nhãn khoa. Trong buổi hội thảo, các thành viên được tìm hiểu sâu về các phương pháp điều trị cận thị hiện đại, từ đó cải thiện tính chính xác của giải pháp AI.',
        highlight1: 'BS CKII Trần Bá Kiền',
        highlight2: 'Kiến thức y khoa',
        highlight3: 'Học hỏi & Kết nối',
      },
      milestone4: {
        chapter: 'Cột mốc 04',
        title: 'Ký kết và bàn giao cho Bệnh viện Mắt VISI Sóc Trăng',
        subtitle: 'Giải pháp trải nghiệm thị giác tích hợp AI',
        quote: 'Lần đầu tiên một dự án sinh viên được chuyển giao để triển khai thử nghiệm trong môi trường bệnh viện thực tế.',
        description: 'Ngày 02/02, dự án VISTA chính thức ký kết và bàn giao giải pháp trải nghiệm thị giác tích hợp AI cho Bệnh viện Mắt VISI Sóc Trăng. Sự kiện này khẳng định năng lực sáng tạo của sinh viên FPT, tính khả thi trong vận hành giải pháp và khả năng đáp ứng nhu cầu thực tế của doanh nghiệp y tế.',
        highlight1: 'Bệnh viện VISI',
        highlight2: 'AI tích hợp',
        highlight3: 'Ứng dụng thực tiễn',
      },
      solution: {
        badge: 'Giải pháp cốt lõi',
        title: 'Trải nghiệm thị giác tích hợp AI',
        description1: 'Hệ thống sử dụng AI để mô phỏng trải nghiệm nhìn của các tật khúc xạ như: cận thị, viễn thị, loạn thị, đục thủy tinh thể... Thay vì sử dụng thuật ngữ y khoa phức tạp, VISTA chuyển đổi dữ liệu y học thành hình ảnh và trải nghiệm thị giác trực quan.',
        description2: 'Trong môi trường bệnh viện, VISTA đóng vai trò là công cụ hỗ trợ tư vấn, giúp bác sĩ và nhân viên y tế giao tiếp hiệu quả hơn với bệnh nhân.',
        cta: 'Trải nghiệm ngay',
        knowledge: 'Kiến thức mắt',
        home: 'Trang chủ',
      },
    },
    explore: {
      title: 'Khám phá kiến thức về mắt',
      description: 'Tìm hiểu về các bệnh lý mắt phổ biến và cách chăm sóc đôi mắt của bạn',
      header: 'Kiến thức',
      choose: 'Chọn chế độ để bắt đầu',
      quiz: {
        title: 'Quiz',
        subtitle: 'Kiểm tra kiến thức',
        description: 'Thử thách nhanh với các câu hỏi về sức khỏe mắt',
      },
      podcast: {
        title: 'Podcast',
        subtitle: 'Lắng nghe chuyên gia',
        description: 'Nghe kiến thức dễ vào, mọi lúc mọi nơi',
      },
      video: {
        title: 'Video',
        subtitle: 'Học qua hình ảnh',
        description: 'Xem hướng dẫn trực quan và dễ thực hành',
      },
      cta: 'Khám phá ngay',
    },
    quizPage: {
      title: 'Kiểm tra kiến thức về mắt',
      description: 'Trả lời 10 câu hỏi để kiểm tra hiểu biết của bạn về sức khỏe mắt',
      meta: {
        questions: '10 câu hỏi',
        time: 'Không giới hạn thời gian',
      },
      actions: {
        start: 'Bắt đầu',
        retry: 'Làm lại',
        home: 'Về trang chủ',
      },
      questionLabel: 'Câu',
      detailsTitle: 'Chi tiết kết quả',
      result: {
        excellent: 'Xuất sắc!',
        good: 'Khá tốt!',
        improve: 'Cần cải thiện!',
        summaryPrefix: 'Bạn trả lời đúng',
        summarySuffix: 'câu',
      },
      answers: {
        yours: 'Đáp án của bạn:',
        correct: 'Đáp án đúng:',
      },
    },
    common: {
      loading: 'Đang tải...',
      error: 'Đã có lỗi xảy ra',
      close: 'Đóng',
    },
    chatbot: {
      title: 'Vista Eye Care',
      status: 'Trợ lý AI đang trực tuyến',
      close: 'Đóng Chat',
      inputPlaceholder: 'Nhập tin nhắn...',
      inputBlocked: 'Chờ một lát nhé...',
      openChat: 'Mở Chatbot',
      greeting: 'Xin chào! Mình là trợ lý Vista Eye Care. Bạn có thể hỏi mình các bệnh lý về mắt 😊',
      quickSuggestions: [
        'Khám mắt tổng quát là gì?',
        'Triệu chứng cận thị',
        'Phòng ngừa đục thủy tinh thể',
        'Giá dịch vụ khám mắt',
        'Đặt lịch khám như thế nào?',
        'Giờ làm việc của Vista'
      ],
      responses: {
        greeting: 'Xin chào! 👋 Chào mừng bạn đến với Vista Eye Care. Mình có thể tư vấn về:\n• Khám mắt tổng quát\n• Đo khúc xạ & cắt kính\n• Phẫu thuật LASIK\n• Điều trị các bệnh về mắt\n\nBạn quan tâm dịch vụ nào nhỉ? 😊',
        whoAreYou: 'Mình là trợ lý ảo của Vista Eye Care - Trung tâm nhãn khoa uy tín tại Cần Thơ. Mình có thể giúp bạn:\n✓ Tìm hiểu về bệnh lý mắt\n✓ Tư vấn dịch vụ khám & điều trị\n✓ Hướng dẫn đặt lịch hẹn\n✓ Giải đáp thắc mắc về giá cả',
        whatCanYouDo: 'Mình có thể hỗ trợ bạn:\n📋 Tư vấn các dịch vụ nhãn khoa\n👁️ Giải đáp về bệnh lý mắt\n📅 Hướng dẫn đặt lịch khám\n💰 Thông tin giá dịch vụ\n⏰ Giờ làm việc & địa chỉ\n\nBạn cần giúp gì nhỉ?',
        contact: 'Bạn có thể liên hệ Vista qua Facebook: https://www.facebook.com/profile.php?id=61581889931780 — đội ngũ sẽ phản hồi sớm nhất.',
        address: 'Địa chỉ Vista: 600 Nguyễn Văn Cừ nối dài, An Bình, Bình Thuỷ, Cần Thơ 900000. Bạn có thể đặt lịch trước để giảm thời gian chờ.',
        overloaded: '⚠️ Hệ thống AI đang quá tải. Vui lòng thử lại sau hoặc sử dụng các câu hỏi thường gặp bên dưới.',
        cooldown: '⏱️ Vui lòng chờ 2 giây trước khi gửi tin nhắn tiếp theo để tránh spam hệ thống.',
        tooManyMessages: '🚫 Bạn đã gửi quá nhiều tin nhắn! Vui lòng chờ 1 phút trước khi tiếp tục. Điều này giúp hệ thống hoạt động ổn định hơn.',
        noInfo: 'Xin lỗi, mình chưa có thông tin về câu hỏi này. Bạn có thể thử hỏi về:\n• Khám mắt tổng quát\n• Cận thị, viễn thị\n• Đục thủy tinh thể\n• Giá dịch vụ\n• Đặt lịch hẹn\n\nHoặc gọi hotline: 038 883 3157 để được tư vấn trực tiếp nhé! 😊',
        error: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau! 🙏'
      }
    },
  },
  en: {
    nav: {
      home: 'Home',
      services: 'Services',
      knowledge: 'Virtual Eye',
      explore: 'Knowledge',
      journey: 'Journey',
      quiz: 'Quiz',
    },
    home: {
      hero: {
        badge: 'Advanced AI Technology',
        title: 'Visual Experience',
        subtitle: 'With VISTA',
        title2: 'When eyes',
        subtitle2: 'are truly understood',
        description: 'AI-integrated visual experience solution helps you understand your eye health better',
        cta: 'Try Now',
        learnMore: 'Learn More',
      },
      whyChoose: {
        badge: 'About Us',
        title: 'FPT University Can Tho Student Team',
        title2: 'Comprehensive Visual Experience Solution',
        description: 'VISTA - Patient Journey is a project developed by student team with the goal of raising community awareness about eye health and common ophthalmological issues. By supporting hospitals and partner units to deliver information clearly and accessibly, the project aims to help users understand correctly, care properly, and protect their eyes daily, especially in today\'s digital age.',
        list1: 'Eye Knowledge',
        list2: 'Eye Health Care',
        list3: 'Common Eye Problems',
        list4: 'Verified Knowledge from Professional Organizations',
      },
      team: {
        badge: 'Vista Team',
        title: 'Project Members',
      },
      features: {
        badge: 'WHY CHOOSE VISTA?',
        title: 'Why choose this solution?',
        description: 'VISTA is a project with the mission to raise community awareness about eye health – seemingly small issues that have a big impact on quality of life. We believe that when people truly understand their eyes, they will see more clearly not only the world, but also the future ahead.',
        feature1: 'Verified Information',
        feature2: 'For Community Health',
        feature3: 'Professional Partners',
      },
    },
    knowledge: {
      title: 'Visual Experience',
      hoverHint: 'Hover over each section to see details',
      virtualTryOn: {
        title: 'Virtual Eyewear Experience',
        subtitle: 'Virtual Try-On',
        description: 'Choose eyewear that fits your face using computer-vision camera technology',
      },
      visualSimulation: {
        title: 'Visual Experience',
        subtitle: 'Visual Simulation',
        description: 'See the world through the eyes of people with various eye conditions',
      },
      visionTest: {
        title: 'Vision Test',
        subtitle: 'Vision Test',
        description: 'Quickly check for color blindness at home using a computer-vision camera',
      },
      cta: 'Try Now',
      bottomTitle: 'Ready to experience?',
      bottomDescription: 'Explore the world of vision with VISTA\'s advanced AI technology',
      bottomCta: 'Get Started',
      backHome: 'Back to Home',
    },
    journey: {
      badge: 'The journey continues',
      title: 'VISTA\'s Journey',
      subtitle: 'From classroom to community',
      milestones: 'important milestones',
      exploreCta: 'Explore the journey',
      scrollHint: 'Scroll down to view',
      fbLink: 'View post on Facebook',
      highlights: 'Highlights:',
      milestone1: {
        chapter: 'Milestone 01',
        title: 'SEE BEYOND Exhibition',
        subtitle: 'Vietnam\'s first visual experience exhibition',
        quote: 'For the first time in Vietnam, an exhibition allows the public to experience the world through the eyes of people with visual impairments.',
        description: 'SEE BEYOND Exhibition is the first community event organized by VISTA to raise awareness about eye health. Here, visitors can directly experience how people with myopia, hyperopia, astigmatism... see the world through AI technology.',
        highlight1: 'Over 300 visitors',
        highlight2: 'AR direct glasses try-on',
        highlight3: 'AI technology experience',
      },
      milestone2: {
        chapter: 'Milestone 02',
        title: 'Received 50 Million VND Scholarship',
        subtitle: 'Creative Startup Scholarship 2025',
        quote: 'Investing in young talent is investing in society\'s future.',
        description: 'VISTA is honored to be selected for the Creative Startup Scholarship program organized by FPT University, valued at 50 million VND. This scholarship is not only financial support for product development, but also an affirmation of the project\'s practical application value.',
        highlight1: '50 million scholarship',
        highlight2: 'Development support',
        highlight3: 'Enterprise orientation',
      },
      milestone3: {
        chapter: 'Milestone 03',
        title: 'Myopia Treatment Seminar',
        subtitle: 'Specialized seminar with Dr. Tran Ba Kien',
        quote: 'Medical knowledge transmitted directly from experts is the solid foundation for the project.',
        description: 'VISTA team had a working and learning session with Dr. Tran Ba Kien – a leading expert in ophthalmology. During the seminar, members learned in-depth about modern myopia treatment methods, thereby improving the accuracy of the AI solution.',
        highlight1: 'Dr. Tran Ba Kien',
        highlight2: 'Medical knowledge',
        highlight3: 'Learning & Networking',
      },
      milestone4: {
        chapter: 'Milestone 04',
        title: 'Signing and Handover to VISI Eye Hospital Soc Trang',
        subtitle: 'AI-integrated visual experience solution',
        quote: 'For the first time, a student project was handed over for trial deployment in a real hospital environment.',
        description: 'On February 2, VISTA project officially signed and handed over the AI-integrated visual experience solution to VISI Eye Hospital Soc Trang. This event affirms the creative capacity of FPT students, the feasibility of operating the solution, and the ability to meet the practical needs of healthcare businesses.',
        highlight1: 'VISI Hospital',
        highlight2: 'AI integration',
        highlight3: 'Practical application',
      },
      solution: {
        badge: 'Core Solution',
        title: 'AI-Integrated Visual Experience',
        description1: 'The system uses AI to simulate visual experiences of refractive errors such as myopia, hyperopia, astigmatism, cataracts... Instead of using complex medical terminology, VISTA converts medical data into images and intuitive visual experiences.',
        description2: 'In hospital settings, VISTA serves as a consulting support tool, helping doctors and medical staff communicate more effectively with patients.',
        cta: 'Try Now',
        knowledge: 'Eye Knowledge',
        home: 'Home',
      },
    },
    explore: {
      title: 'Explore Eye Knowledge',
      description: 'Learn about common eye conditions and how to care for your eyes',
      header: 'Knowledge',
      choose: 'Choose a mode to start',
      quiz: {
        title: 'Quiz',
        subtitle: 'Test Your Knowledge',
        description: 'Quick challenge with eye health questions',
      },
      podcast: {
        title: 'Podcast',
        subtitle: 'Listen to Experts',
        description: 'Easy-to-digest knowledge, anytime anywhere',
      },
      video: {
        title: 'Video',
        subtitle: 'Learn Visually',
        description: 'Watch intuitive and practical guides',
      },
      cta: 'Explore Now',
    },
    quizPage: {
      title: 'Eye Knowledge Quiz',
      description: 'Answer 10 questions to test your understanding of eye health',
      meta: {
        questions: '10 questions',
        time: 'No time limit',
      },
      actions: {
        start: 'Start',
        retry: 'Retry',
        home: 'Back to Home',
      },
      questionLabel: 'Question',
      detailsTitle: 'Result Details',
      result: {
        excellent: 'Excellent!',
        good: 'Good job!',
        improve: 'Needs improvement!',
        summaryPrefix: 'You answered correctly',
        summarySuffix: 'questions',
      },
      answers: {
        yours: 'Your answer:',
        correct: 'Correct answer:',
      },
    },
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      close: 'Close',
    },
    chatbot: {
      title: 'Vista Eye Care',
      status: 'AI Assistant Online',
      close: 'Close Chat',
      inputPlaceholder: 'Type a message...',
      inputBlocked: 'Wait a moment...',
      openChat: 'Open Chatbot',
      greeting: 'Hello! I\'m Vista Eye Care assistant. You can ask me about eye conditions 😊',
      quickSuggestions: [
        'What is comprehensive eye exam?',
        'Myopia symptoms',
        'Preventing cataracts',
        'Eye exam service pricing',
        'How to book an appointment?',
        'Vista working hours'
      ],
      responses: {
        greeting: 'Hello! 👋 Welcome to Vista Eye Care. I can advise you on:\n• Comprehensive eye exams\n• Refraction testing & glasses prescription\n• LASIK surgery\n• Eye disease treatment\n\nWhich service are you interested in? 😊',
        whoAreYou: 'I am the virtual assistant of Vista Eye Care - a reputable ophthalmology center in Can Tho. I can help you:\n✓ Learn about eye conditions\n✓ Consulting examination & treatment services\n✓ Appointment booking guidance\n✓ Answering pricing questions',
        whatCanYouDo: 'I can assist you with:\n📋 Ophthalmology service consulting\n👁️ Eye condition information\n📅 Appointment booking guidance\n💰 Service pricing information\n⏰ Working hours & address\n\nHow can I help you?',
        contact: 'You can contact Vista via Facebook: https://www.facebook.com/profile.php?id=61581889931780 — our team will respond as soon as possible.',
        address: 'Vista Address: 600 Nguyen Van Cu Extension, An Binh, Binh Thuy, Can Tho 900000. You can book in advance to reduce waiting time.',
        overloaded: '⚠️ AI system is overloaded. Please try again later or use the frequently asked questions below.',
        cooldown: '⏱️ Please wait 2 seconds before sending the next message to avoid spamming the system.',
        tooManyMessages: '🚫 You have sent too many messages! Please wait 1 minute before continuing. This helps the system operate more stably.',
        noInfo: 'Sorry, I don\'t have information about this question. You can try asking about:\n• Comprehensive eye exam\n• Myopia, hyperopia\n• Cataracts\n• Service pricing\n• Booking appointments\n\nOr call hotline: 038 883 3157 for direct consultation! 😊',
        error: 'Sorry, an error occurred. Please try again later! 🙏'
      }
    },
  },
  km: {
    nav: {
      home: 'ទំព័រដើម',
      services: 'សេវាកម្ម',
      knowledge: 'ភ្នែកនិម្មិត',
      explore: 'ចំណេះដឹង',
      journey: 'ដំណើររបស់យើង',
      quiz: 'សំណួរ',
    },
    home: {
      hero: {
        badge: 'បច្ចេកវិទ្យា AI ទំនើប',
        title: 'បទពិសោធន៍ចក្ខុវិស័យ',
        subtitle: 'ជាមួយ VISTA',
        title2: 'នៅពេលភ្នែក',
        subtitle2: 'ត្រូវបានយល់ដឹង',
        description: 'ដំណោះស្រាយបទពិសោធន៍ចក្ខុវិស័យដែលបញ្ចូល AI ជួយអ្នកយល់ដឹងកាន់តែច្បាស់អំពីសុខភាពភ្នែករបស់អ្នក',
        cta: 'សាកល្បងឥឡូវ',
        learnMore: 'ស្វែងយល់បន្ថែម',
      },
      whyChoose: {
        badge: 'អំពីយើង',
        title: 'ក្រុមនិស្សិតសាកលវិទ្យាល័យ FPT ក្រុងកន្ទ',
        title2: 'ដំណោះស្រាយបទពិសោធន៍ចក្ខុវិស័យដ៏ស្មើភាព',
        description: 'VISTA - Patient Journey គឺជាគម្រោងដែលអភិវឌ្ឍដោយក្រុមនិស្សិត ក្នុងគោលបំណងលើកកំពស់ការយល់ដឹងរបស់សហគមន៍អំពីសុខភាពភ្នែក និងបញ្ហាភ្នែកទូទៅ។ តាមរយៈការគាំទ្រមន្ទីរពេទ្យ និងដៃគូដើម្បីបញ្ជូនព័ត៌មានបានច្បាស់លាស់ គម្រោងនេះមានគោលបំណងជួយអ្នកប្រើប្រាស់យល់ដឹងយ៉ាងត្រឹមត្រូវ ថែរក្សាត្រឹមត្រូវ និងការពារភ្នែកឱ្យមានសុខភាពល្អ ជាពិសេសក្នុងយុគសម័យឌីជីថលបច្ចុប្បន្ននេះ។',
        list1: 'ចំណេះដឹងអំពីភ្នែក',
        list2: 'ការថែទាំសុខភាពភ្នែក',
        list3: 'បញ្ហាភ្នែកទូទៅ',
        list4: 'ចំណេះដឹងដែលបានផ្ទៀងផ្ទាត់ពីអង្គការប្រកបដោយវិជ្ជាជីវៈ',
      },
      team: {
        badge: 'ក្រុម Vista',
        title: 'សមាជិកគម្រោង',
      },
      features: {
        badge: 'ហេតុអ្វីបានជាជ្រើសរើស VISTA?',
        title: 'ហេតុអ្វីបានជាជ្រើសរើសដំណោះស្រាយនេះ?',
        description: 'VISTA គឺជាគម្រោងដែលមានបេសកកម្មលើកកំពស់ការយល់ដឹងរបស់សហគមន៍អំពីសុខភាពភ្នែក។ យើងជឿជាក់ថាពេលមនុស្សយល់ដឹងត្រឹមត្រូវអំពីភ្នែករបស់ពួកគេ ពួកគេនឹងមើលឃើញមិនត្រឹមតែពិភពលោក ប៉ុន្តែក៏អនាគតផងដែរ។',
        feature1: 'ព័ត៌មានដែលបានផ្ទៀងផ្ទាត់',
        feature2: 'ដើម្បីសុខភាពសហគមន៍',
        feature3: 'ដៃគូប្រកបដោយវិជ្ជាជីវៈ',
      },
    },
    knowledge: {
      title: 'បទពិសោធន៍ចក្ខុវិស័យ',
      hoverHint: 'ដាក់កណ្ដុរលើផ្នែកនីមួយៗដើម្បីមើលព័ត៌មានលម្អិត',
      virtualTryOn: {
        title: 'បទពិសោធន៍វ៉ែនតា',
        subtitle: 'Virtual Try-On',
        description: 'ជ្រើសរើសវ៉ែនតាដែលស្រប ទៅនឹងមុខរបស់អ្នកតាមរយៈបច្ចេកវិទ្យាកាមេរ៉ាចក្ខុ',
      },
      visualSimulation: {
        title: 'បទពិសោធន៍ចក្ខុវិស័យ',
        subtitle: 'Visual Simulation',
        description: 'មើលពិភពលោកតាមរយៈភ្នែករបស់អ្នកដែលមានជំងឺភ្នែក',
      },
      visionTest: {
        title: 'ការតេស្តចក្ខុវិស័យ',
        subtitle: 'Vision Test',
        description: 'ពិនិត្យភ្នែកព័ណ៌ស្ទើររបស់អ្នកនៅផ្ទះយ៉ាងរហ័សតាមរយៈកាមេរ៉ា',
      },
      cta: 'សាកល្បងឥឡូវ',
      bottomTitle: 'រួចរាល់ហើយឬ?',
      bottomDescription: 'រុករកពិភពលោកចក្ខុវិស័យជាមួយបច្ចេកវិទ្យា AI ទំនើបរបស់ VISTA',
      bottomCta: 'ចាប់ផ្ដើម',
      backHome: 'ត្រឡប់ទំព័រដើម',
    },
    journey: {
      badge: 'ដំណើរនៅតែបន្ត',
      title: 'ដំណើររបស់ VISTA',
      subtitle: 'ពីថ្នាក់រៀនដល់សហគមន៍',
      milestones: 'វិស័យសំខាន់ៗ',
      exploreCta: 'រុករកដំណើរ',
      scrollHint: 'រំកិលចុះដើម្បីមើល',
      fbLink: 'មើលប្រកាសនៅ Facebook',
      highlights: 'ចំណុចសំខាន់:',
      milestone1: {
        chapter: 'វិស័យ ០១',
        title: 'ពិព័រណ៍ SEE BEYOND',
        subtitle: 'ពិព័រណ៍បទពិសោធន៍ចក្ខុវិស័យដំបូងបង្អស់នៅវៀតណាម',
        quote: 'ជាលើកដំបូងនៅវៀតណាម ពិព័រណ៍មួយប្រើប្រាស់ AI ដើម្បីឱ្យសាធារណជនរំឭកបទពិសោធន៍ចក្ខុវិស័យរបស់អ្នកដែលមានជំងឺភ្នែក។',
        description: 'ពិព័រណ៍ SEE BEYOND គឺជាព្រឹត្តិការណ៍សហគមន៍ដំបូងដែល VISTA រៀបចំដើម្បីលើកកំពស់ការយល់ដឹងអំពីសុខភាពភ្នែក។',
        highlight1: 'ភ្ញៀវជាង ៣០០ នាក់',
        highlight2: 'ការសាកល្បង AR ផ្ទាល់',
        highlight3: 'បទពិសោធន៍ AI',
      },
      milestone2: {
        chapter: 'វិស័យ ០២',
        title: 'ទទួលបានអាហារូបករណ៍ ៥០ លានដុង',
        subtitle: 'អាហារូបករណ៍ចាប់ផ្ដើមអាជីវកម្មច្នៃប្រឌិត ២០២៥',
        quote: 'ការវិនិយោគលើទេពកោសល្យវ័យក្មេងគឺការវិនិយោគលើអនាគតសង្គម។',
        description: 'VISTA មានកិត្តិយសសម្រេចទទួលបានអាហារូបករណ៍ចាប់ផ្ដើមអាជីវកម្មច្នៃប្រឌិតរបស់សាកលវិទ្យាល័យ FPT ដែលមានតម្លៃ ៥០ លានដុង។',
        highlight1: 'អាហារូបករណ៍ ៥០ លាន',
        highlight2: 'ការគាំទ្រការអភិវឌ្ឍ',
        highlight3: 'ទិសដៅសហគ្រាស',
      },
      milestone3: {
        chapter: 'វិស័យ ០៣',
        title: 'សិក្ខាសាលាព្យាបាលភ្នែកខ្លី',
        subtitle: 'សិក្ខាសាលាជាមួយ BS CKII Trần Bá Kiền',
        quote: 'ចំណេះដឹងវេជ្ជសាស្ត្រដែលបញ្ជូនដោយផ្ទាល់ពីអ្នកជំនាញជាមូលដ្ឋានរឹងមាំ។',
        description: 'ក្រុម VISTA បានធ្វើការនិងរៀនពី BS CKII Trần Bá Kiền អ្នកជំនាញឈានមុខគេខាងភ្នែក។',
        highlight1: 'BS CKII Trần Bá Kiền',
        highlight2: 'ចំណេះដឹងវេជ្ជសាស្ត្រ',
        highlight3: 'ការរៀនសូត្រ & ការតភ្ជាប់',
      },
      milestone4: {
        chapter: 'វិស័យ ០៤',
        title: 'ចុះហត្ថលេខា & ប្រគល់ឱ្យមន្ទីរពេទ្យភ្នែក VISI Sóc Trăng',
        subtitle: 'ដំណោះស្រាយបទពិសោធន៍ចក្ខុវិស័យដែលបញ្ចូល AI',
        quote: 'ជាលើកដំបូងគម្រោងនិស្សិតត្រូវបានប្រគល់ដើម្បីដាក់ពង្រាយសាកល្បងក្នុងបរិយាកាសមន្ទីរពេទ្យពិតប្រាកដ។',
        description: 'នៅថ្ងៃទី ០២/០២ គម្រោង VISTA បានចុះហត្ថលេខាជាផ្លូវការ និងប្រគល់ដំណោះស្រាយបទពិសោធន៍ចក្ខុវិស័យ AI ឱ្យមន្ទីរពេទ្យភ្នែក VISI Sóc Trăng។',
        highlight1: 'មន្ទីរពេទ្យ VISI',
        highlight2: 'AI ដែលបញ្ចូល',
        highlight3: 'ការអនុវត្តជាក់ស្ដែង',
      },
      solution: {
        badge: 'ដំណោះស្រាយស្នូល',
        title: 'បទពិសោធន៍ចក្ខុវិស័យដែលបញ្ចូល AI',
        description1: 'ប្រព័ន្ធប្រើ AI ដើម្បីក្លែងធ្វើបទពិសោធន៍ចក្ខុវិស័យនៃការបាក់ចក្ខុ ដូចជាភ្នែកខ្លី ភ្នែកវែង គ្រីស្យ══ ភ្នែកពន្លឺ...',
        description2: 'នៅក្នុងបរិយាកាសមន្ទីរពេទ្យ VISTA ដើរតួជាឧបករណ៍ជំនួយប្រឹក្សា ជួយវេជ្ជបណ្ឌិតប្រាស្រ័យទាក់ទងប្រកបដោយប្រសិទ្ធភាពជាងមុនជាមួយអ្នកជំងឺ។',
        cta: 'សាកល្បងឥឡូវ',
        knowledge: 'ចំណេះដឹងភ្នែក',
        home: 'ទំព័រដើម',
      },
    },
    explore: {
      title: 'រុករកចំណេះដឹងអំពីភ្នែក',
      description: 'ស្វែងយល់អំពីជំងឺភ្នែកទូទៅ និងវិធីថែទាំភ្នែករបស់អ្នក',
      header: 'ចំណេះដឹង',
      choose: 'ជ្រើសរើសរបៀបដើម្បីចាប់ផ្ដើម',
      quiz: {
        title: 'Quiz',
        subtitle: 'ពិនិត្យចំណេះដឹង',
        description: 'ការប្រឡងរហ័សជាមួយសំណួរសុខភាពភ្នែក',
      },
      podcast: {
        title: 'Podcast',
        subtitle: 'ស្ដាប់អ្នកជំនាញ',
        description: 'ចំណេះដឹងងាយស្រួលស្ដាប់ ថ្ងៃណា ពេលណាក៏បាន',
      },
      video: {
        title: 'Video',
        subtitle: 'រៀនតាមរូបភាព',
        description: 'មើលការណែនាំដែលជាក់ស្ដែងនិងអាចអនុវត្ត',
      },
      cta: 'រុករកឥឡូវ',
    },
    quizPage: {
      title: 'ការប្រឡងចំណេះដឹងអំពីភ្នែក',
      description: 'ឆ្លើយ ១០ សំណួរដើម្បីពិនិត្យការយល់ដឹងរបស់អ្នកអំពីសុខភាពភ្នែក',
      meta: {
        questions: '១០ សំណួរ',
        time: 'គ្មានកំណត់ពេលវេលា',
      },
      actions: {
        start: 'ចាប់ផ្ដើម',
        retry: 'សាកល្បងម្ដងទៀត',
        home: 'ទំព័រដើម',
      },
      questionLabel: 'សំណួរ',
      detailsTitle: 'លម្អិតលទ្ធផល',
      result: {
        excellent: 'ល្អឥតខ្ចោះ!',
        good: 'ល្អណាស់!',
        improve: 'ត្រូវការកែលម្អ!',
        summaryPrefix: 'អ្នកឆ្លើយត្រឹមត្រូវ',
        summarySuffix: 'សំណួរ',
      },
      answers: {
        yours: 'ចម្លើយរបស់អ្នក:',
        correct: 'ចម្លើយត្រឹមត្រូវ:',
      },
    },
    common: {
      loading: 'កំពុងផ្ទុក...',
      error: 'មានកំហុសបច្ចេកទេស',
      close: 'បិទ',
    },
    chatbot: {
      title: 'Vista Eye Care',
      status: 'ជំនួយការ AI អនឡាញ',
      close: 'បិទការជជែក',
      inputPlaceholder: 'វាយសារ...',
      inputBlocked: 'សូមរង់ចាំ...',
      openChat: 'បើកការជជែក',
      greeting: 'សួស្ដី! ខ្ញុំជាជំនួយការ Vista Eye Care។ អ្នកអាចសួរខ្ញុំអំពីជំងឺភ្នែក 😊',
      quickSuggestions: [
        'ការពិនិត្យភ្នែកទូទៅគឺជាអ្វី?',
        'រោគសញ្ញាភ្នែកខ្លី',
        'ការការពារភ្នែកពន្លឺ',
        'តម្លៃសេវាពិនិត្យភ្នែក',
        'របៀបកក់ការណាត់ជួប?',
        'ម៉ោងធ្វើការ Vista'
      ],
      responses: {
        greeting: 'សួស្ដី! 👋 ស្វាគមន៍មកកាន់ Vista Eye Care។ ខ្ញុំអាចផ្ដល់ដំបូន្មានអំពី:\n• ការពិនិត្យភ្នែកទូទៅ\n• ការវាស់វែង & វ៉ែនតា\n• ការវះកាត់ LASIK\n• ការព្យាបាលជំងឺភ្នែក\n\nអ្នកចាប់អារម្មណ៍សេវាណា? 😊',
        whoAreYou: 'ខ្ញុំជាជំនួយការនិម្មិតរបស់ Vista Eye Care - មជ្ឈមណ្ឌលភ្នែកល្បីល្បាញក្នុងក្រុង Cần Thơ។ ខ្ញុំអាចជួយអ្នក:\n✓ ស្វែងយល់អំពីជំងឺភ្នែក\n✓ ប្រឹក្សាសេវាពិនិត្យ & ព្យាបាល\n✓ ណែនាំការកក់ណាត់ជួប\n✓ ឆ្លើយសំណួរអំពីតម្លៃ',
        whatCanYouDo: 'ខ្ញុំអាចជួយអ្នក:\n📋 ប្រឹក្សាសេវាភ្នែក\n👁️ ព័ត៌មានជំងឺភ្នែក\n📅 ណែនាំការកក់ណាត់ជួប\n💰 ព័ត៌មានតម្លៃសេវា\n⏰ ម៉ោងធ្វើការ & អាសយដ្ឋាន\n\nខ្ញុំអាចជួយអ្វី?',
        contact: 'អ្នកអាចទំនាក់ទំនង Vista តាម Facebook: https://www.facebook.com/profile.php?id=61581889931780 — ក្រុមមានឫក្ខណ៍ឆ្លើយតបឆាប់រហ័ស។',
        address: 'អាសយដ្ឋាន Vista: 600 Nguyễn Văn Cừ, An Bình, Bình Thuỷ, Cần Thơ 900000។ អ្នកអាចកក់ទុកជាមុនដើម្បីកាត់បន្ថយពេលរង់ចាំ។',
        overloaded: '⚠️ ប្រព័ន្ធ AI ជួបភាពមមាញឹក។ សូមព្យាយាមម្ដងទៀតនៅពេលក្រោយ។',
        cooldown: '⏱️ សូមរង់ចាំ ២ វិនាទីមុនពេលផ្ញើសារបន្ទាប់។',
        tooManyMessages: '🚫 អ្នកផ្ញើសារច្រើនពេក! សូមរង់ចាំ ១ នាទីមុនពេលបន្ត។',
        noInfo: 'សូមទោស ខ្ញុំមិនមានព័ត៌មានអំពីសំណួរនេះ។ អ្នកអាចសាកសួរអំពី:\n• ការពិនិត្យភ្នែកទូទៅ\n• ភ្នែកខ្លី ភ្នែកវែង\n• ភ្នែកពន្លឺ\n• តម្លៃសេវា\n• ការកក់ណាត់ជួប\n\nឬទូរស័ព្ទ hotline: 038 883 3157 ។ 😊',
        error: 'សូមទោស មានបញ្ហា។ សូមព្យាយាមម្ដងទៀត! 🙏'
      }
    },
  },
};
