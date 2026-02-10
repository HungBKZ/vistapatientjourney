import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'vista_eye_care'
    });

    console.log('🌱 Starting database seeding...');

    // Seed Doctors
    const doctors = [
      {
        full_name: 'BS. Nguyễn Văn Minh',
        email: 'dr.minh@vista.com',
        phone: '0901234567',
        specialization: 'Khúc xạ - Kính tiếp xúc',
        qualification: 'Tiến sĩ Y khoa - Đại học Y Dược TP.HCM',
        experience_years: 15,
        bio: 'Chuyên gia hàng đầu về khúc xạ và kính tiếp xúc với hơn 15 năm kinh nghiệm.',
        consultation_fee: 300000,
        is_active: true
      },
      {
        full_name: 'BS. Trần Thị Hương',
        email: 'dr.huong@vista.com',
        phone: '0902345678',
        specialization: 'Phẫu thuật Lasik',
        qualification: 'Phó Giáo sư, Tiến sĩ - Đại học Y Hà Nội',
        experience_years: 20,
        bio: 'Chuyên gia phẫu thuật Lasik với hơn 10,000 ca phẫu thuật thành công.',
        consultation_fee: 500000,
        is_active: true
      },
      {
        full_name: 'BS. Lê Hoàng Nam',
        email: 'dr.nam@vista.com',
        phone: '0903456789',
        specialization: 'Bệnh võng mạc - Glaucoma',
        qualification: 'Thạc sĩ Y khoa - Chuyên khoa II',
        experience_years: 12,
        bio: 'Chuyên gia điều trị các bệnh về võng mạc và glaucoma.',
        consultation_fee: 350000,
        is_active: true
      },
      {
        full_name: 'BS. Phạm Thị Lan',
        email: 'dr.lan@vista.com',
        phone: '0904567890',
        specialization: 'Nhãn khoa nhi',
        qualification: 'Tiến sĩ Y khoa - Đại học Y Cần Thơ',
        experience_years: 10,
        bio: 'Chuyên gia chăm sóc mắt cho trẻ em và điều trị các bệnh mắt bẩm sinh.',
        consultation_fee: 280000,
        is_active: true
      },
      {
        full_name: 'BS. Võ Minh Tuấn',
        email: 'dr.tuan@vista.com',
        phone: '0905678901',
        specialization: 'Phẫu thuật đục thủy tinh thể',
        qualification: 'Phó Giáo sư, Tiến sĩ',
        experience_years: 18,
        bio: 'Chuyên gia phẫu thuật thay thủy tinh thể nhân tạo với công nghệ mới nhất.',
        consultation_fee: 450000,
        is_active: true
      }
    ];

    for (const doctor of doctors) {
      await connection.query(
        `INSERT INTO doctors (full_name, email, phone, specialization, qualification, experience_years, bio, consultation_fee, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)`,
        [doctor.full_name, doctor.email, doctor.phone, doctor.specialization, doctor.qualification, doctor.experience_years, doctor.bio, doctor.consultation_fee, doctor.is_active]
      );
    }
    console.log('✅ Seeded 5 doctors');

    // Seed Services
    const services = [
      {
        name: 'Khám mắt tổng quát',
        slug: 'kham-mat-tong-quat',
        description: 'Khám và đánh giá toàn diện sức khỏe mắt, bao gồm đo thị lực, kiểm tra nhãn áp, soi đáy mắt.',
        short_description: 'Khám tổng quát sức khỏe mắt',
        price: 200000,
        duration_minutes: 30,
        icon: 'eye',
        is_active: true,
        display_order: 1
      },
      {
        name: 'Đo khúc xạ và cắt kính',
        slug: 'do-khuc-xa-cat-kinh',
        description: 'Đo khúc xạ chính xác bằng máy tự động và tư vấn cắt kính phù hợp.',
        short_description: 'Đo và cắt kính cận, viễn, loạn',
        price: 150000,
        duration_minutes: 45,
        icon: 'glasses',
        is_active: true,
        display_order: 2
      },
      {
        name: 'Khám và điều trị đục thủy tinh thể',
        slug: 'duc-thuy-tinh-the',
        description: 'Khám, chẩn đoán và tư vấn phương pháp điều trị đục thủy tinh thể phù hợp.',
        short_description: 'Điều trị đục thủy tinh thể',
        price: 350000,
        duration_minutes: 45,
        icon: 'lens',
        is_active: true,
        display_order: 3
      },
      {
        name: 'Tư vấn phẫu thuật Lasik',
        slug: 'tu-van-lasik',
        description: 'Khám và tư vấn chi tiết về phẫu thuật Lasik điều trị cận thị, viễn thị, loạn thị.',
        short_description: 'Tư vấn phẫu thuật Lasik',
        price: 300000,
        duration_minutes: 60,
        icon: 'laser',
        is_active: true,
        display_order: 4
      },
      {
        name: 'Khám Glaucoma (Cườm nước)',
        slug: 'kham-glaucoma',
        description: 'Khám chuyên sâu về Glaucoma, đo nhãn áp, đánh giá thần kinh thị giác.',
        short_description: 'Khám và điều trị Glaucoma',
        price: 400000,
        duration_minutes: 45,
        icon: 'pressure',
        is_active: true,
        display_order: 5
      },
      {
        name: 'Khám võng mạc - Tiểu đường',
        slug: 'kham-vong-mac',
        description: 'Khám sàng lọc và theo dõi biến chứng võng mạc do tiểu đường.',
        short_description: 'Khám võng mạc tiểu đường',
        price: 350000,
        duration_minutes: 40,
        icon: 'retina',
        is_active: true,
        display_order: 6
      },
      {
        name: 'Khám mắt trẻ em',
        slug: 'kham-mat-tre-em',
        description: 'Khám và theo dõi sức khỏe mắt cho trẻ em, phát hiện sớm các vấn đề về mắt.',
        short_description: 'Khám mắt cho trẻ em',
        price: 250000,
        duration_minutes: 35,
        icon: 'child',
        is_active: true,
        display_order: 7
      },
      {
        name: 'Kính tiếp xúc',
        slug: 'kinh-tiep-xuc',
        description: 'Tư vấn, đo và lựa chọn kính tiếp xúc phù hợp với mắt.',
        short_description: 'Tư vấn kính tiếp xúc',
        price: 200000,
        duration_minutes: 30,
        icon: 'contact',
        is_active: true,
        display_order: 8
      }
    ];

    for (const service of services) {
      await connection.query(
        `INSERT INTO services (name, slug, description, short_description, price, duration_minutes, icon, is_active, display_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE name = VALUES(name)`,
        [service.name, service.slug, service.description, service.short_description, service.price, service.duration_minutes, service.icon, service.is_active, service.display_order]
      );
    }
    console.log('✅ Seeded 8 services');

    // Seed sample user
    const hashedPassword = await bcrypt.hash('123456', 10);
    await connection.query(
      `INSERT INTO users (full_name, email, phone, password, gender, address)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)`,
      ['Nguyễn Văn Test', 'test@vista.com', '0912345678', hashedPassword, 'male', 'Cần Thơ, Việt Nam']
    );
    console.log('✅ Seeded sample user (email: test@vista.com, password: 123456)');

    // Seed Quiz Questions
    // Ensure we don't keep old rows (which may not have English fields)
    await connection.query('DELETE FROM quiz_questions');
    await connection.query('ALTER TABLE quiz_questions AUTO_INCREMENT = 1');

    const questions = [
      {
        question: 'Khoảng cách an toàn khi nhìn màn hình máy tính là bao nhiêu?',
        option_a: '20-30 cm',
        option_b: '40-70 cm',
        option_c: '80-100 cm',
        option_d: '10-20 cm',
        correct_answer: 'b',
        explanation: 'Khoảng cách lý tưởng khi nhìn màn hình máy tính là 40-70 cm để giảm mỏi mắt.',
        category: 'Bảo vệ mắt',
        difficulty: 'easy',
        question_en: 'What is the safe distance when viewing a computer screen?',
        option_a_en: '20-30 cm',
        option_b_en: '40-70 cm',
        option_c_en: '80-100 cm',
        option_d_en: '10-20 cm',
        explanation_en: 'The ideal distance when viewing a computer screen is 40-70 cm to reduce eye strain.',
        category_en: 'Eye Protection'
      },
      {
        question: 'Quy tắc 20-20-20 trong chăm sóc mắt là gì?',
        option_a: 'Ngủ 20 tiếng, thức 20 tiếng, nghỉ 20 phút',
        option_b: 'Cứ 20 phút nhìn xa 20 feet (6m) trong 20 giây',
        option_c: 'Đo mắt 20 lần trong 20 ngày',
        option_d: 'Nhỏ mắt 20 giọt mỗi 20 phút',
        correct_answer: 'b',
        explanation: 'Quy tắc 20-20-20: Mỗi 20 phút làm việc với màn hình, hãy nhìn xa 20 feet (khoảng 6m) trong 20 giây.',
        category: 'Bảo vệ mắt',
        difficulty: 'easy',
        question_en: 'What is the 20-20-20 rule in eye care?',
        option_a_en: 'Sleep 20 hours, wake 20 hours, rest 20 minutes',
        option_b_en: 'Every 20 minutes look 20 feet away for 20 seconds',
        option_c_en: 'Check eyes 20 times in 20 days',
        option_d_en: 'Apply 20 eye drops every 20 minutes',
        explanation_en: 'The 20-20-20 rule: Every 20 minutes of screen work, look 20 feet (about 6m) away for 20 seconds.',
        category_en: 'Eye Protection'
      },
      {
        question: 'Bệnh Glaucoma (Cườm nước) ảnh hưởng chủ yếu đến bộ phận nào của mắt?',
        option_a: 'Giác mạc',
        option_b: 'Thủy tinh thể',
        option_c: 'Thần kinh thị giác',
        option_d: 'Võng mạc',
        correct_answer: 'c',
        explanation: 'Glaucoma gây tổn thương thần kinh thị giác, thường do tăng nhãn áp.',
        category: 'Bệnh về mắt',
        difficulty: 'medium',
        question_en: 'Glaucoma primarily affects which part of the eye?',
        option_a_en: 'Cornea',
        option_b_en: 'Lens',
        option_c_en: 'Optic nerve',
        option_d_en: 'Retina',
        explanation_en: 'Glaucoma damages the optic nerve, usually caused by increased intraocular pressure.',
        category_en: 'Eye Diseases'
      },
      {
        question: 'Vitamin nào quan trọng nhất cho sức khỏe mắt?',
        option_a: 'Vitamin C',
        option_b: 'Vitamin A',
        option_c: 'Vitamin D',
        option_d: 'Vitamin B12',
        correct_answer: 'b',
        explanation: 'Vitamin A rất quan trọng cho thị lực, đặc biệt giúp nhìn trong điều kiện ánh sáng yếu.',
        category: 'Dinh dưỡng',
        difficulty: 'easy',
        question_en: 'Which vitamin is most important for eye health?',
        option_a_en: 'Vitamin C',
        option_b_en: 'Vitamin A',
        option_c_en: 'Vitamin D',
        option_d_en: 'Vitamin B12',
        explanation_en: 'Vitamin A is crucial for vision, especially helping to see in low light conditions.',
        category_en: 'Nutrition'
      },
      {
        question: 'Đục thủy tinh thể thường gặp ở độ tuổi nào?',
        option_a: 'Dưới 20 tuổi',
        option_b: '20-40 tuổi',
        option_c: '40-60 tuổi',
        option_d: 'Trên 60 tuổi',
        correct_answer: 'd',
        explanation: 'Đục thủy tinh thể do lão hóa thường xuất hiện ở người trên 60 tuổi.',
        category: 'Bệnh về mắt',
        difficulty: 'easy',
        question_en: 'At what age are cataracts most common?',
        option_a_en: 'Under 20 years old',
        option_b_en: '20-40 years old',
        option_c_en: '40-60 years old',
        option_d_en: 'Over 60 years old',
        explanation_en: 'Age-related cataracts typically appear in people over 60 years old.',
        category_en: 'Eye Diseases'
      },
      {
        question: 'Phẫu thuật LASIK điều trị được những tật khúc xạ nào?',
        option_a: 'Chỉ cận thị',
        option_b: 'Cận thị và viễn thị',
        option_c: 'Cận thị, viễn thị và loạn thị',
        option_d: 'Chỉ loạn thị',
        correct_answer: 'c',
        explanation: 'LASIK có thể điều trị cả ba tật khúc xạ: cận thị, viễn thị và loạn thị.',
        category: 'Phẫu thuật',
        difficulty: 'medium',
        question_en: 'What refractive errors can LASIK surgery treat?',
        option_a_en: 'Myopia only',
        option_b_en: 'Myopia and hyperopia',
        option_c_en: 'Myopia, hyperopia, and astigmatism',
        option_d_en: 'Astigmatism only',
        explanation_en: 'LASIK can treat all three refractive errors: myopia, hyperopia, and astigmatism.',
        category_en: 'Surgery'
      },
      {
        question: 'Triệu chứng nào KHÔNG phải là dấu hiệu của khô mắt?',
        option_a: 'Cảm giác cộm, rát mắt',
        option_b: 'Mắt đỏ',
        option_c: 'Nhìn đôi',
        option_d: 'Chảy nước mắt phản xạ',
        correct_answer: 'c',
        explanation: 'Nhìn đôi thường liên quan đến vấn đề thần kinh hoặc cơ mắt, không phải triệu chứng của khô mắt.',
        category: 'Bệnh về mắt',
        difficulty: 'medium',
        question_en: 'Which symptom is NOT a sign of dry eye?',
        option_a_en: 'Gritty, burning sensation',
        option_b_en: 'Red eyes',
        option_c_en: 'Double vision',
        option_d_en: 'Reflex tearing',
        explanation_en: 'Double vision is usually related to nerve or eye muscle problems, not a symptom of dry eye.',
        category_en: 'Eye Diseases'
      },
      {
        question: 'Ánh sáng xanh từ màn hình điện tử có thể gây ra vấn đề gì?',
        option_a: 'Tăng nhãn áp',
        option_b: 'Mỏi mắt và rối loạn giấc ngủ',
        option_c: 'Đục thủy tinh thể',
        option_d: 'Loạn thị',
        correct_answer: 'b',
        explanation: 'Ánh sáng xanh có thể gây mỏi mắt kỹ thuật số và ảnh hưởng đến nhịp sinh học, gây rối loạn giấc ngủ.',
        category: 'Bảo vệ mắt',
        difficulty: 'easy',
        question_en: 'What problems can blue light from digital screens cause?',
        option_a_en: 'Increased eye pressure',
        option_b_en: 'Eye strain and sleep disruption',
        option_c_en: 'Cataracts',
        option_d_en: 'Astigmatism',
        explanation_en: 'Blue light can cause digital eye strain and affect circadian rhythms, leading to sleep disruption.',
        category_en: 'Eye Protection'
      },
      {
        question: 'Bệnh võng mạc tiểu đường có thể phòng ngừa bằng cách nào tốt nhất?',
        option_a: 'Đeo kính râm thường xuyên',
        option_b: 'Kiểm soát tốt đường huyết',
        option_c: 'Uống nhiều nước',
        option_d: 'Nhỏ mắt hàng ngày',
        correct_answer: 'b',
        explanation: 'Kiểm soát đường huyết ổn định là cách tốt nhất để phòng ngừa và làm chậm tiến triển bệnh võng mạc tiểu đường.',
        category: 'Bệnh về mắt',
        difficulty: 'medium',
        question_en: 'How can diabetic retinopathy be best prevented?',
        option_a_en: 'Wear sunglasses regularly',
        option_b_en: 'Good blood sugar control',
        option_c_en: 'Drink plenty of water',
        option_d_en: 'Use eye drops daily',
        explanation_en: 'Stable blood sugar control is the best way to prevent and slow the progression of diabetic retinopathy.',
        category_en: 'Eye Diseases'
      },
      {
        question: 'Trẻ em nên được khám mắt định kỳ từ độ tuổi nào?',
        option_a: '6 tháng tuổi',
        option_b: '3 tuổi',
        option_c: '6 tuổi',
        option_d: '10 tuổi',
        correct_answer: 'a',
        explanation: 'Trẻ nên được khám mắt lần đầu từ 6 tháng tuổi để phát hiện sớm các vấn đề về mắt.',
        category: 'Nhãn khoa nhi',
        difficulty: 'medium',
        question_en: 'At what age should children have regular eye exams?',
        option_a_en: '6 months old',
        option_b_en: '3 years old',
        option_c_en: '6 years old',
        option_d_en: '10 years old',
        explanation_en: 'Children should have their first eye exam at 6 months to detect early eye problems.',
        category_en: 'Pediatric Ophthalmology'
      }
    ];

    for (const q of questions) {
      await connection.query(
        `INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_answer, explanation, category, difficulty, is_active, question_en, option_a_en, option_b_en, option_c_en, option_d_en, explanation_en, category_en)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, ?, ?, ?, ?, ?, ?, ?)`,
        [q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_answer, q.explanation, q.category, q.difficulty, q.question_en, q.option_a_en, q.option_b_en, q.option_c_en, q.option_d_en, q.explanation_en, q.category_en]
      );
    }
    console.log('✅ Seeded 10 quiz questions');

    // Seed Articles
    const articles = [
      {
        title: 'Hướng dẫn bảo vệ mắt khi làm việc với máy tính',
        slug: 'bao-ve-mat-khi-lam-viec-voi-may-tinh',
        content: `<h2>Giới thiệu</h2>
<p>Trong thời đại số, việc làm việc với máy tính đã trở nên phổ biến. Tuy nhiên, điều này cũng đặt ra thách thức lớn cho sức khỏe đôi mắt của chúng ta.</p>

<h2>Quy tắc 20-20-20</h2>
<p>Cứ mỗi 20 phút làm việc với màn hình, hãy nhìn xa 20 feet (khoảng 6 mét) trong 20 giây. Đây là quy tắc đơn giản nhưng hiệu quả.</p>

<h2>Điều chỉnh màn hình</h2>
<ul>
<li>Đặt màn hình cách mắt 40-70 cm</li>
<li>Điều chỉnh độ sáng phù hợp với môi trường</li>
<li>Sử dụng chế độ lọc ánh sáng xanh</li>
</ul>

<h2>Chăm sóc mắt hàng ngày</h2>
<p>Ngoài việc tuân thủ quy tắc 20-20-20, bạn nên nhỏ mắt bằng nước mắt nhân tạo khi cần thiết và khám mắt định kỳ 6 tháng/lần.</p>`,
        excerpt: 'Tìm hiểu các phương pháp bảo vệ mắt hiệu quả khi làm việc với máy tính mỗi ngày.',
        category: 'Bảo vệ mắt',
        author_id: 1,
        is_published: true
      },
      {
        title: 'Tìm hiểu về phẫu thuật LASIK',
        slug: 'tim-hieu-ve-phau-thuat-lasik',
        content: `<h2>LASIK là gì?</h2>
<p>LASIK (Laser-Assisted In Situ Keratomileusis) là phương pháp phẫu thuật sử dụng tia laser để điều chỉnh hình dạng giác mạc, giúp điều trị các tật khúc xạ.</p>

<h2>Ai phù hợp với LASIK?</h2>
<ul>
<li>Người trên 18 tuổi</li>
<li>Độ cận, viễn, loạn ổn định trong 1-2 năm</li>
<li>Giác mạc đủ độ dày</li>
<li>Không có bệnh lý về mắt khác</li>
</ul>

<h2>Quy trình phẫu thuật</h2>
<p>Phẫu thuật LASIK chỉ mất khoảng 15-30 phút cho cả hai mắt và hầu như không đau.</p>`,
        excerpt: 'Tổng quan về phẫu thuật LASIK - phương pháp điều trị cận thị, viễn thị, loạn thị.',
        category: 'Phẫu thuật',
        author_id: 2,
        is_published: true
      },
      {
        title: 'Glaucoma - Kẻ trộm thị lực thầm lặng',
        slug: 'glaucoma-ke-trom-thi-luc-tham-lang',
        content: `<h2>Glaucoma là gì?</h2>
<p>Glaucoma (Cườm nước) là một nhóm bệnh gây tổn thương thần kinh thị giác, thường do tăng nhãn áp. Đây là nguyên nhân gây mù lòa hàng đầu trên thế giới.</p>

<h2>Triệu chứng</h2>
<p>Glaucoma thường không có triệu chứng rõ ràng ở giai đoạn đầu. Khi phát hiện, bệnh thường đã tiến triển.</p>

<h2>Phòng ngừa và điều trị</h2>
<ul>
<li>Khám mắt định kỳ, đặc biệt sau 40 tuổi</li>
<li>Đo nhãn áp thường xuyên</li>
<li>Tuân thủ điều trị theo chỉ định bác sĩ</li>
</ul>`,
        excerpt: 'Tìm hiểu về Glaucoma - căn bệnh có thể gây mất thị lực vĩnh viễn nếu không được phát hiện sớm.',
        category: 'Bệnh về mắt',
        author_id: 3,
        is_published: true
      }
    ];

    for (const article of articles) {
      await connection.query(
        `INSERT INTO articles (title, slug, content, excerpt, category, author_id, is_published, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [article.title, article.slug, article.content, article.excerpt, article.category, article.author_id, article.is_published]
      );
    }
    console.log('✅ Seeded 3 articles');

    // Generate time slots for next 14 days
    const [doctorRows] = await connection.query('SELECT id FROM doctors WHERE is_active = TRUE');
    const today = new Date();

    for (const doctor of doctorRows) {
      for (let day = 1; day <= 14; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() + day);
        
        // Skip Sundays
        if (date.getDay() === 0) continue;

        const slots = [
          { start: '08:00:00', end: '08:30:00' },
          { start: '08:30:00', end: '09:00:00' },
          { start: '09:00:00', end: '09:30:00' },
          { start: '09:30:00', end: '10:00:00' },
          { start: '10:00:00', end: '10:30:00' },
          { start: '10:30:00', end: '11:00:00' },
          { start: '14:00:00', end: '14:30:00' },
          { start: '14:30:00', end: '15:00:00' },
          { start: '15:00:00', end: '15:30:00' },
          { start: '15:30:00', end: '16:00:00' },
          { start: '16:00:00', end: '16:30:00' },
        ];

        for (const slot of slots) {
          await connection.query(
            `INSERT INTO time_slots (doctor_id, date, start_time, end_time, is_available)
             VALUES (?, ?, ?, ?, TRUE)
             ON DUPLICATE KEY UPDATE is_available = TRUE`,
            [doctor.id, date.toISOString().split('T')[0], slot.start, slot.end]
          );
        }
      }
    }
    console.log('✅ Generated time slots for 14 days');

    // Seed Podcasts with detailed script sections
    const podcasts = [
      {
        title: 'Dùng thuốc & vệ sinh mắt đúng cách',
        slug: 'dung-thuoc-ve-sinh-mat-dung-cach',
        description: 'Hướng dẫn chi tiết cách nhỏ thuốc và vệ sinh mắt an toàn sau phẫu thuật khúc xạ',
        audio_url: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762868105/1110_nru1wb.mp4',
        thumbnail_url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1762871747/z7213899486898_ffb7cd852297c45da38cac78d9e643fe_mznf6r.jpg',
        duration: '5:30',
        category: 'Hậu phẫu',
        transcript: JSON.stringify([
          { step: 1, title: 'Chào mừng đến với VISTA Podcast', content: 'Chào mừng bạn đến với VISTA Podcast – kênh chia sẻ kiến thức chăm sóc mắt sau phẫu thuật khúc xạ, được biên soạn cùng đội ngũ chuyên môn từ bệnh viện mắt Visi. Ở tập đầu tiên hôm nay, chúng ta sẽ cùng nhau tìm hiểu cách nhỏ thuốc và vệ sinh mắt đúng cách, để giúp mắt hồi phục nhanh và an toàn nhất.' },
          { step: 2, title: 'Rửa tay sạch trước khi chạm mắt', content: 'Trước hết, hãy luôn rửa tay thật sạch trước khi chạm vào mắt. Đây là bước quan trọng để tránh nhiễm trùng.' },
          { step: 3, title: 'Chuẩn bị và tư thế nhỏ thuốc', content: 'Lắc đều lọ thuốc nhỏ mắt, rồi nằm hoặc ngồi – hơi ngửa đầu ra sau để thuốc dễ dàng vào mắt hơn.' },
          { step: 4, title: 'Kỹ thuật nhỏ thuốc chính xác', content: 'Dùng tay kéo nhẹ mi dưới, nhỏ 1 đến 2 giọt thuốc, nhớ nhé – đừng nhỏ trực tiếp vào tròng đen. Sau đó, chớp mắt nhẹ nhàng để thuốc loang đều.' },
          { step: 5, title: 'Thứ tự sử dụng nhiều loại thuốc', content: 'Nếu đơn thuốc có nhiều loại, hãy nhỏ nước mắt nhân tạo trước, rồi mới đến thuốc kháng viêm. Nếu thấy đau, rát, hoặc cộm kéo dài, hãy gọi ngay hotline của bệnh viện nơi bạn phẫu thuật để được hỗ trợ.' },
          { step: 6, title: 'Vệ sinh mắt khi có ghèn', content: 'Khi mắt tiết nhiều ghèn, chỉ cần nhỏ nước muối sinh lý Natri Clorua, sau đó dùng gạc vô trùng để lau sạch – nhẹ nhàng thôi, không chà mạnh nhé.' },
          { step: 7, title: 'Lời kết & hẹn gặp lại', content: 'Vậy là bạn đã biết cách dùng thuốc và vệ sinh mắt an toàn sau phẫu thuật. Hãy nghe lại tập này nếu cần nhắc lại các bước, và luôn tuân thủ hướng dẫn của bác sĩ. Hẹn gặp bạn ở Tập 2!' }
        ])
      },
      {
        title: '4 điều tuyệt đối tránh sau phẫu thuật',
        slug: '4-dieu-tuyet-doi-tranh-sau-phau-thuat',
        description: 'Những hành động cần tránh tuyệt đối trong tuần đầu tiên sau phẫu thuật khúc xạ',
        audio_url: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762868105/1110_nru1wb.mp4',
        thumbnail_url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
        duration: '4:15',
        category: 'Hậu phẫu',
        transcript: JSON.stringify([
          { step: 1, title: 'Không chà xát mắt mạnh', content: 'Tuyệt đối không chà xát, day, hoặc ấn mạnh vào mắt trong vòng 1 tháng đầu. Hành động này có thể làm di lệch giác mạc và ảnh hưởng đến kết quả phẫu thuật.' },
          { step: 2, title: 'Tránh nước vào mắt', content: 'Không để nước bẩn, nước ao, hồ bơi tiếp xúc với mắt trong 2 tuần đầu. Khi tắm rửa, hãy che chắn cẩn thận để tránh nước và xà phòng.' },
          { step: 3, title: 'Hạn chế vận động mạnh', content: 'Tránh các hoạt động thể thao mạnh, nâng vật nặng trong 1 tháng đầu. Điều này giúp giác mạc có thời gian hồi phục ổn định.' },
          { step: 4, title: 'Không tự ý dừng thuốc', content: 'Luôn tuân thủ đầy đủ liệu trình thuốc theo chỉ định của bác sĩ. Không tự ý ngừng hoặc thay đổi liều lượng dù mắt đã cảm thấy tốt hơn.' }
        ])
      },
      {
        title: 'Chế độ dinh dưỡng cho mắt khỏe',
        slug: 'che-do-dinh-duong-cho-mat-khoe',
        description: 'Thực phẩm và chế độ ăn uống giúp mắt hồi phục nhanh sau phẫu thuật',
        audio_url: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762868105/1110_nru1wb.mp4',
        thumbnail_url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
        duration: '6:00',
        category: 'Dinh dưỡng',
        transcript: JSON.stringify([
          { step: 1, title: 'Thực phẩm giàu Vitamin A', content: 'Cà rốt, rau bina, khoai lang là những nguồn cung cấp Vitamin A tuyệt vời cho mắt. Vitamin A giúp tái tạo tế bào và cải thiện thị lực.' },
          { step: 2, title: 'Omega-3 từ cá biển', content: 'Cá hồi, cá thu, cá ngừ chứa nhiều Omega-3 giúp giảm viêm và hỗ trợ sức khỏe võng mạc.' },
          { step: 3, title: 'Trái cây họ cam quýt', content: 'Cam, chanh, bưởi giàu Vitamin C - chất chống oxi hóa mạnh mẽ, bảo vệ mắt khỏi tổn thương tự do.' },
          { step: 4, title: 'Rau xanh đậm màu', content: 'Rau cải xoăn, cải bó xôi chứa lutein và zeaxanthin - hai chất chống oxy hóa quan trọng bảo vệ võng mạc khỏi ánh sáng xanh.' }
        ])
      },
      {
        title: 'Bài tập thư giãn cho đôi mắt',
        slug: 'bai-tap-thu-gian-cho-doi-mat',
        description: 'Các bài tập giúp giảm mỏi mắt và tăng cường tuần hoàn máu vùng mắt',
        audio_url: 'https://res.cloudinary.com/dvucotc8z/video/upload/v1762868105/1110_nru1wb.mp4',
        thumbnail_url: 'https://res.cloudinary.com/dvucotc8z/image/upload/v1761409108/unnamed_1_g44gjc.jpg',
        duration: '5:45',
        category: 'Bài tập',
        transcript: JSON.stringify([
          { step: 1, title: 'Quy tắc 20-20-20', content: 'Cứ sau 20 phút làm việc với màn hình, hãy nhìn vật cách xa 20 feet (khoảng 6m) trong 20 giây để mắt được nghỉ ngơi và điều tiết.' },
          { step: 2, title: 'Bài tập chớp mắt', content: 'Chớp mắt nhanh 20 lần, sau đó nhắm mắt 20 giây. Lặp lại 3-5 lần. Bài tập này giúp bôi trơn mắt và giảm khô mắt.' },
          { step: 3, title: 'Xoa bóp huyệt đạo', content: 'Massage nhẹ nhàng các huyệt xung quanh mắt: thái dương, giữa hai lông mày, và dưới hốc mắt. Mỗi điểm massage 30 giây.' },
          { step: 4, title: 'Bài tập nhìn xa gần', content: 'Giơ ngón tay cách mắt 15cm, tập trung nhìn trong 5 giây. Sau đó nhìn vật xa 3-5m trong 5 giây. Lặp lại 10 lần.' }
        ])
      }
    ];

    for (const podcast of podcasts) {
      await connection.query(
        `INSERT INTO podcasts (title, slug, description, audio_url, thumbnail_url, duration, category, transcript, is_published, published_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, NOW())
         ON DUPLICATE KEY UPDATE title = VALUES(title)`,
        [podcast.title, podcast.slug, podcast.description, podcast.audio_url, podcast.thumbnail_url, podcast.duration, podcast.category, podcast.transcript]
      );
    }
    console.log('✅ Seeded 4 podcasts');

    // Seed Eye Care Tips
    const eyeCareTips = [
      {
        title: 'Quy tắc 20-20-20',
        description: 'Mỗi 20 phút nhìn màn hình, hãy nhìn xa 20 feet (6m) trong 20 giây để giảm mỏi mắt.',
        icon: '👁️',
        category: 'Bảo vệ mắt',
        display_order: 1
      },
      {
        title: 'Bảo vệ khỏi UV',
        description: 'Đeo kính râm có chống UV khi ra ngoài trời để bảo vệ mắt khỏi tia cực tím.',
        icon: '🕶️',
        category: 'Bảo vệ mắt',
        display_order: 2
      },
      {
        title: 'Dinh dưỡng cho mắt',
        description: 'Bổ sung vitamin A, omega-3 từ cá, rau xanh và trái cây màu cam, đỏ.',
        icon: '🥕',
        category: 'Dinh dưỡng',
        display_order: 3
      },
      {
        title: 'Khám mắt định kỳ',
        description: 'Khám mắt 6 tháng - 1 năm/lần để phát hiện sớm các vấn đề về mắt.',
        icon: '📋',
        category: 'Chăm sóc',
        display_order: 4
      },
      {
        title: 'Nghỉ ngơi đầy đủ',
        description: 'Ngủ đủ 7-8 tiếng mỗi đêm để mắt có thời gian phục hồi và tái tạo.',
        icon: '😴',
        category: 'Chăm sóc',
        display_order: 5
      },
      {
        title: 'Giữ ẩm cho mắt',
        description: 'Chớp mắt thường xuyên và sử dụng nước mắt nhân tạo khi cần thiết.',
        icon: '💧',
        category: 'Bảo vệ mắt',
        display_order: 6
      }
    ];

    for (const tip of eyeCareTips) {
      await connection.query(
        `INSERT INTO eye_care_tips (title, description, icon, category, display_order, is_active)
         VALUES (?, ?, ?, ?, ?, TRUE)`,
        [tip.title, tip.description, tip.icon, tip.category, tip.display_order]
      );
    }
    console.log('✅ Seeded 6 eye care tips');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log('   - 5 Doctors');
    console.log('   - 8 Services');
    console.log('   - 1 Sample User');
    console.log('   - 10 Quiz Questions');
    console.log('   - 3 Articles');
    console.log('   - 4 Podcasts');
    console.log('   - 6 Eye Care Tips');
    console.log('   - Time slots for 14 days');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

seed();
