# 🚀 Herman Kwayu - Portfolio & Consulting Website

> **Professional Business Consultant & Digital Transformation Specialist**  
> Comprehensive portfolio website showcasing 8+ years of expertise in business consulting, digital transformation, and strategic planning across Africa.

[![Deploy Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
[![SEO Score](https://img.shields.io/badge/SEO%20Score-92%25-brightgreen)](https://developers.google.com/speed/pagespeed/insights/)
[![Performance](https://img.shields.io/badge/Performance-Optimized-blue)](https://web.dev/measure/)
[![License](https://img.shields.io/badge/License-Private-red)](LICENSE)

## 🌟 Features

### Core Functionality
- **Modern Portfolio Design** - Clean, professional aesthetic with deep slate blue color scheme
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **SEO Optimized** - 92% SEO score with comprehensive meta tags and structured data
- **Performance Optimized** - Fast loading times with code splitting and lazy loading

### Key Sections
- **Hero Section** - Professional introduction with call-to-action
- **About** - Detailed professional background and expertise
- **Services** - Comprehensive consulting services offered
- **Portfolio** - Showcase of projects and achievements
- **Contact Form** - Integrated with Supabase for form submissions
- **Newsletter** - Email subscription with Resend API integration

### 🎯 Advanced Features
- **🔧 Resume Builder** - Free CV builder with 4 professional templates (PDF/DOCX export)
- **📊 Admin Dashboard** - Secure admin panel with session-based authentication (4-hour expiry)
- **📈 Analytics Integration** - Comprehensive performance and user analytics tracking
- **📧 Newsletter Management** - Complete email system with Resend API integration
- **🌙 Dark Mode Support** - Automatic dark/light theme switching
- **🔒 Privacy-First** - No data storage, secure authentication, GDPR compliant

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Supabase account
- Resend account (for email functionality)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/herman-kwayu-portfolio.git
   cd herman-kwayu-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your actual API keys and configuration
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_DB_URL=your_supabase_database_url

# Email Service
RESEND_API_KEY=your_resend_api_key

# Admin Configuration
ADMIN_SESSION_SECRET=your_secure_random_string

# Environment
NODE_ENV=development
VITE_APP_ENV=development
```

### Supabase Setup

1. Create a new Supabase project
2. The application will automatically create required tables
3. Deploy the edge function from `/supabase/functions/server/`
4. Configure authentication settings and allowed domains

## 📦 Deployment

### Option 1: Netlify (Recommended)

1. **Automated deployment script:**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

2. **Connect to Netlify:**
   - Push your code to GitHub/GitLab
   - Connect repository in Netlify dashboard
   - Configure environment variables
   - Deploy automatically

### Option 2: Vercel

1. **Push to Git repository**
2. **Connect to Vercel dashboard**
3. **Configure environment variables**
4. **Deploy automatically**

### Option 3: Manual Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder** to your hosting provider

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run validate` - Validate static files
- `npm run build:validate` - Validate and build
- `npm run deploy:prepare` - Prepare for deployment

### Project Structure

```
├── App.tsx                 # Main application component
├── components/             # React components
│   ├── ui/                # Shadcn/ui components
│   ├── resume/            # Resume builder components
│   └── figma/             # Figma integration components
├── styles/                # Global CSS and Tailwind config
├── utils/                 # Utility functions
├── supabase/              # Supabase configuration and functions
├── public/                # Static assets
└── scripts/               # Build and deployment scripts
```

### Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS v4, Shadcn/ui components
- **Backend:** Supabase (Database, Auth, Edge Functions)
- **Email:** Resend API
- **Deployment:** Netlify/Vercel
- **Analytics:** Custom analytics implementation

## 🎨 Customization

### Design System

The application uses a sophisticated design system based on:
- **Primary Color:** Deep slate blue (`oklch(0.25 0.08 250)`)
- **Typography:** Modern, clean fonts with proper hierarchy
- **Spacing:** Consistent spacing scale
- **Components:** Reusable Shadcn/ui components

### Adding New Sections

1. Create a new component in `/components/`
2. Import and add to `App.tsx`
3. Update navigation if needed
4. Add to SEO configuration

## 📊 Analytics & Performance

### Built-in Analytics
- Page views and user interactions
- Performance monitoring
- Error tracking
- Newsletter subscription tracking

### Performance Features
- Code splitting and lazy loading
- Image optimization
- SEO optimization (92% score)
- Lighthouse performance optimization

## 🔒 Security

### Security Features
- Session-based admin authentication
- Environment variable protection
- CSRF protection
- XSS prevention
- Secure headers configuration

### Admin Access
- Secure admin dashboard at `/admin`
- Session-based authentication with 4-hour expiry
- Comprehensive admin controls

## 📧 Contact & Support

**Herman Kwayu**
- Email: truthherman@gmail.com
- LinkedIn: [Herman Kwayu](https://linkedin.com/in/herman-kwayu)
- Website: [herman-kwayu.com](https://herman-kwayu.com)

## 📄 License

This project is privately owned by Herman Kwayu. All rights reserved.

## 🤝 Contributing

This is a personal portfolio project. However, if you notice any bugs or have suggestions, please feel free to:
1. Open an issue
2. Submit a pull request
3. Contact directly at truthherman@gmail.com

## 🙏 Acknowledgments

- Built with modern web technologies
- Deployed on reliable cloud infrastructure
- Designed for optimal user experience
- SEO optimized for maximum visibility

---

**Professional Business Consultant & Digital Transformation Specialist**
*Driving growth and innovation across Africa*