# Samyukta 2025 - ANITS Cultural Festival

This is the official website for Samyukta 2025, the cultural festival of ANITS (Anil Neerukonda Institute of Technology and Sciences). The project has been successfully converted from React Router to Next.js with TypeScript and modern styling.

## 🚀 Project Overview

**Original Code:** React Router-based layout with authentication and navigation  
**Converted To:** Next.js 15 with TypeScript, Tailwind CSS, and Lucide React icons  
**Key Features:**
- Server-side rendering with Next.js App Router
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Authentication system with cookies
- Dynamic navigation based on user state
- Modern UI with neon glow effects

## 📁 Project Structure

```
src/
├── app/
│   ├── about/page.tsx              # About page
│   ├── api/auth/                   # Authentication API routes
│   │   ├── login/route.ts          # Login endpoint
│   │   ├── logout/route.ts         # Logout endpoint
│   │   └── me/route.ts             # User profile endpoint
│   ├── dashboard/page.tsx          # User dashboard
│   ├── events/page.tsx             # Events listing
│   ├── login/page.tsx              # Login page
│   ├── register/page.tsx           # Registration page
│   ├── tickets/page.tsx            # Ticket purchasing
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Home page
├── components/
│   └── layout/
│       └── SamyuktaLayout.tsx      # Main layout component
├── entities/
│   └── User.ts                     # User entity and auth methods
└── utils/
    └── index.ts                    # Utility functions
```

## 🔄 Key Conversion Changes

### 1. **React Router → Next.js Navigation**
- `react-router-dom` → `next/navigation`
- `<Link to="...">` → `<Link href="...">`
- `useLocation()` → `usePathname()`
- `window.location.href` → `router.push()`

### 2. **Layout System**
- Created `SamyuktaLayout.tsx` as a client component
- Integrated with Next.js App Router in `app/layout.tsx`
- Maintained all original styling and functionality

### 3. **Authentication System**
- Created API routes in `app/api/auth/`
- Implemented cookie-based authentication
- Added TypeScript interfaces for user data

### 4. **Styling Migration**
- Converted inline styles to styled-jsx
- Maintained original CSS custom properties
- Added Tailwind CSS utilities
- Preserved neon glow effects
- Integrated Shadcn/ui components

### 5. **Component Library Integration**
- Added Shadcn/ui for consistent UI components
- Integrated Button, Card, Input, Label, Avatar components
- Enhanced navigation with NavigationMenu and DropdownMenu
- Maintained original design while improving accessibility

## 🛠️ Getting Started

1. **Install dependencies:**
```bash
npm install
```

2. **Run development server:**
```bash
npm run dev
```

3. **Open in browser:**
```
http://localhost:3000
```

## 🔐 Authentication

The project includes a mock authentication system:

**Demo Login Credentials:**
- Email: `admin@samyukta.com`
- Password: `admin123`

**API Endpoints:**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout  
- `GET /api/auth/me` - Get current user

## 🗃️ Entities & Data Models

The project includes comprehensive entity management with TypeScript interfaces:

### **Core Entities:**
- **User** - Authentication and profile management
- **Game** - QR quest and imposter game functionality
- **HelpTicket** - Support ticket system with priority levels
- **PitchRating** - Pitch presentation rating system (1-5 scale)
- **Gallery** - Photo/media gallery with moderation
- **Registration** - Event registration with team management

### **Entity Features:**
- **Type Safety** - Full TypeScript interfaces and validation
- **API Integration** - Ready-to-use methods for all CRUD operations
- **Error Handling** - Consistent error patterns across all entities
- **Bulk Operations** - Administrative efficiency for large datasets
- **File Support** - Upload capabilities for tickets, gallery, and registrations
- **Analytics** - Statistics and reporting for all entities

**Example Usage:**
```typescript
import { Registration, Game, Gallery } from '@/entities';

// Create event registration
const registration = await Registration.create({
  college: 'ANITS',
  members: teamMembers,
  ticket_type: 'Combo',
  workshop_track: 'AI'
});

// Process game interaction
const gameResult = await Game.scanQR('user123', 'QR_DATA');

// Upload gallery item
const galleryItem = await Gallery.create({
  uploaded_by: 'user123',
  file_url: uploadedFile.url,
  caption: 'Amazing event moment!'
});
```

For detailed documentation, see [ENTITIES_DOCUMENTATION.md](./ENTITIES_DOCUMENTATION.md)

## 📱 Pages and Features

### Public Pages
- **Home** (`/`) - Landing page with hero section
- **About** (`/about`) - Information about Samyukta 2025
- **Events** (`/events`) - Event listings and details
- **Tickets** (`/tickets`) - Ticket purchasing options
- **Register** (`/register`) - User registration form
- **Login** (`/login`) - User authentication

### Protected Pages
- **Dashboard** (`/dashboard`) - User dashboard with profile and activities

### Navigation Features
- **Responsive navigation** with mobile-friendly design
- **Dynamic navigation** based on authentication state
- **Breadcrumb-style** navigation for better UX
- **Smooth transitions** and hover effects

## 🎨 Design System

**Color Scheme:**
- Primary: Neon Blue (#00D4FF)
- Secondary: Electric Violet (#8B5CF6)
- Background: Dark gradient (#0F0F23 to #1A1B3A)
- Text: White/Gray variations

**Typography:**
- Font: Inter (Google Fonts)
- Responsive font sizes
- Gradient text effects

**Components:**
- Gradient buttons with neon glow
- Card-based layouts
- Backdrop blur navigation
- Custom scrollbar styling

## 🔧 Technical Details

**Dependencies:**
- Next.js 15.3.5
- React 19.0.0
- TypeScript 5.x
- Tailwind CSS 4.x
- Shadcn/ui (UI components)
- Lucide React (icons)
- Radix UI (headless components)

**Key Features:**
- App Router with file-based routing
- Server-side rendering
- TypeScript type safety
- Responsive design
- Modern CSS with custom properties
- Cookie-based authentication

## 📝 Development Notes

1. **Authentication:** Replace mock API endpoints with your actual backend
2. **Styling:** All original design elements preserved
3. **Routing:** Fully functional navigation with Next.js App Router
4. **TypeScript:** Full type safety throughout the application
5. **Performance:** Optimized with Next.js built-in features

## 🚦 Status

✅ **Completed:**
- React Router → Next.js conversion
- TypeScript implementation
- Authentication system
- All page layouts
- Navigation functionality
- Styling preservation
- Shadcn/ui integration
- Enhanced accessibility
- Mobile-responsive design

🔄 **Ready for:**
- Backend API integration
- Database connection
- Production deployment
- Additional features

This conversion maintains 100% of the original functionality while leveraging Next.js's powerful features for better performance and developer experience.
