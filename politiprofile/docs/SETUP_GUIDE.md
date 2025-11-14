# PolitiProfile Setup Guide

This document provides detailed instructions to set up, run, and manage the PolitiProfile project on your local machine or deployment environment.

---

## 1. Prerequisites

### 1.1 Required Tools

| Tool | Version | Purpose | Download Link |
|------|---------|---------|---------------|
| **Node.js** | v16+ | Run the application | [nodejs.org](https://nodejs.org/) |
| **npm** | Bundled with Node | Package management | Bundled with Node.js |
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com/) |
| **MongoDB** | v4.4+ | Primary database | [mongodb.com](https://www.mongodb.com/) |

### 1.2 Optional Tools

- **MongoDB Compass**: GUI for MongoDB database management
- **Postman**: API endpoint testing
- **VS Code**: Recommended code editor

### 1.3 Accounts Required

- **Firebase Account**: For authentication
  - Console: [https://console.firebase.google.com/project/politiprofile](https://console.firebase.google.com/project/politiprofile)
- **MongoDB Atlas**: For cloud database hosting
  - Dashboard: [Cluster0](https://cloud.mongodb.com/v2/671eec3e6e471441a20b9d63)
- **Vercel Account**: For deployment (optional for local dev)

---

## 2. Initial Setup

### 2.1 Clone the Repository

```bash
git clone https://github.com/yourusername/politiprofile.git
cd politiprofile/politiprofile
```

### 2.2 Install Dependencies

```bash
npm install
```

This installs all required packages including:
- Next.js 14
- React 18
- TanStack Query (React Query)
- Tailwind CSS & DaisyUI
- Firebase SDK
- MongoDB driver

---

## 3. Environment Configuration

### 3.1 Create Environment File

Create `.env.local` in the `politiprofile` directory:

```bash
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/default

# Firebase (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=politiprofile
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3.2 Obtain MongoDB URI

1. Log into [MongoDB Atlas](https://cloud.mongodb.com/)
2. Navigate to Cluster0
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Ensure database name is `default`

### 3.3 Firebase Configuration

Firebase is already configured in the project. If you need to update:

1. Go to [Firebase Console](https://console.firebase.google.com/project/politiprofile)
2. Project Settings → General
3. Scroll to "Your apps" → Web app
4. Copy configuration values to `.env.local`

---

## 4. Database Setup

### 4.1 MongoDB Collections

The application uses these collections:

| Collection | Purpose |
|------------|---------|
| `users` | User accounts and preferences |
| `fighters` | Political fighters/candidates |
| `bills` | Congressional bills data |
| `legislators` | Current legislators data |
| `articles` | News articles (future) |

### 4.2 Initial Data Population

#### Option 1: Use Existing Data (Recommended)
- Contact admin (mi.andrawis@gmail.com) for database access
- Data already populated in production MongoDB

#### Option 2: Scrape Fresh Data
See [CONGRESS_SCRAPER_GUIDE.md](CONGRESS_SCRAPER_GUIDE.md) for details

---

## 5. Running the Application

### 5.1 Development Mode

```bash
npm run dev
```

- Opens at: `http://localhost:3000`
- Hot reload enabled
- Source maps available for debugging

### 5.2 Production Build

```bash
# Build the application
npm run build

# Start production server
npm start
```

### 5.3 Verify Installation

1. Navigate to `http://localhost:3000`
2. Check that pages load without errors
3. Try creating an account
4. Browse fighters and bills

---

## 6. Initialize Alignment Score System

### 6.1 Run Migration Scripts

```bash
# 1. Initialize fighter topic positions
node scripts/migrateFighterTopics.js

# 2. Link fighters to bioguide IDs
node scripts/linkFightersToBioguide.js

# 3. Analyze fighter positions from bills
node scripts/analyzeFighterPositions.js
```

**See**: [AUTOMATED_BILL_ANALYSIS.md](AUTOMATED_BILL_ANALYSIS.md) for detailed instructions

### 6.2 Verify Alignment System

1. Create a user account
2. Go to "Your Topics" and select topics
3. Visit "Home" page
4. Verify "Top Fighters for You" shows fighters sorted by alignment

---

## 7. Development Workflow

### 7.1 Directory Structure

```
politiprofile/
├── components/          # React components
│   ├── navigation/     # Navbar
│   ├── fighters/       # Fighter cards, grid
│   ├── bills/          # Bill components
│   └── home/           # Home feed
├── pages/              # Next.js pages (routes)
│   ├── api/           # API routes
│   ├── admin/         # Admin dashboard
│   └── *.js           # Page components
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
├── helpers/            # Utility functions
├── scripts/            # Automation scripts
├── docs/               # Documentation
└── public/             # Static assets
```

### 7.2 Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test locally:
   ```bash
   npm run dev
   ```

4. Commit and push:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin feature/your-feature-name
   ```

5. Create pull request to `master`

### 7.3 Code Style

- React components: PascalCase
- Files: kebab-case or camelCase
- Use Tailwind CSS for styling
- Follow existing component patterns

---

## 8. Testing

### 8.1 Test API Endpoints

Using curl:
```bash
# Get fighters
curl http://localhost:3000/api/fighters/getFighters?limit=10

# Get bills
curl http://localhost:3000/api/bills/getBills?limit=10
```

Using Postman:
1. Import API collection (if available)
2. Test each endpoint
3. Verify responses

### 8.2 Test Admin Dashboard

1. Login as `mi.andrawis@gmail.com`
2. Navigate to `/admin`
3. Test each tab:
   - Overview
   - Fighter Positions
   - Analytics
   - Run Scripts

---

## 9. Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

#### MongoDB Connection Failed
- Verify `MONGO_URI` in `.env.local`
- Check network IP is whitelisted in MongoDB Atlas
- Ensure database password is correct

#### Firebase Auth Not Working
- Verify all Firebase env variables are set
- Check Firebase console for auth configuration
- Ensure authorized domains include `localhost`

#### Scripts Failing
- Verify `.env.local` exists in correct directory
- Check MongoDB connection
- Ensure collections exist

### Getting Help

1. Check relevant documentation in `docs/`
2. Review error logs in console
3. Check Vercel deployment logs (if deployed)
4. Contact admin: mi.andrawis@gmail.com

---

## 10. Next Steps

After setup is complete:

1. **Read Project Overview**: [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
2. **Understand Alignment System**: [ALIGNMENT_SCORE_SYSTEM.md](ALIGNMENT_SCORE_SYSTEM.md)
3. **Admin Dashboard**: [ADMIN_DASHBOARD.md](ADMIN_DASHBOARD.md)
4. **API Reference**: [API_REFERENCE.md](API_REFERENCE.md)

---

## Appendix

### A. Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm start                # Start production server

# Scripts
node scripts/analyzeFighterPositions.js  # Analyze positions
node scripts/linkFightersToBioguide.js   # Link fighters
node scripts/migrateFighterTopics.js     # Initialize topics

# Git
git status               # Check status
git pull                 # Pull latest changes
git checkout master      # Switch to master branch
```

### B. Environment Variables Reference

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGO_URI` | Yes | MongoDB connection string |
| `NEXT_PUBLIC_FIREBASE_*` | Yes | Firebase configuration |
| `NEXT_PUBLIC_BASE_URL` | No | App base URL (default: localhost:3000) |

---

**Last Updated**: January 2025
**Maintained By**: mi.andrawis@gmail.com
