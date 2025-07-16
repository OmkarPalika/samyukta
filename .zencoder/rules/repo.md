---
description: Repository Information Overview
alwaysApply: true
---

# Samyukta Information

## Summary
Samyukta is the official website for ANITS Cultural Festival 2025, built with Next.js 15, TypeScript, and Tailwind CSS. It features server-side rendering, authentication system, responsive design, and modern UI with neon glow effects.

## Structure
- **src/app**: Next.js App Router pages and API routes
- **src/components**: UI components organized by feature
- **src/contexts**: React context providers (AuthContext)
- **src/entities**: Data models and business logic
- **src/lib**: Utility functions and database connections
- **src/hooks**: Custom React hooks
- **src/data**: Static data and content
- **scripts**: Database initialization and seeding scripts

## Language & Runtime
**Language**: TypeScript
**Version**: TypeScript 5.x
**Framework**: Next.js 15.3.5
**Runtime**: Node.js (supports ESM via "type": "module")
**Build System**: Next.js built-in build system
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- React 19.0.0
- Next.js 15.3.5
- MongoDB 6.17.0
- Tailwind CSS 4.x
- Radix UI components (various UI primitives)
- Zod 4.0.0 (validation)
- React Hook Form 7.60.0
- Framer Motion 12.23.0
- Nodemailer 7.0.5

**Development Dependencies**:
- ESLint 9.x
- TypeScript 5.x
- Tailwind CSS tooling

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Fresh build (clean + build)
npm run fresh-build

# Deploy to Vercel
npm run deploy
```

## Database
**Type**: MongoDB
**Connection**: MongoDB URI via environment variable
**Schema**: Comprehensive data models for users, registrations, events
**Setup Commands**:
```bash
# Initialize database with collections and indexes
npm run init-db

# Seed database with initial data
npm run seed-db

# Reset database (caution: destructive)
npm run reset-db

# Complete setup (init + seed)
npm run setup-db
```

## Testing
**API Testing**:
```bash
npm run test-apis
```

## Key Features
- **Authentication**: Cookie-based auth system with user roles
- **Event Management**: Workshops, competitions, registrations
- **Social Features**: Photo sharing with moderation
- **Dashboard**: User profiles and activities
- **QR System**: Event check-in and game mechanics
- **Email Integration**: Nodemailer with Gmail

## Environment Configuration
Key environment variables:
- MONGODB_URI: Database connection string
- GMAIL_USER/GMAIL_APP_PASSWORD: Email configuration
- NEXT_PUBLIC_BASE_URL: Application URL
- GAS_UPLOAD_URL: Google Apps Script for file uploads

## SEO & Performance
- Built-in sitemap generation
- OpenGraph images
- Performance optimizations via Next.js config
- Image optimization with WebP/AVIF support