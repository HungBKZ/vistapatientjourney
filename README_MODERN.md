# 🎨 EyeCare Quizzle - Modern Landing Page

## ✨ Tính Năng Mới

### 🌙 Dark Theme Design
- **Developer-Focused**: Phong cách hiện đại, chuyên nghiệp
- **Glassmorphism**: Hiệu ứng kính mờ sang trọng
- **Gradient Accents**: Màu sắc gradient bắt mắt

### 🎯 Bento Grid Layout
- **Hover Expand**: Card tự động phóng to khi hover
- **Asymmetric Grid**: Layout bất đối xứng độc đáo
- **Responsive**: Tự động điều chỉnh trên mọi thiết bị

### 🎬 Auto-Scrolling Animations
- **Infinite Marquee**: Text/content tự động scroll
- **Smooth Transitions**: Chuyển động mượt mà
- **Journey Section**: Hiển thị hành trình người dùng

### 🖼️ Cloudinary Integration
- **Media Optimization**: Tối ưu ảnh/video tự động
- **Lazy Loading**: Load ảnh khi cần thiết
- **Transformations**: Resize, crop, format tự động

## 🚀 Quick Start

### 1. Xem Demo

```bash
npm run dev
```

Mở http://localhost:5173

### 2. Switch Between Designs

Mở `src/main.jsx` và comment/uncomment:

```jsx
// Light theme (Original)
// import App from './App.jsx'

// Dark theme (Modern)
import App from './App-modern.jsx'
```

### 3. Customize

Xem các file hướng dẫn:
- **DESIGN_GUIDE.md** - Hướng dẫn tổng quan
- **BENTO_GRID_GUIDE.md** - Custom Bento Grid
- **CLOUDINARY_SETUP.md** - Tích hợp Cloudinary

## 📂 Cấu Trúc Project

```
eye-care-landing/
├── src/
│   ├── App.jsx              # ☀️ Light theme (Original)
│   ├── App-modern.jsx       # 🌙 Dark theme (NEW)
│   ├── main.jsx             # Entry point (switch designs here)
│   └── index.css            # Global styles
├── DESIGN_GUIDE.md          # 📚 Hướng dẫn design
├── BENTO_GRID_GUIDE.md      # 🎨 Hướng dẫn Bento Grid
├── CLOUDINARY_SETUP.md      # 🖼️ Hướng dẫn Cloudinary
└── README_MODERN.md         # 📖 File này
```

## 🎨 Customization Examples

### Thay Đổi Màu Chủ Đạo

```jsx
// Tìm trong App-modern.jsx và thay thế:

// Sky/Blue → Purple/Pink
from-sky-500 to-blue-600
↓
from-purple-500 to-pink-600

// Sky/Blue → Green/Teal
from-sky-500 to-blue-600
↓
from-green-500 to-teal-600
```

### Thêm Feature Card Mới

```jsx
const features = [
  // ... existing features
  {
    title: 'Tính Năng Mới',
    description: 'Mô tả ngắn gọn',
    icon: '✨',
    image: 'v1234567890/new-feature.jpg',
    span: 2,      // Chiều rộng (1-4)
    rowSpan: 1    // Chiều cao (1-2+)
  }
]
```

### Thay Đổi Hero Title

```jsx
// Dòng ~161-170 trong HeroSection
<h1>
  <span className="...">
    Tiêu Đề Mới Của Bạn
  </span>
  <br />
  <span className="...">
    Dòng Thứ Hai
  </span>
</h1>
```

## 🖼️ Tích Hợp Cloudinary

### Bước 1: Tạo Tài Khoản

1. Truy cập https://cloudinary.com
2. Đăng ký free tier
3. Lấy **Cloud Name** từ Dashboard

### Bước 2: Upload Media

- Vào Media Library
- Upload ảnh/video
- Copy path (ví dụ: `v1234567890/quiz-demo.jpg`)

### Bước 3: Cấu Hình

Trong `App-modern.jsx`, dòng 6:

```javascript
const CLOUDINARY_BASE = 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/'
```

Thay `YOUR_CLOUD_NAME` bằng cloud name của bạn.

### Bước 4: Sử Dụng

```jsx
<img 
  src={`${CLOUDINARY_BASE}w_800,q_auto,f_auto/v1234567890/quiz-demo.jpg`}
  alt="Quiz Demo"
  loading="lazy"
/>
```

Chi tiết: Xem `CLOUDINARY_SETUP.md`

## 🎯 Sections Giải Thích

### 1. Hero Section
- **Title**: Tiêu đề chính với gradient text
- **Stats**: 4 chỉ số nổi bật (1000+ quiz, 50+ videos, etc.)
- **CTA Buttons**: 2 nút hành động chính
- **Animated Background**: Gradient orbs di chuyển

### 2. Scrolling Banner
- **Auto-scroll**: Text tự động chạy ngang
- **Infinite Loop**: Lặp vô hạn
- **Customizable**: Thay đổi items array

### 3. Bento Grid Features
- **6 Cards**: 6 tính năng chính
- **Hover Expand**: Card phóng to + glow effect
- **Mixed Sizes**: Kích thước khác nhau tạo visual hierarchy

### 4. Journey Section
- **Auto-scroll Cards**: 6 bước tự động scroll ngang
- **Infinite Loop**: Duplicate items để seamless loop
- **Pause on Hover**: (Có thể thêm nếu muốn)

### 5. Rewards Grid
- **5 Rewards**: Grid 5 phần quà
- **Hover Rotate**: Xoay nhẹ + scale khi hover
- **Point Values**: Hiển thị giá trị điểm

### 6. CTA Form
- **3 Fields**: Name, Email, Phone
- **Gradient Button**: Nút submit với gradient
- **Success Message**: Thông báo khi gửi thành công

### 7. Footer
- **4 Columns**: Logo, Features, Support, Social
- **Social Icons**: 4 icon mạng xã hội
- **Copyright**: Thông tin bản quyền

## 🔧 Advanced Customization

### Custom Bento Layout

Xem `BENTO_GRID_GUIDE.md` để học cách:
- Tạo asymmetric layouts
- Custom hover effects
- Responsive breakpoints
- Animation sequences

### Thêm Sections Mới

```jsx
// Trong App() component
function App() {
  return (
    <div className="bg-slate-900 text-white">
      {/* ... existing sections */}
      
      {/* Thêm section mới ở đây */}
      <MyNewSection />
      
      <CTASection />
      <Footer />
    </div>
  )
}
```

### Custom Animations

```jsx
// Parallax effect
const { scrollY } = useScroll()
const y = useTransform(scrollY, [0, 1000], [0, -200])

<motion.div style={{ y }}>
  {/* Content di chuyển theo scroll */}
</motion.div>
```

## 📱 Responsive Testing

Test trên các kích thước:

```bash
# Mobile
375px x 667px (iPhone SE)
414px x 896px (iPhone 11 Pro Max)

# Tablet
768px x 1024px (iPad)
834px x 1194px (iPad Pro 11")

# Desktop
1280px x 720px (Laptop)
1920px x 1080px (Desktop)
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Build
npm run build

# Drag & drop folder `dist` vào Netlify
```

### Environment Variables

Nếu dùng env vars:

```bash
# .env.local
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_RECAPTCHA_SITE_KEY=your_site_key
VITE_APPS_SCRIPT_URL=your_script_url
```

## 🎓 Learning Resources

### Framer Motion
- Docs: https://www.framer.com/motion/
- Examples: https://www.framer.com/motion/examples/

### Tailwind CSS
- Docs: https://tailwindcss.com/docs
- Play: https://play.tailwindcss.com/

### Cloudinary
- Docs: https://cloudinary.com/documentation
- Transformations: https://cloudinary.com/documentation/image_transformations

## 🐛 Troubleshooting

### Ảnh không load
- Check Cloud Name trong Cloudinary
- Verify image path (phải có `v` prefix)
- Check Network tab trong DevTools

### Animations không hoạt động
- Đảm bảo đã cài `framer-motion`
- Check console errors
- Verify import statements

### Layout bị vỡ
- Test ở các breakpoints khác nhau
- Check grid configuration
- Verify responsive classes

## 💡 Tips & Best Practices

1. **Performance**
   - Sử dụng `loading="lazy"` cho images
   - Optimize Cloudinary transformations
   - Minimize bundle size

2. **Accessibility**
   - Alt text cho tất cả images
   - Keyboard navigation
   - ARIA labels

3. **SEO**
   - Meta tags trong `index.html`
   - Semantic HTML
   - Fast loading speed

4. **Code Quality**
   - Component modularity
   - Consistent naming
   - Comment complex logic

## 📞 Support

Nếu gặp vấn đề:
1. Check các file GUIDE trong project
2. Review code examples
3. Test trong clean environment
4. Check browser console

## 🎉 What's Next?

- [ ] Upload ảnh thật lên Cloudinary
- [ ] Customize colors theo brand
- [ ] Add real content
- [ ] Test responsive thoroughly
- [ ] Connect form backend
- [ ] Deploy to production
- [ ] Setup analytics
- [ ] Add SEO meta tags

---

Made with 💙 by EyeCare Quizzle Team
