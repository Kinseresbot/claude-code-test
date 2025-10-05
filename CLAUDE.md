# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Setup
```bash
npm install                    # Install root dependencies
cd client && npm install       # Install client dependencies
cp .env.example .env          # Create environment file (configure before running)
```

### Development
```bash
npm run dev                   # Run both server and client concurrently
npm run dev:server           # Run only backend (port 3001)
npm run dev:client           # Run only frontend (port 3000)
```

### Testing
```bash
npm test                     # Run all tests (server + client)
npm run test:server         # Run backend tests only
npm run test:client         # Run frontend tests only
```

### Building & Production
```bash
npm run build               # Build both client and server
npm start                   # Start production server
npm run lint                # Run ESLint on all JS/JSX files
```

## Architecture Overview

### Client-Server Structure
- **Backend**: Express.js REST API (`server/`)
  - Port 3001 (configurable via PORT env var)
  - MongoDB database (Mongoose ODM)
  - JWT authentication

- **Frontend**: React SPA with Vite (`client/`)
  - Port 3000 in development
  - React Router for navigation
  - Axios for API calls
  - Context API for auth state

### Backend Architecture (server/)
- **MVC Pattern**:
  - `routes/api.js` - Route definitions and middleware attachment
  - `controllers/` - Business logic and request handling
  - `models/` - Mongoose schemas and data models
  - `middleware/` - Authentication, error handling
  - `config/` - Database connection and configuration

- **Authentication Flow**:
  - JWT tokens generated in controllers, verified in `middleware/auth.js`
  - Protected routes use `authenticate` middleware
  - Tokens stored client-side and sent via Authorization header

### Frontend Architecture (client/src/)
- **Component Organization**:
  - `App.jsx` - Route definitions with React Router
  - `context/AuthContext.jsx` - Global auth state management
  - `services/api.js` - Centralized API client with Axios interceptors
  - `pages/` - Route components
  - `components/` - Reusable UI components

- **API Communication**:
  - `api.js` creates axios instance with base URL and interceptors
  - Token automatically attached to requests via interceptor
  - Separate service objects (`authService`, `userService`) for different API domains

### Key Integration Points
- Frontend API calls go through `client/src/services/api.js`
- Backend routes defined in `server/routes/api.js` map to controllers
- Auth state flows: Login → JWT stored in localStorage → AuthContext → Protected routes
- Environment variables: Backend uses `.env`, Frontend uses `VITE_` prefixed vars

### Database
- MongoDB connection managed in `server/config/database.js`
- Connection happens before server starts (see `server/index.js`)
- Models use Mongoose with schema validation
- User model includes password hashing via bcrypt pre-save hook
