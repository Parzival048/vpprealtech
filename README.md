# VPP Realtech - Real Estate Platform

A modern, full-stack real estate platform built with React, Vite, and Supabase.

## 🚀 Tech Stack

- **Frontend:** React 19 + Vite
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** Vanilla CSS with CSS Variables
- **Routing:** React Router v7
- **Deployment:** Vercel (optimized for production)

## ✨ Features

### Public Features
- 🏠 **Projects Showcase** - Browse verified real estate projects
- 📝 **Blog** - Real estate insights and updates
- 📞 **Contact Forms** - Lead generation with WhatsApp integration
- 🔍 **Advanced Filtering** - Search by location, type, budget, status
- 📱 **Responsive Design** - Mobile-first approach

### Admin Features
- 🔐 **Secure Authentication** - Supabase Auth
- 📊 **Dashboard** - Overview of leads and content
- 🏗️ **Project Management** - CRUD operations for projects
- ✍️ **Blog Management** - Create and publish articles
- 📸 **Image Upload** - Direct upload to Supabase Storage
- 📋 **Lead Management** - Track and manage inquiries

## 🛠️ Local Development

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier)

### Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd vpprealtech-main
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Variables**
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=https://njabyfufktvmvrkusegl.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_WHATSAPP_NUMBER=919876543210
```

4. **Set up Supabase**
- Run the SQL schema: `supabase-schema.sql` in Supabase SQL Editor
- Create storage bucket named `images` (public)
- Create admin user in Supabase Auth

5. **Start development server**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Admin Access
- URL: `/admin`
- Default credentials: (create via Supabase dashboard)
  - Email: `shreyashvpp@gmail.com`
  - Password: `Admin@123`

## 📦 Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

## 🚢 Deployment

### Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click the button above or visit [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables (see `VERCEL_ENV.md`)
4. Deploy!

**Detailed instructions:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📁 Project Structure

```
vpprealtech-main/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, logos
│   ├── components/      # Reusable components
│   │   ├── layout/      # Header, Footer
│   │   └── ui/          # Buttons, Cards, Forms
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route pages
│   │   ├── admin/       # Admin dashboard pages
│   │   └── ...          # Public pages
│   ├── services/        # API integrations
│   │   ├── supabase.js  # Supabase client
│   │   ├── auth.js      # Authentication
│   │   ├── projects.js  # Projects CRUD
│   │   ├── blogs.js     # Blogs CRUD
│   │   └── leads.js     # Leads management
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── supabase-schema.sql  # Database schema
├── vercel.json          # Vercel configuration
├── .env.example         # Environment template
└── package.json         # Dependencies
```

## 🗄️ Database Schema

Tables:
- `projects` - Real estate projects
- `blogs` - Blog posts
- `leads` - Customer inquiries
- `contacts` - Contact form submissions

Storage Buckets:
- `images` - Project and blog images

See `supabase-schema.sql` for complete schema.

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Public read access for published content
- Authenticated write access for admins
- Environment variables for sensitive data
- Image uploads restricted by policies

## 🎨 Design System

- **Primary Color:** Orange (#FF6B35)
- **Dark Accent:** Navy (#1A1A2E, #16213E)
- **Typography:** System fonts with premium feel
- **Components:** Modern, glassmorphic design
- **Animations:** Smooth transitions and reveals

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🐛 Troubleshooting

### Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Working
- Ensure variables start with `VITE_`
- Restart dev server after changes
- Check Vercel dashboard for production

### Supabase Connection Issues
- Verify URL and anon key
- Check RLS policies
- Ensure storage bucket is public

## 📄 License

Private project - All rights reserved

## 👥 Contact

- **Website:** [Your deployed URL]
- **Email:** info@vpprealtech.com
- **WhatsApp:** +91 98765 43210

---

**Built with ❤️ using React + Vite + Supabase**
