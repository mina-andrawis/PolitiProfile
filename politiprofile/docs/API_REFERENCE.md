# API Reference

Complete documentation for all PolitiProfile API endpoints.

---

## Table of Contents

1. [Authentication](#authentication)
2. [Fighter Endpoints](#fighter-endpoints)
3. [User Endpoints](#user-endpoints)
4. [Bill Endpoints](#bill-endpoints)
5. [Article Endpoints](#article-endpoints)
6. [Admin Endpoints](#admin-endpoints)
7. [Error Responses](#error-responses)

---

## Authentication

Most endpoints require authentication via Firebase. Include the user's Firebase UID in request bodies or query parameters as `userId`.

### Admin Endpoints
Admin endpoints verify that the authenticated user has email `mi.andrawis@gmail.com` in the MongoDB database.

---

## Fighter Endpoints

### GET /api/fighters/getFighters

Fetch fighters with optional filtering, pagination, and alignment scoring.

**Parameters:**
- `state` (optional): Filter by US state code (e.g., "CA", "NY")
- `page` (default: 1): Page number for pagination
- `limit` (default: 30): Number of fighters per page
- `userTopics` (optional): JSON array of topic names for alignment calculation
- `sortBy` (default: "alignment"): Sort method ("alignment" or other)

**Response:**
```json
{
  "fighters": [
    {
      "_id": "...",
      "name": "Alexandria Ocasio-Cortez",
      "office": "U.S. Representative",
      "state": "NY",
      "party": "Democratic",
      "photoUrl": "https://...",
      "bioguideId": "O000172",
      "tags": ["progressive", "healthcare"],
      "topicPositions": {
        "Health": {
          "stance": "support",
          "priority": "high"
        }
      },
      "alignmentScore": 92,
      "Followers": ["userId1", "userId2"]
    }
  ],
  "totalFighters": 150,
  "totalPages": 5
}
```

**Example:**
```javascript
const response = await fetch('/api/fighters/getFighters?state=CA&page=1&limit=30&userTopics=["Health","Education"]&sortBy=alignment');
const data = await response.json();
```

---

### POST /api/fighters/addFighter

Add a new fighter to the database.

**Authentication:** Required (userId)

**Request Body:**
```json
{
  "userId": "firebase-uid",
  "name": "Jane Doe",
  "office": "U.S. Senator",
  "state": "CA",
  "party": "Democratic",
  "photoUrl": "https://...",
  "tags": ["progressive", "climate"],
  "bioguideId": "D000001"
}
```

**Response:**
```json
{
  "message": "Fighter added successfully",
  "fighterId": "507f1f77bcf86cd799439011"
}
```

**Errors:**
- 400: Missing required fields (name, office, state, party)
- 401: Authentication required
- 500: Database error

---

### POST /api/fighters/followFighter

Follow or unfollow a fighter.

**Authentication:** Required (userId)

**Request Body:**
```json
{
  "userId": "firebase-uid",
  "fighterId": "507f1f77bcf86cd799439011",
  "action": "follow"
}
```

**Parameters:**
- `action`: "follow" or "unfollow"

**Response:**
```json
{
  "message": "Successfully followed fighter"
}
```

**Errors:**
- 400: Missing userId, fighterId, or invalid action
- 404: Fighter not found
- 500: Database error

---

### PUT /api/fighters/updateTopicPositions

Update a fighter's topic positions.

**Authentication:** Admin only

**Request Body:**
```json
{
  "userId": "firebase-uid",
  "fighterId": "507f1f77bcf86cd799439011",
  "topicPositions": {
    "Health": {
      "stance": "support",
      "priority": "high"
    },
    "Education": {
      "stance": "support",
      "priority": "medium"
    }
  }
}
```

**Topic Position Schema:**
- `stance`: "support" | "oppose" | "neutral" | "no-position"
- `priority`: "high" | "medium" | "low"

**Response:**
```json
{
  "message": "Topic positions updated successfully"
}
```

**Errors:**
- 400: Missing fighterId or topicPositions
- 401: Authentication required
- 403: Admin access required
- 404: Fighter not found
- 500: Database error

---

## User Endpoints

### POST /api/users/addUser

Create a new user in the database (called automatically on Firebase registration).

**Request Body:**
```json
{
  "userId": "firebase-uid",
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "message": "User added successfully"
}
```

**Errors:**
- 400: Missing userId or email
- 409: User already exists
- 500: Database error

---

### GET /api/users/getUserDetails

Fetch user profile including topics and followed fighters.

**Parameters:**
- `userId`: Firebase UID (required)

**Response:**
```json
{
  "_id": "firebase-uid",
  "email": "user@example.com",
  "name": "John Doe",
  "topics": ["Health", "Education", "Energy"],
  "role": "user",
  "Following": ["fighterId1", "fighterId2"]
}
```

**Errors:**
- 400: Missing userId
- 404: User not found
- 500: Database error

---

### PUT /api/users/updateUser

Update user profile (topics, name, etc.).

**Authentication:** Required (userId)

**Request Body:**
```json
{
  "userId": "firebase-uid",
  "topics": ["Health", "Education", "Climate"],
  "name": "John Smith"
}
```

**Response:**
```json
{
  "message": "User updated successfully"
}
```

**Errors:**
- 400: Missing userId
- 404: User not found
- 500: Database error

---

## Bill Endpoints

### GET /api/bills/getBills

Fetch bills with filtering and pagination.

**Parameters:**
- `congress` (optional): Congress number (e.g., "118")
- `policyArea` (optional): Policy area name (e.g., "Health")
- `page` (default: 1): Page number
- `limit` (default: 50): Bills per page

**Response:**
```json
{
  "bills": [
    {
      "billId": "118-hr1234",
      "congress": "118",
      "title": "Medicare for All Act of 2023",
      "policyArea": "Health",
      "sponsor": {
        "bioguideId": "O000172",
        "fullName": "Rep. Ocasio-Cortez, Alexandria [D-NY-14]"
      },
      "cosponsors": [...],
      "summaries": [...],
      "introducedDate": "2023-03-15"
    }
  ],
  "totalBills": 500,
  "totalPages": 10
}
```

---

### GET /api/bills/[billId]

Fetch detailed information for a specific bill (Server-Side Rendered).

**URL Parameter:**
- `billId`: Bill identifier (e.g., "118-hr1234")

**Response:**
Full bill object with all details including summaries, cosponsors, and full text.

---

## Article Endpoints

### GET /api/articles/getArticles

Fetch articles with filtering (prepared for future news integration).

**Parameters:**
- `topic` (optional): Filter by topic
- `page` (default: 1): Page number
- `limit` (default: 20): Articles per page

**Response:**
```json
{
  "articles": [
    {
      "_id": "...",
      "title": "Senate Passes Healthcare Bill",
      "url": "https://...",
      "source": "Example News",
      "publishedDate": "2025-01-14",
      "topic": "Health",
      "fighterId": "507f1f77bcf86cd799439011"
    }
  ],
  "totalArticles": 100,
  "totalPages": 5
}
```

---

### POST /api/articles/addArticle

Add a new article (admin only).

**Authentication:** Admin only

**Request Body:**
```json
{
  "userId": "firebase-uid",
  "title": "Senate Passes Healthcare Bill",
  "url": "https://...",
  "source": "Example News",
  "publishedDate": "2025-01-14",
  "topic": "Health",
  "fighterId": "507f1f77bcf86cd799439011"
}
```

**Response:**
```json
{
  "message": "Article added successfully",
  "articleId": "..."
}
```

---

## Admin Endpoints

All admin endpoints require authentication and verify that the user email is `mi.andrawis@gmail.com`.

### GET /api/admin/stats

Get system statistics for admin dashboard.

**Parameters:**
- `userId`: Admin Firebase UID (required)

**Response:**
```json
{
  "totalUsers": 1250,
  "totalFighters": 180,
  "totalBills": 15718,
  "totalArticles": 0
}
```

---

### GET /api/admin/analytics

Get analytics data including top user topics and position coverage.

**Parameters:**
- `userId`: Admin Firebase UID (required)

**Response:**
```json
{
  "topUserTopics": [
    { "topic": "Health", "count": 450 },
    { "topic": "Education", "count": 380 }
  ],
  "positionCoverage": {
    "withPositions": 120,
    "withoutPositions": 60,
    "percentage": 67
  }
}
```

---

### POST /api/admin/runScript

Execute automation scripts from admin dashboard.

**Authentication:** Admin only

**Request Body:**
```json
{
  "userId": "firebase-uid",
  "script": "analyzeFighterPositions"
}
```

**Allowed Scripts:**
- `linkFightersToBioguide`: Link fighters to Congress legislators
- `analyzeFighterPositions`: Analyze bill sponsorship to determine positions
- `migrateFighterTopics`: Initialize topicPositions for all fighters

**Response:**
```json
{
  "message": "Script completed successfully",
  "output": "Analyzed 150 fighters...",
  "errors": null
}
```

**Errors:**
- 400: Invalid script name
- 403: Admin access required
- 500: Script execution failed

**Timeout:** 5 minutes (300000ms)

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong",
  "details": "Additional technical details (development only)"
}
```

### Common HTTP Status Codes

- **200**: Success
- **400**: Bad Request (missing/invalid parameters)
- **401**: Unauthorized (authentication required)
- **403**: Forbidden (admin access required)
- **404**: Not Found (resource doesn't exist)
- **405**: Method Not Allowed (wrong HTTP method)
- **409**: Conflict (resource already exists)
- **500**: Internal Server Error (database/server error)

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production deployment.

---

## CORS

API routes are configured for same-origin requests. Cross-origin requests are not currently supported.

---

**Last Updated**: January 2025
