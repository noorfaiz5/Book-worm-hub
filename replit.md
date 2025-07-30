# BookNest - Reading Tracker Application

## Overview

BookNest is a personal reading tracking application that helps users manage their book collections, set reading goals, and track their reading progress. The app features a warm, cozy design with a cream and sage color palette, emphasizing simplicity and user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom color scheme (sage, terracotta, cream)
- **State Management**: React Query (@tanstack/react-query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Runtime**: Node.js with ESM modules
- **API Pattern**: RESTful endpoints (minimal, mostly health checks)
- **Development**: Hot module replacement via Vite integration

### Data Storage Solutions
- **Primary Database**: Firebase Firestore for real-time data synchronization
- **Schema Definition**: Drizzle ORM schemas for type safety (configured for PostgreSQL as fallback)
- **Local Storage**: In-memory storage class for development/testing
- **Data Models**: Users, Books, Reading Challenges with proper relationships

### Authentication and Authorization
- **Provider**: Firebase Authentication
- **Method**: Google OAuth with redirect flow
- **Context**: React Context API for auth state management
- **Session**: Firebase handles session persistence automatically

## Key Components

### Database Schema (shared/schema.ts)
- **Users**: Profile information, yearly reading goals
- **Books**: Title, author, genre, reading status, progress tracking
- **Reading Challenges**: Annual goal setting and progress tracking

### Frontend Components
- **Dashboard**: Main landing page with reading overview
- **Navigation**: Global navigation with user profile dropdown
- **Book Management**: Add/edit books modal with form validation
- **Progress Tracking**: Visual progress bars and statistics
- **Authentication**: Google sign-in modal

### Backend Services
- **Storage Interface**: Abstracted storage layer for data operations
- **Route Registration**: Minimal API endpoints
- **Development Tools**: Vite integration for hot reloading

## Recent Changes (January 2025)

- **Database Migration**: Migrated from Firebase Firestore to PostgreSQL database using Drizzle ORM
- **API Layer**: Created RESTful API endpoints for book CRUD operations
- **Storage Architecture**: Implemented database storage layer replacing Firebase collections
- **UI Updates**: Fixed recently finished books to display in compact 2x2 grid layout
- **Color Scheme**: Applied soft greens and terracotta color palette throughout application

## Data Flow

1. **Authentication Flow**:
   - User clicks "Sign in with Google"
   - Firebase handles OAuth redirect flow
   - Auth context updates with user state
   - Protected routes become accessible
   - **Setup Required**: Current domain must be added to Firebase authorized domains

2. **Book Management Flow**:
   - User adds book via modal form
   - Form validation with Zod schemas
   - Data saved to PostgreSQL database via API
   - React Query invalidates and refetches data
   - UI updates reactively

3. **Progress Tracking Flow**:
   - Book status updates trigger database writes
   - API endpoints handle data persistence
   - Dashboard components recalculate statistics
   - Progress bars and charts update automatically

## External Dependencies

### Core Dependencies
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **drizzle-orm**: Type-safe database operations and schema validation
- **firebase**: Authentication and Firestore database
- **react-hook-form**: Form state management
- **zod**: Runtime type validation
- **date-fns**: Date manipulation and formatting

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tailwindcss**: Utility-first CSS framework
- **@replit/vite-plugin-***: Replit-specific development tools

### UI and Styling
- **tailwindcss**: Primary styling solution
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **lucide-react**: Icon library

## Deployment Strategy

### Development
- Vite development server with HMR
- Firebase emulators for local testing (when configured)
- Environment-based configuration loading

### Production Build
- Vite builds optimized client bundle to `dist/public`
- ESBuild compiles server code to `dist/index.js`
- Static file serving from Express server
- Firebase production services for auth and database

### Environment Configuration
- Firebase configuration embedded in client code
- Database URL from environment variables for Drizzle
- Development vs production mode detection

### Hosting Considerations
- Client-side routing requires server fallback to index.html
- Firebase services require proper domain configuration
- Static assets served from Express in production