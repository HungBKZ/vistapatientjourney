# Hướng Dẫn Tích Hợp Cloudinary

## 1. Tạo Tài Khoản Cloudinary

1. Truy cập: https://cloudinary.com/users/register/free
2. Đăng ký tài khoản miễn phí
3. Lấy **Cloud Name** từ Dashboard

## 2. Upload Ảnh/Video

### Cách 1: Upload qua Dashboard
1. Vào Media Library
2. Click "Upload"
3. Chọn files
4. Copy URL path (ví dụ: `v1234567890/quiz-demo.jpg`)

### Cách 2: Upload qua API (Node.js)
```javascript
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: 'YOUR_CLOUD_NAME',
  api_key: 'YOUR_API_KEY',
  api_secret: 'YOUR_API_SECRET'
})

// Upload
cloudinary.uploader.upload('path/to/image.jpg', {
  folder: 'eyecare-quizzle',
  transformation: [
    { width: 800, crop: 'scale' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ]
})
```

## 3. Cấu Hình trong App

### Bước 1: Cập nhật Cloud Name
Trong `src/App-modern.jsx`, dòng 6:

```javascript
const CLOUDINARY_BASE = 'https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/'
```

Thay `YOUR_CLOUD_NAME` bằng cloud name của bạn.

### Bước 2: Sử dụng trong Components

#### Ảnh thường:
```jsx
<img 
  src={`${CLOUDINARY_BASE}v1234567890/quiz-demo.jpg`}
  alt="Quiz Demo"
/>
```

#### Ảnh với transformations:
```jsx
<img 
  src={`${CLOUDINARY_BASE}w_800,c_scale,q_auto,f_auto/v1234567890/quiz-demo.jpg`}
  alt="Quiz Demo"
/>
```

#### Video:
```jsx
<video 
  src={`https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1234567890/demo-video.mp4`}
  autoPlay
  muted
  loop
/>
```

## 4. Danh Sách Media Cần Chuẩn Bị

### Features Section (Bento Grid):
- `quiz-demo.jpg` - Screenshot quiz interface (800x600px)
- `podcast.jpg` - Podcast cover art (400x400px)
- `video.jpg` - Video thumbnail (800x450px)
- `studio-360.jpg` - Studio 360° preview (800x400px)

### Hero Section (Optional):
- `hero-background.jpg` - Background image (1920x1080px)
- `hero-phone-mockup.png` - Phone mockup with app (500x1000px)

### Rewards Section (Optional):
- `reward-voucher.png` - Voucher icon
- `reward-glasses.png` - Glasses icon
- etc.

## 5. Tối Ưu Hóa

### Recommended Transformations:
```
w_800,c_scale,q_auto,f_auto
```

- `w_800` - Width 800px
- `c_scale` - Scale crop
- `q_auto` - Auto quality
- `f_auto` - Auto format (WebP cho browsers hỗ trợ)

### Lazy Loading:
```jsx
<img 
  src={`${CLOUDINARY_BASE}...`}
  loading="lazy"
  alt="..."
/>
```

## 6. Environment Variables (Optional)

Tạo `.env.local`:
```bash
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
```

Sử dụng:
```javascript
const CLOUDINARY_BASE = `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/`
```

## 7. Testing

1. Upload 1 ảnh test
2. Lấy URL path
3. Thay vào component
4. Kiểm tra trong browser
5. Kiểm tra Network tab để đảm bảo ảnh load đúng

## Ví Dụ Hoàn Chỉnh

```jsx
const BentoCard = ({ image }) => (
  <div className="relative">
    {image && (
      <img 
        src={`https://res.cloudinary.com/demo/image/upload/w_800,c_scale,q_auto,f_auto/${image}`}
        alt="Feature"
        loading="lazy"
        className="w-full h-full object-cover"
      />
    )}
  </div>
)

// Usage
<BentoCard image="v1234567890/quiz-demo.jpg" />
```
