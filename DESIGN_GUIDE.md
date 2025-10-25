# Hướng Dẫn Sử Dụng Design Mới

## 🎨 Tính Năng Mới

### 1. **Bento Grid Layout**
- Grid ảnh/card có thể hover để mở rộng
- Tự động điều chỉnh kích thước theo content
- Hiệu ứng glow khi hover

### 2. **Auto-Scrolling Content**
- Journey section tự động scroll ngang
- Infinite loop animation
- Pause on hover (có thể thêm)

### 3. **Dark Theme**
- Phong cách developer-focused
- Gradient backgrounds
- Glass morphism effects

### 4. **Cloudinary Integration**
- Sẵn sàng để tích hợp ảnh/video từ Cloudinary
- Tối ưu hóa performance
- Lazy loading

## 🚀 Cách Chuyển Đổi

### Option 1: Thay Thế Hoàn Toàn

**Bước 1:** Backup file cũ
```powershell
Copy-Item src\App.jsx src\App-old.jsx
```

**Bước 2:** Đổi tên file mới
```powershell
Remove-Item src\App.jsx
Rename-Item src\App-modern.jsx App.jsx
```

**Bước 3:** Chạy dev server
```powershell
npm run dev
```

### Option 2: Giữ Cả 2 Version (Recommended)

**Bước 1:** Cập nhật `main.jsx` để dễ switch
```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Uncomment version bạn muốn sử dụng:
import App from './App-modern.jsx'  // Version mới (Dark theme)
// import App from './App.jsx'      // Version cũ (Light theme)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**Bước 2:** Comment/Uncomment để chuyển đổi

## 📝 Customization

### Thay Đổi Màu Sắc

Trong `App-modern.jsx`, tìm và thay đổi:

```jsx
// Primary color (Sky/Blue)
from-sky-500 to-blue-600

// Secondary color (Purple/Pink)
from-purple-500 to-pink-600

// Accent color
from-yellow-400 to-orange-600
```

### Thay Đổi Nội Dung

#### Hero Section:
```jsx
const HeroSection = () => {
  // Dòng 161-170: Thay đổi title
  // Dòng 178: Thay đổi description
  // Dòng 185-195: Thay đổi stats
}
```

#### Features (Bento Grid):
```jsx
const BentoGridSection = () => {
  const features = [
    {
      title: 'Tính năng mới',     // Tên tính năng
      description: 'Mô tả',        // Mô tả ngắn
      icon: '🎮',                  // Emoji icon
      image: 'cloudinary-path',    // Đường dẫn ảnh
      span: 2,                     // Chiều rộng (1-4)
      rowSpan: 2                   // Chiều cao (1-2)
    }
  ]
}
```

#### Journey Steps:
```jsx
const JourneySection = () => {
  const steps = [
    { icon: '📱', title: 'Bước 1', desc: 'Mô tả' },
    // Thêm hoặc sửa các bước...
  ]
}
```

#### Rewards:
```jsx
const RewardsSection = () => {
  const rewards = [
    { icon: '🎁', name: 'Tên quà', points: '500đ' },
    // Thêm hoặc sửa quà tặng...
  ]
}
```

### Thêm/Bớt Sections

Trong component `App`:

```jsx
function App() {
  return (
    <div className="bg-slate-900 text-white">
      <Header />
      <HeroSection />
      
      {/* Scrolling banner - Có thể xóa nếu không muốn */}
      <div className="bg-slate-950 border-y border-white/10">
        <ScrollingText items={['TEXT1', 'TEXT2', 'TEXT3']} />
      </div>
      
      <BentoGridSection />
      <JourneySection />
      <RewardsSection />
      
      {/* Thêm section mới ở đây */}
      
      <CTASection />
      <Footer />
    </div>
  )
}
```

## 🎯 Tích Hợp Cloudinary

Xem file `CLOUDINARY_SETUP.md` để biết chi tiết.

**Tóm tắt:**
1. Tạo tài khoản Cloudinary
2. Upload ảnh/video
3. Lấy Cloud Name
4. Cập nhật dòng 6 trong `App-modern.jsx`:
   ```javascript
   const CLOUDINARY_BASE = 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/'
   ```

## 🔧 Troubleshooting

### 1. Ảnh không hiện

**Nguyên nhân:** Cloud name sai hoặc path không đúng

**Giải pháp:**
- Kiểm tra Cloud Name trong Cloudinary Dashboard
- Kiểm tra path của ảnh (phải có `v` version prefix, vd: `v1234567890/image.jpg`)
- Mở DevTools Network tab để xem URL đầy đủ

### 2. Animation không chạy

**Nguyên nhân:** Framer Motion chưa được cài đặt

**Giải pháp:**
```powershell
npm install framer-motion
```

### 3. Scroll không smooth

**Nguyên nhân:** CSS scroll-behavior chưa được apply

**Giải pháp:** Đảm bảo `index.css` đã import đúng

### 4. Màu sắc không đúng

**Nguyên nhân:** Tailwind config hoặc dark mode

**Giải pháp:** Kiểm tra `tailwind.config.js`:
```js
module.exports = {
  darkMode: 'class', // hoặc 'media'
  // ...
}
```

## 📱 Responsive Testing

Test trên các breakpoints:
- Mobile: 375px (iPhone SE)
- Tablet: 768px (iPad)
- Desktop: 1280px
- Large: 1920px

## 🎨 Design Patterns Sử Dụng

1. **Bento Grid**: Asymmetric grid layout
2. **Glassmorphism**: Backdrop blur effects
3. **Gradient Text**: Background-clip text effects
4. **Floating Elements**: Absolute positioned animated orbs
5. **Auto-scroll**: Infinite marquee animation
6. **Hover States**: Scale, glow, transform effects

## 💡 Tips

1. **Performance**: Sử dụng `loading="lazy"` cho images
2. **Accessibility**: Thêm alt text cho tất cả images
3. **SEO**: Thêm meta tags trong `index.html`
4. **Analytics**: Tích hợp Google Analytics nếu cần
5. **Forms**: Kết nối với backend API (Google Apps Script đã setup sẵn)

## 📚 Next Steps

1. Upload ảnh lên Cloudinary
2. Thay thế demo images
3. Customize colors theo brand
4. Test responsive trên mobile
5. Deploy lên Vercel/Netlify
6. Setup domain custom
