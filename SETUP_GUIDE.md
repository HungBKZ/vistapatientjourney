# VISTA Eye Care - Hướng dẫn cài đặt

## Yêu cầu hệ thống
- Node.js 18+
- XAMPP (với MySQL)
- npm hoặc yarn

## Cấu trúc dự án

```
vistapatientjourney/
├── backend/          # API Server (Node.js + Express)
├── frontend/         # Web App (React + TypeScript)
└── SETUP_GUIDE.md
```

## Cài đặt và chạy

### 1. Khởi động MySQL (XAMPP)
- Mở XAMPP Control Panel
- Start MySQL service
- Database sẽ được tạo tự động khi chạy migration

### 2. Setup Backend

```bash
cd backend

# Cài đặt dependencies
npm install

# Tạo database và tables
npm run migrate

# Seed dữ liệu mẫu
npm run seed

# Chạy server
npm run dev
```

Backend sẽ chạy tại: `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend

# Cài đặt dependencies (nếu chưa)
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173`

## Cấu hình Database

File `.env` trong thư mục `backend`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=vista_eye_care
PORT=5000
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Doctors
- `GET /api/doctors` - Danh sách bác sĩ
- `GET /api/doctors/:id` - Chi tiết bác sĩ
- `GET /api/doctors/:id/slots?date=YYYY-MM-DD` - Lịch trống của bác sĩ

### Services
- `GET /api/services` - Danh sách dịch vụ
- `GET /api/services/:id` - Chi tiết dịch vụ

### Appointments
- `POST /api/appointments` - Tạo lịch hẹn
- `GET /api/appointments/my` - Lịch hẹn của user
- `PUT /api/appointments/:id/cancel` - Hủy lịch hẹn

### Articles
- `GET /api/articles` - Danh sách bài viết
- `GET /api/articles/:slug` - Chi tiết bài viết

### Quiz
- `GET /api/quiz/questions` - Lấy câu hỏi quiz
- `POST /api/quiz/check` - Kiểm tra đáp án

### Contact
- `POST /api/contact` - Gửi tin nhắn liên hệ

## Dữ liệu mẫu

Sau khi seed, database sẽ có:
- 5 Bác sĩ
- 8 Dịch vụ khám mắt
- 1 User test (email: test@vista.com, password: 123456)
- 10 Câu hỏi quiz
- 3 Bài viết kiến thức
- Time slots cho 14 ngày tới

## Công nghệ sử dụng

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM

### Backend
- Node.js + Express
- MySQL2
- JWT Authentication
- bcryptjs

## Cấu trúc thư mục

```
vistapatientjourney/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   └── UI/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── package.json
└── SETUP_GUIDE.md
```
