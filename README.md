# Nexboard

A production-ready, full-stack task management and project operations platform built with Next.js 16, React 19, and Supabase. Multi-tenant SaaS with real-time collaboration, time tracking, automations, and comprehensive analytics.

**Status**: ✅ Production Ready | **Security**: ✅ Hardened | **Multi-Tenant**: ✅ Complete

## ✨ Features

### Core Functionality
- **Task Management** - Create, assign, and track tasks with priorities, due dates, and status updates
- **Kanban Board** - Visual project management with drag-and-drop functionality
- **Real-time Collaboration** - Live updates across all connected users via Supabase Realtime
- **Multi-Tenant Organizations** - Complete org management with invites and role-based access
- **Comments System** - Integrated task comments with real-time updates
- **File Attachments** - Secure upload and management of task-related documents

### SaaS Features
- **Time Tracking** - Built-in time logging and productivity monitoring
- **Automations** - Workflow automation with triggers and actions
- **Saved Filters** - Custom filter presets for quick access
- **Notifications** - Real-time in-app notifications for task updates
- **Projects** - Organize tasks into projects with color coding
- **Analytics Dashboard** - Comprehensive metrics and team performance insights

### Security & Performance
- **Row Level Security** - Database-level access control with Supabase RLS
- **Rate Limiting** - API protection with configurable limits per endpoint
- **Input Sanitization** - XSS prevention using DOMPurify on all user inputs
- **Plan Enforcement** - Usage limits based on subscription tier (free/professional/enterprise)
- **Mobile Responsive** - Optimized for desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/nexboard.git
   cd nexboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn (optional)
   ```

4. **Database setup**
   
   See [sql/README.md](sql/README.md) for complete migration order. Quick start:
   ```sql
   -- Run these in order in your Supabase SQL Editor:
   1. sql/complete_profiles_setup.sql
   2. sql/performance_indexes.sql
   3. sql/comments_system.sql
   4. sql/attachments_system.sql
   5. sql/secure_api_keys.sql
   6. sql/multi_tenancy.sql
   7. sql/add_invite_status.sql
   8. sql/fix_org_rls_final.sql
   9. sql/org_scoped_tables.sql
   10. sql/complete_saas_features.sql
   11. sql/fix_function_search_path.sql
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
nexboard/
├── app/                    # Next.js App Router
│   ├── (app)/             # Protected app routes
│   │   ├── dashboard/     # Main dashboard with Kanban board
│   │   ├── admin/         # Admin panel for user management
│   │   ├── analytics/     # Analytics and reporting
│   │   └── profile/       # User profiles and settings
│   ├── api/               # API routes with rate limiting
│   ├── login/             # Authentication pages
│   └── invite/            # Organization invite acceptance
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── ui/                # Reusable UI components
│   └── *.jsx              # Feature components (filters, time tracker, etc.)
├── lib/                   # Utility functions and server actions
│   ├── tasks.js           # Task CRUD operations
│   ├── organizations.js   # Org management
│   ├── planEnforcement.js # Usage limits
│   └── *.js               # Other utilities
├── sql/                   # Database schema and migrations
└── public/                # Static assets
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router and Server Actions
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **React Hot Toast** - Toast notification system

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data synchronization
- **Service Role Key** - Admin operations for user management

### Security & Monitoring
- **Sentry** - Production error tracking (optional)
- **DOMPurify** - XSS prevention and input sanitization
- **Rate Limiting** - Per-IP request throttling on API routes
- **Vercel Analytics** - Real-time performance and user analytics

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server (localhost:3000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

### Key Development Files
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint rules

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SENTRY_DSN` (optional)
3. Deploy automatically on push to main branch

### Production Checklist
- ✅ Environment variables configured
- ✅ Database migrations applied (see sql/README.md)
- ✅ Email provider configured for invites (Resend/SMTP)
- ✅ Sentry DSN configured (if using error tracking)
- ✅ Rate limiting configured
- ✅ Mobile responsive tested

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [SQL Migration Order](sql/README.md) - Complete database setup guide
- [Security Fixes](SECURITY_WARNINGS_FIX.md) - Supabase Advisor fixes
- [Apply Security Fixes](APPLY_SECURITY_FIXES.md) - Quick security guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run linting: `npm run lint`
4. Test locally: `npm run dev`
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions:
- Check the [Setup Guide](SETUP.md) for common issues
- Review [sql/README.md](sql/README.md) for database setup
- Open an issue for bug reports or feature requests

---

**Built with ❤️ using Next.js 16, React 19, and Supabase**  
**Production Ready** | **Multi-Tenant SaaS** | **Fully Featured**
