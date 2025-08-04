# 📸 Vistagram

A modern, Instagram-inspired social media platform for sharing travel experiences and discovering amazing places around the world.

## 🌟 Features

- **📱 Modern UI/UX**: Clean, minimalistic design with smooth animations
- **📸 Photo Sharing**: Upload and share travel photos with captions
- **🔐 User Authentication**: Secure login and registration system
- **📱 Camera Integration**: Take photos directly from the browser
- **❤️ Social Features**: Like and share posts with other users
- **🌐 Public Sharing**: Share posts with unique public URLs
- **📱 Responsive Design**: Works perfectly on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript development
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Router** - Client-side routing
- **Axios** - HTTP client for API communication

### Backend
- **FastAPI** - Modern, fast web framework for building APIs with Python
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database for development
- **Redis** - In-memory data store for caching and session management
- **Pydantic** - Data validation using Python type annotations
- **JWT** - JSON Web Tokens for authentication
- **Pillow** - Python Imaging Library for image processing

### Development Tools
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatter
- **TypeScript** - Static type checking
- **Hot Reload** - Fast development with automatic reloading

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **Redis** (v6.0 or higher)
- **npm** or **yarn**

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Start Redis server:**
   ```bash
   redis-server
   ```

6. **Initialize database:**
   ```bash
   python seed_data.py
   ```

7. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
vistagram/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints
│   │   ├── core/          # Configuration and utilities
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── uploads/           # Image uploads
│   ├── requirements.txt   # Python dependencies
│   └── seed_data.py      # Database seeding
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── public/            # Static assets
│   └── package.json       # Node.js dependencies
└── README.md
```

## 🔧 Configuration

### Backend Environment Variables
```env
DATABASE_URL=sqlite:///./vistagram.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
UPLOAD_DIR=uploads
REDIS_URL=redis://localhost:6379
REDIS_DB=0
REDIS_PASSWORD=
```

### Frontend Configuration
The frontend is configured to connect to the backend API at `http://localhost:8000/api/v1`

## 📱 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Posts
- `GET /api/v1/posts/timeline` - Get timeline posts
- `POST /api/v1/posts/` - Create new post
- `POST /api/v1/posts/{post_id}/like` - Like/unlike post
- `POST /api/v1/posts/{post_id}/share` - Share post
- `GET /api/v1/posts/{post_id}/public` - Get public post

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (`from-blue-500 to-purple-600`)
- **Background**: Slate gradient (`from-slate-50 via-blue-50 to-indigo-50`)
- **Text**: Slate colors for hierarchy
- **Accents**: Red for likes, blue for shares

### Typography
- **Headings**: Bold, gradient text with proper hierarchy
- **Body**: Clean, readable fonts with good contrast
- **Buttons**: Rounded corners with hover effects

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover animations
- **Forms**: Clean inputs with focus states
- **Navigation**: Sticky header with backdrop blur

## 🚀 Deployment

### Backend Deployment
1. Set up a production server
2. Install Python and dependencies
3. Configure environment variables
4. Use Gunicorn with Uvicorn workers
5. Set up reverse proxy (Nginx)

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to static hosting (Vercel, Netlify, or AWS S3)
3. Configure environment variables for production API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request