# MoneyCare - Ứng dụng Quản lý Tài chính Cá nhân

MoneyCare là một ứng dụng React Native Expo được xây dựng để giúp người dùng quản lý tài chính cá nhân một cách thông minh và hiệu quả.

## 🚀 Tính năng chính

- **Quản lý Giao dịch**: Theo dõi thu nhập, chi tiêu và chuyển tiền
- **Ngân sách Thông minh**: Tạo và theo dõi ngân sách theo danh mục
- **Phân tích Chi tiết**: Biểu đồ và báo cáo tài chính trực quan
- **Đa tài khoản**: Quản lý nhiều tài khoản ngân hàng, ví điện tử
- **Bảo mật Cao**: Xác thực sinh trắc học và mã hóa dữ liệu
- **Giao diện Hiện đại**: Dark/Light mode, responsive design

## 🏗️ Kiến trúc Dự án

```
src/
├── components/          # Các component tái sử dụng
│   ├── common/         # Component cơ bản (Button, Input, Card...)
│   ├── forms/          # Component form chuyên biệt
│   └── charts/         # Component biểu đồ
├── screens/            # Các màn hình ứng dụng
│   ├── auth/          # Màn hình xác thực
│   └── main/          # Màn hình chính
├── navigation/         # Cấu hình điều hướng
├── services/          # API services và HTTP client
│   ├── api/          # REST API services
│   └── auth/         # Authentication services
├── store/             # Redux store và state management
│   └── slices/       # Redux slices
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
├── constants/         # Hằng số, theme, colors
├── types/             # TypeScript type definitions
├── assets/            # Hình ảnh, icon, font
│   ├── images/
│   ├── icons/
│   └── fonts/
├── config/            # Cấu hình ứng dụng
└── contexts/          # React contexts
```

## 🛠️ Công nghệ sử dụng

### Core Technologies

- **React Native**: Framework phát triển mobile
- **Expo**: Platform và toolchain
- **TypeScript**: Type safety và developer experience

### State Management

- **Redux Toolkit**: Quản lý state toàn cục
- **Redux Persist**: Lưu trữ state bền vững
- **React Redux**: Kết nối React với Redux

### Navigation

- **React Navigation v6**: Điều hướng ứng dụng
- **Stack Navigator**: Điều hướng stack
- **Bottom Tab Navigator**: Tab navigation
- **Drawer Navigator**: Side menu navigation

### UI/UX

- **React Native Reanimated**: Animation mượt mà
- **React Native Gesture Handler**: Xử lý cử chỉ
- **Expo Vector Icons**: Icon library
- **React Native SVG**: Hỗ trợ SVG
- **Expo Linear Gradient**: Gradient effects

### Forms & Validation

- **React Hook Form**: Quản lý form hiệu quả
- **Yup**: Schema validation
- **@hookform/resolvers**: Tích hợp validation

### Data & Storage

- **Axios**: HTTP client
- **AsyncStorage**: Local storage
- **Expo SecureStore**: Secure storage
- **React Native Chart Kit**: Biểu đồ và charts

### Development Tools

- **Babel**: JavaScript compiler
- **Module Resolver**: Import path mapping
- **ESLint**: Code linting
- **Prettier**: Code formatting

## 📱 Cài đặt và Chạy

### Yêu cầu hệ thống

- Node.js >= 18.0.0
- npm hoặc yarn
- Expo CLI
- Android Studio (cho Android)
- Xcode (cho iOS - chỉ trên macOS)

### Cài đặt dependencies

```bash
npm install
```

### Chạy ứng dụng

```bash
# Chạy trên tất cả platform
npm start

# Chạy trên Android
npm run android

# Chạy trên iOS
npm run ios

# Chạy trên web
npm run web
```

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env` trong thư mục root:

```env
API_BASE_URL=https://api.moneycare.com
GOOGLE_CLIENT_ID=your_google_client_id
FACEBOOK_APP_ID=your_facebook_app_id
```

### API Configuration

Cấu hình API endpoint trong `src/config/api.ts`:

```typescript
export const API_BASE_URL = __DEV__
  ? "http://localhost:3000/api"
  : "https://api.moneycare.com";
```

## 📊 State Management

Ứng dụng sử dụng Redux Toolkit với các slice sau:

- **authSlice**: Quản lý xác thực người dùng
- **transactionSlice**: Quản lý giao dịch
- **budgetSlice**: Quản lý ngân sách
- **accountSlice**: Quản lý tài khoản
- **categorySlice**: Quản lý danh mục
- **settingsSlice**: Cài đặt ứng dụng
- **uiSlice**: Trạng thái UI

## 🎨 Theming

Ứng dụng hỗ trợ Light/Dark theme với hệ thống màu sắc nhất quán:

```typescript
// Light Theme
const LIGHT_THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  // ...
};

// Dark Theme
const DARK_THEME = {
  colors: DARK_COLORS,
  // ...
};
```

## 🔐 Bảo mật

- **JWT Authentication**: Xác thực bằng JSON Web Token
- **Secure Storage**: Lưu trữ token an toàn
- **Biometric Authentication**: Xác thực sinh trắc học
- **API Encryption**: Mã hóa dữ liệu API

## 📱 Responsive Design

Ứng dụng được thiết kế responsive cho:

- Điện thoại (iOS/Android)
- Tablet
- Web browser

## 🧪 Testing

```bash
# Chạy tests
npm test

# Test coverage
npm run test:coverage
```

## 📦 Build Production

```bash
# Build cho Android
expo build:android

# Build cho iOS
expo build:ios

# Build cho Web
expo build:web
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👥 Team

- **Frontend Developer**: React Native, TypeScript
- **Backend Developer**: Node.js, Express, MongoDB
- **UI/UX Designer**: Figma, Adobe XD
- **DevOps Engineer**: AWS, Docker, CI/CD

## 📞 Liên hệ

- Email: support@moneycare.com
- Website: https://moneycare.com
- GitHub: https://github.com/moneycare/app

---

Made with ❤️ by MoneyCare Team
