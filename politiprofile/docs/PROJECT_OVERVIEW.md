# PolitiProfile - Project Overview

## Executive Summary

**PolitiProfile** is a progressive political engagement platform that connects users with political fighters (candidates and elected officials) who align with their values. The platform uses a sophisticated alignment scoring algorithm to match users with fighters based on policy positions across 15 key topics.

---

## Core Concept

### The Problem
Citizens struggle to find political candidates who genuinely represent their values and priorities. Traditional resources provide limited insights into candidates' actual policy positions and voting records.

### The Solution
PolitiProfile provides:
1. **Personalized Matching**: Users select topics they care about
2. **Data-Driven Alignment**: Algorithm analyzes bill sponsorship and voting records
3. **Curated Content**: News, bills, and updates from aligned fighters
4. **Progressive Focus**: Highlights fighters who champion progressive values

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS 3.4 + DaisyUI 4.12
- **State Management**: React Query (TanStack Query) + React Context
- **Routing**: Next.js file-based routing with SSR

### Backend
- **API**: Next.js API Routes (serverless functions)
- **Database**: MongoDB (native driver, no ORM)
- **Authentication**: Firebase Authentication
- **Deployment**: Vercel (automatic from master branch)

### Data Sources
- **Bills & Legislators**: [unitedstates/congress](https://github.com/unitedstates/congress) (Python scraper)
- **Legislator Info**: [congress-legislators YAML](https://github.com/unitedstates/congress-legislators)
- **Voting Records**: Project Vote Smart API (future)

### Key Libraries
| Library | Purpose |
|---------|---------|
| `@tanstack/react-query` | Data fetching and caching |
| `firebase` | Authentication |
| `mongodb` | Database operations |
| `tailwindcss` | Utility-first CSS |
| `daisyui` | UI components |

---

## Architecture

### High-Level Flow

```
User Interface (Next.js/React)
    ↓
React Query Cache Layer
    ↓
API Routes (Next.js Serverless)
    ↓
MongoDB Database
    ↑
Congress Scraper (Python) → Bills Data
```

### Data Flow

1. **User Interaction**
   - User selects topics in "Your Topics"
   - Saved to MongoDB `users` collection

2. **Alignment Calculation**
   - Fighter positions stored in `topicPositions` field
   - API calculates alignment score on request
   - Results cached by React Query

3. **Content Display**
   - Fighters sorted by alignment score
   - Related bills and articles displayed
   - Personalized "For You" feed

---

## Core Features

### 1. Topic Selection
- **Location**: `/your-topics`
- **What**: 15 policy topics (Health, Education, Energy, etc.)
- **How**: Users select topics they care about
- **Result**: Stored in user profile for alignment scoring

### 2. Fighter Discovery
- **Location**: `/featured-fighters`
- **What**: Browse progressive political fighters
- **Features**:
  - Pagination (30 per page)
  - State filter
  - Follow/unfollow functionality
  - Alignment score display

### 3. Alignment Scoring
- **Algorithm**: Matches user topics with fighter positions
- **Data Source**: Bill sponsorship and voting records
- **Calculation**: Weighted score (0-100) based on:
  - Topic overlap
  - Fighter stance (support/oppose)
  - Priority level (high/medium/low)
- **Display**: Percentage badge on fighter cards

### 4. Personalized Feed
- **Location**: `/home`
- **What**: "For You" feed of articles, bills, and updates
- **Sorting**: Top alignment match or newest
- **Filters**: By issue, content type, government level

### 5. Bill Browsing
- **Location**: `/bills`
- **What**: Browse 118th Congress bills
- **Features**:
  - Filter by policy area (15 topics)
  - Pagination
  - Full bill details with SSR

### 6. Admin Dashboard
- **Location**: `/admin` (only for mi.andrawis@gmail.com)
- **Features**:
  - System statistics
  - Manual fighter position editing
  - Analytics dashboard
  - Script execution interface
  - Position management

---

## Data Models

### Users Collection
```javascript
{
  _id: String,           // Firebase UID
  email: String,         // User email
  name: String,          // Display name
  topics: Array<String>, // Selected topics
  role: String,          // "user" or "admin"
  Following: Array<ObjectId> // Fighter IDs
}
```

### Fighters Collection
```javascript
{
  _id: ObjectId,
  name: String,
  office: String,
  state: String,
  party: String,
  photoUrl: String,
  bioguideId: String,    // Links to legislators
  tags: Array<String>,
  topicPositions: {
    "Health": {
      stance: "support|oppose|neutral|no-position",
      priority: "high|medium|low"
    },
    // ... all 15 topics
  },
  alignmentScore: Number, // Calculated per user
  Followers: Array<String> // User UIDs
}
```

### Bills Collection
```javascript
{
  billId: String,        // "118-hr1234"
  congress: String,
  title: String,
  policyArea: String,    // Maps to 15 topics
  sponsor: {
    bioguideId: String,
    fullName: String
  },
  cosponsors: Array,
  summaries: Array,
  // ... full bill data
}
```

### Legislators Collection
```javascript
{
  bioguide_id: String,
  name: { first, last },
  // Full YAML data from congress-legislators repo
}
```

---

## Key Workflows

### User Registration Flow
1. User clicks "Login/Register"
2. Firebase modal appears
3. User creates account via Firebase Auth
4. `onAuthStateChanged` triggers
5. API creates user document in MongoDB
6. User redirected to "Your Topics"

### Alignment Calculation Flow
1. User selects topics (e.g., "Health", "Education")
2. User visits Home page
3. `useGetFighters` hook fetches fighters
4. Hook passes `userTopics` to API
5. API calls `calculateAlignment()` for each fighter
6. Fighters sorted by score (highest first)
7. React Query caches results (5 min)

### Bill Analysis Flow (Automated)
1. Admin runs `analyzeFighterPositions.js`
2. Script queries bills by bioguideId
3. Analyzes bill titles for keywords
4. Counts sponsorships per topic
5. Calculates stance and priority
6. Updates fighter `topicPositions` in DB

---

## 15 Core Topics

Based on bill count analysis (covering 78.9% of all bills):

1. Health (1,845 bills)
2. Government Operations and Politics (1,202 bills)
3. Armed Forces and National Security (990 bills)
4. International Affairs (981 bills)
5. Taxation (976 bills)
6. Crime and Law Enforcement (923 bills)
7. Agriculture and Food (775 bills)
8. Finance and Financial Sector (686 bills)
9. Education (652 bills)
10. Public Lands and Natural Resources (586 bills)
11. Transportation and Public Works (578 bills)
12. Immigration (518 bills)
13. Commerce (478 bills)
14. Energy (474 bills)
15. Labor and Employment (470 bills)

---

## Security

### Authentication
- Firebase Authentication (email/password)
- Session persistence across page reloads
- Protected routes redirect to login

### Authorization
- Admin routes check email against whitelist
- API routes verify user ownership for mutations
- MongoDB queries scoped to authenticated user

### Data Protection
- Environment variables for sensitive data
- Firebase security rules (configured)
- MongoDB connection string secured
- No sensitive data in client-side code

---

## Performance Optimizations

### React Query Caching
- 5-minute stale time for most queries
- 10-minute cache time
- Automatic background refetching
- Query invalidation on mutations

### Server-Side Rendering
- Bill detail pages use SSR for SEO
- Initial page load optimized
- Dynamic imports where appropriate

### Database
- Indexes on frequently queried fields
- Pagination on all list endpoints
- Connection pooling with MongoDB driver

---

## Future Enhancements

### Planned Features
- [ ] News article integration (real API)
- [ ] Voting records analysis
- [ ] Fighter detail pages with alignment breakdown
- [ ] Email notifications for fighter updates
- [ ] State legislator support
- [ ] Mobile app (React Native)
- [ ] Social sharing of fighters/positions

### Technical Improvements
- [ ] GraphQL layer for complex queries
- [ ] Redis caching for hot data
- [ ] WebSocket for real-time updates
- [ ] Automated testing suite
- [ ] Performance monitoring
- [ ] Error tracking (Sentry)

---

## Development Principles

1. **User-Centric**: Every feature serves user needs
2. **Data-Driven**: Decisions based on actual bill data
3. **Progressive Values**: Platform champions progressive policies
4. **Transparency**: Open about data sources and algorithms
5. **Accessibility**: WCAG compliance for all users
6. **Performance**: Fast, responsive, cached appropriately

---

## Links & Resources

- **Live Site**: [https://politiprofile.us](https://politiprofile.us)
- **GitHub**: Private repository
- **Firebase Console**: [https://console.firebase.google.com/project/politiprofile](https://console.firebase.google.com/project/politiprofile)
- **MongoDB Atlas**: [Cluster0](https://cloud.mongodb.com/v2/671eec3e6e471441a20b9d63)
- **Vercel**: Automatic deployment on push to master

---

**Last Updated**: January 2025
**Version**: 1.0
**Maintained By**: mi.andrawis@gmail.com
