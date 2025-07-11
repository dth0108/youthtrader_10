# replit.md

## Overview

This is a full-stack web application built for conducting group surveys, specifically designed for organizing meetups and gatherings. The application is a React-based frontend with an Express.js backend, using PostgreSQL for data storage with Drizzle ORM, and styled with Tailwind CSS and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas shared between frontend and backend
- **Session Management**: Express sessions with PostgreSQL store

### Project Structure
- `client/` - Frontend React application
- `server/` - Backend Express server
- `shared/` - Shared types and schemas between frontend and backend
- `migrations/` - Database migration files

## Key Components

### Survey System
- Multi-step survey form with location, food preferences, drink preferences, and time selection
- Progress tracking and validation at each step
- Survey response aggregation and statistics

### Restaurant Integration
- Restaurant data storage and retrieval
- Location-based restaurant filtering
- Food type categorization
- Placeholder for Google Maps API integration

### UI Components
- Comprehensive shadcn/ui component library
- Korean language support with Noto Sans KR font
- Responsive design with mobile-first approach
- Dark mode support built into design system

## Data Flow

### Survey Submission Flow
1. User completes multi-step survey form
2. Form data validated using Zod schemas
3. Data submitted to `/api/survey` endpoint
4. Backend validates and stores in PostgreSQL
5. User redirected to results page

### Results Display Flow
1. Frontend fetches survey statistics from `/api/survey/stats`
2. Frontend fetches restaurant data from `/api/restaurants/{location}`
3. Data displayed in charts and restaurant listings
4. Export functionality for downloading results

## External Dependencies

### Database
- **PostgreSQL**: Primary database with Neon serverless configuration
- **Drizzle ORM**: Type-safe database operations
- **Connection**: Uses `@neondatabase/serverless` for database connectivity

### UI Libraries
- **Radix UI**: Headless UI components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Font Awesome**: Additional icons via CDN

### Development Tools
- **Vite**: Build tool with HMR support
- **TypeScript**: Static type checking
- **ESLint**: Code linting
- **PostCSS**: CSS processing

### Planned Integrations
- **Google Maps API**: For location services and restaurant discovery
- **Google Places API**: For restaurant search and details

## Deployment Strategy

### Production Build
- Frontend built with Vite to static assets
- Backend bundled with esbuild for Node.js runtime
- Static assets served from `/dist/public`
- API routes served from Express server

### Environment Configuration
- Database URL required via `DATABASE_URL` environment variable
- Supports both development and production modes
- Replit-specific development enhancements included

### Development Setup
- Hot module replacement via Vite
- Automatic server restart with tsx
- Database migrations with Drizzle Kit
- Shared TypeScript configuration across client/server

### Key Features
- Session-based user tracking
- CORS handling for API requests
- Error handling and logging
- Request/response logging for API endpoints
- Replit development banner integration

The application is designed to be easily deployable on Replit with minimal configuration, using modern web development practices and a clean separation of concerns between frontend and backend code.