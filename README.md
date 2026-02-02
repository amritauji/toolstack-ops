# ToolStack Ops

A modern, full-stack task management and project operations platform built with Next.js 16, React 19, and Supabase. Designed for teams who need powerful project management with real-time collaboration, advanced analytics, and seamless workflow automation.

## ✨ Features

### Core Functionality
- **Task Management** - Create, assign, and track tasks with priorities, due dates, and status updates
- **Kanban Board** - Visual project management with drag-and-drop functionality
- **Real-time Collaboration** - Live updates across all connected users
- **User Management** - Role-based access control with admin capabilities
- **File Attachments** - Upload and manage task-related documents and media
- **Comments System** - Threaded discussions on tasks and projects

### Advanced Features
- **Analytics Dashboard** - Comprehensive project metrics and team performance insights
- **Calendar View** - Timeline-based task visualization and scheduling
- **Bulk Operations** - Efficient management of multiple tasks simultaneously
- **Advanced Filters** - Powerful search and filtering capabilities
- **Export/Import** - Data portability with CSV and JSON support
- **Time Tracking** - Built-in time logging and productivity monitoring

### Technical Highlights
- **Modern UI/UX** - Responsive design with smooth animations using Framer Motion
- **Performance Optimized** - Server-side rendering, caching, and optimized database queries
- **Security First** - Row-level security, rate limiting, and secure authentication
- **Scalable Architecture** - Modular components and efficient state management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/toolstack-ops.git
   cd toolstack-ops
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.production.example .env.local
   ```
   
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

4. **Database setup**
   
   Run the SQL scripts in your Supabase dashboard in this order:
   - `sql/complete_profiles_setup.sql`
   - `sql/performance_indexes.sql`
   - `sql/comments_system.sql`
   - `sql/attachments_system.sql`
   - `sql/enable_realtime.sql`

5. **Start development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
toolstack-ops/
├── app/                    # Next.js App Router
│   ├── (app)/             # Protected app routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── admin/         # Admin panel
│   │   └── profile/       # User profiles
│   ├── api/               # API routes
│   └── login/             # Authentication pages
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── landing/           # Landing page components
│   └── ui/                # Reusable UI components
├── lib/                   # Utility functions and configurations
├── sql/                   # Database schema and migrations
├── mockups/               # Design mockups and prototypes
└── public/                # Static assets
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Database-level security policies
- **Real-time Subscriptions** - Live data synchronization

### State Management & Performance
- **TanStack Query** - Server state management and caching
- **Lenis** - Smooth scrolling experience
- **Performance Monitoring** - Built-in analytics and optimization

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Key Development Files
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint rules

## 📊 Features Deep Dive

### Dashboard
- Real-time task updates
- Kanban board with drag-and-drop
- Advanced filtering and search
- Bulk task operations
- Activity feed and notifications

### Analytics
- Team performance metrics
- Project completion trends
- Time tracking and productivity insights
- Custom reporting and exports

### Administration
- User management and role assignment
- System configuration and settings
- Data export/import capabilities
- Performance monitoring

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 📚 Documentation

- [Setup Guide](SETUP.md) - Detailed setup instructions
- [Frontend Design](frontend-design.md) - UI/UX guidelines
- [Load Balancing](LOAD_BALANCING.md) - Scaling considerations
- [Next.js Best Practices](NEXTJS_BEST_PRACTICES.md) - Development guidelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support and questions:
- Check the [Setup Guide](SETUP.md) for common issues
- Review the troubleshooting section in documentation
- Open an issue for bug reports or feature requests

---

**Built with ❤️ using Next.js, React, and Supabase**
