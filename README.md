# MedScan.AI

A modern React application with AI-powered image analysis capabilities, featuring authentication, camera capture, and image upload functionality.

## 🚀 Features

- **User Authentication** - Login/Signup with JWT tokens
- **Camera Integration** - Real-time camera capture
- **Image Upload** - Drag & drop file upload
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Modern UI** - Beautiful glass morphism effects and smooth animations

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

## 🛠️ Installation & Setup

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd medscanai
```

### 2. Install Dependencies
```bash
# Install all required dependencies
npm install

# Install React Router DOM for navigation
npm install react-router-dom

# Optional: Install icons library for enhanced UI
npm install lucide-react
```

### 3. Project Structure
```
my-app/
├── public/
│   ├── vite.svg
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── components/
│   │   ├── common/
│   │   ├── auth/
│   │   └── camera/
│   ├── pages/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   └── styles/
├── package.json
└── tailwind.config.js
```

### 4. Start Development Server
```bash
# Start the development server
npm run dev
```

The application will open at `http://localhost:5173`

## 📦 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## 🎨 Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Icons**: Lucide React (optional)

## 🔧 Dependencies

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0"
}
```

### Development Dependencies
```json
{
  "@vitejs/plugin-react": "^3.1.0",
  "autoprefixer": "^10.4.0",
  "postcss": "^8.4.0",
  "tailwindcss": "^3.2.0",
  "vite": "^4.1.0"
}
```

### Optional Dependencies
```json
{
  "lucide-react": "^0.263.1"
}
```

## 🗂️ Project Architecture

### Key Components
- **Header**: Responsive navigation with centered buttons
- **Auth Forms**: Login and Signup with validation
- **Camera Preview**: Real-time camera capture
- **Image Upload**: Drag & drop file upload
- **Results Page**: Display AI analysis results

### Context & Hooks
- **AuthContext**: Manages user authentication state
- **useCamera**: Camera functionality hook
- **useApi**: API call management hook

## 🎯 Pages Overview

1. **Home** (`/`) - Landing page with feature overview
2. **Login** (`/login`) - User authentication
3. **Signup** (`/signup`) - User registration
4. **Dashboard** (`/dashboard`) - User dashboard (after login)
5. **Camera** (`/camera`) - Image capture and upload
6. **Results** (`/results`) - AI analysis results

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px (hamburger menu)
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+ (full navigation)

## 🔒 Authentication Flow

1. **Signup**: Create new account → Redirect to Dashboard
2. **Login**: Authenticate user → Redirect to Dashboard
3. **Logout**: Clear tokens → Redirect to Home
4. **Persistent Login**: Automatically login if token exists

## 📸 Camera & Image Features

- **Camera Access**: Real-time video capture
- **Image Capture**: Take photos using device camera
- **File Upload**: Support for JPG, PNG, WebP formats
- **Drag & Drop**: Intuitive file upload interface

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

The `dist/` folder contains the optimized production build ready for deployment.

## 🌐 Environment Setup

Create a `.env` file for environment variables (when backend is ready):
```env
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_NAME=MedScan.AI
```

## 🔄 Integration Points

### Backend API (Future)
- Authentication endpoints (`/api/auth/login`, `/api/auth/signup`)
- Image analysis endpoints (`/api/analyze`)
- User management endpoints

### ML Model Integration
- Image preprocessing
- Model inference calls
- Result formatting and display

## 🐛 Troubleshooting

### Common Issues

1. **Camera not working**
   - Ensure HTTPS in production
   - Check browser permissions
   - Verify camera availability

2. **Build errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version: `node --version`

3. **Styling issues**
   - Restart dev server after Tailwind config changes
   - Check Tailwind classes for typos

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request


## 📞 Support

For support and questions:
- Create an issue in the repository
- Check documentation in `/docs` folder
- Review component comments for implementation details

---

**Happy Coding!** 🎉
