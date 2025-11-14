# Admin Dashboard Guide

## Access

The admin dashboard is **only accessible** to: `mi.andrawis@gmail.com`

**URL:** `/admin` or click the "Admin" icon in the navbar (⚙️ gear icon)

---

## Features Overview

### 1. **Overview Tab** 📊

Quick statistics dashboard showing:
- **Total Fighters** - Number of fighters in database
- **With Positions** - Fighters with populated topicPositions
- **Total Users** - Registered users
- **Total Bills** - Bills in database

**Quick Actions:**
- Links to other tabs for common tasks
- Status indicators

---

### 2. **Fighter Positions Tab** 👤

Manage fighter topic positions manually.

**Features:**
- **Search** - Find fighters by name
- **Select Fighter** - Click on any fighter to edit
- **Edit Positions** - Set stance and priority for all 15 topics
- **Save** - Update positions in database

**Topic Position Fields:**
- **Stance:**
  - Support - Fighter actively supports this topic
  - Oppose - Fighter actively opposes this topic
  - Neutral - Fighter has neutral position
  - No Position - No public position taken

- **Priority:**
  - High - Top issue for fighter
  - Medium - Regular issue
  - Low - Peripheral issue

**Use Case:**
1. Search for "Bernie Sanders"
2. Click on fighter card
3. Edit Health → Support, High Priority
4. Edit Education → Support, High Priority
5. Click "Save Positions"

---

### 3. **Analytics Tab** 📈

View system analytics and insights.

**Metrics:**
- **Top User Topics** - Most popular topics selected by users
- **Fighter Position Coverage** - Percentage of fighters with positions
- Visual progress bars

**Use Case:**
- Identify which topics users care about most
- Track progress on populating fighter positions

---

### 4. **Run Scripts Tab** ⚡

Execute automation scripts directly from the dashboard.

**Available Scripts:**

#### **Link Fighters to Bioguide**
- Matches fighter names to legislators
- Adds bioguideId field
- **When to run:** After adding new fighters

#### **Analyze Fighter Positions**
- Auto-analyzes bill sponsorship
- Determines stances and priorities
- Updates fighter topicPositions
- **When to run:**
  - After linking bioguides
  - When bills database updates
  - Monthly/quarterly refresh

#### **Migrate Fighter Topics**
- Initializes empty topicPositions
- **When to run:**
  - Once during initial setup
  - After adding new topics

**How to Use:**
1. Click "Run Script" button
2. Wait for execution (may take 1-5 minutes)
3. View output in terminal below
4. Check for success messages or errors

**Output Example:**
```
Running analyzeFighterPositions...

✅ Connected to MongoDB
Found 50 fighters to analyze

🔍 Analyzing: Bernie Sanders
  📊 Found 243 bills
  ✅ Updated topic positions

═══════════════════════════════════════
📊 ANALYSIS COMPLETE
Updated: 45/50
```

---

### 5. **Settings Tab** ⚙️

Configuration options (coming soon):
- Alignment algorithm parameters
- Topic management
- User permissions
- System settings

---

## Common Workflows

### **Initial Setup**

1. Go to **Run Scripts** tab
2. Run "Migrate Fighter Topics" (one-time setup)
3. Run "Link Fighters to Bioguide"
4. Run "Analyze Fighter Positions"
5. Go to **Fighter Positions** tab to review/refine
6. Check **Analytics** to see coverage

### **Adding a New Fighter**

1. Add fighter via database or API
2. Go to **Run Scripts** tab
3. Run "Link Fighters to Bioguide"
4. Run "Analyze Fighter Positions"
5. (Optional) Manually refine in **Fighter Positions** tab

### **Monthly Maintenance**

1. Go to **Run Scripts** tab
2. Run "Analyze Fighter Positions" to refresh from latest bills
3. Review **Analytics** for user trends
4. Manually update any incorrect positions in **Fighter Positions**

### **Manual Position Editing**

1. Go to **Fighter Positions** tab
2. Search for fighter name
3. Click on fighter card
4. Edit stances and priorities
5. Click "Save Positions"
6. Verify update in **Analytics** or by testing alignment in app

---

## API Endpoints

The dashboard uses these admin-only endpoints:

- `GET /api/admin/stats` - System statistics
- `GET /api/admin/analytics` - Analytics data
- `POST /api/admin/runScript` - Execute automation scripts
- `POST /api/fighters/updateTopicPositions` - Update fighter positions

---

## Security

### Current Protection
- Page-level check: Only `mi.andrawis@gmail.com` can access
- Redirects non-admin users to home page

### Recommended Enhancements
For production, consider adding:
1. **Server-side auth check** in API routes
2. **Firebase Admin SDK** verification
3. **Rate limiting** on script execution
4. **Audit logging** of admin actions

**Example server-side check:**
```javascript
// In API route
import admin from 'firebase-admin';

async function verifyAdmin(req) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  return decodedToken.email === 'mi.andrawis@gmail.com';
}
```

---

## Troubleshooting

### "Script Failed to Run"
- Check that script files exist in `/scripts` folder
- Verify `.env.local` has `MONGO_URI`
- Check script output for specific errors

### "Fighter Not Found in List"
- Verify fighter exists in database
- Try refreshing the page
- Check database connection

### "Positions Not Saving"
- Check browser console for errors
- Verify MongoDB connection
- Ensure fighter has valid `_id`

### "Admin Link Not Showing in Navbar"
- Verify you're logged in as `mi.andrawis@gmail.com`
- Clear browser cache
- Check Firebase auth status

---

## Best Practices

1. **Backup Before Scripts** - Scripts modify database, consider backing up first
2. **Review Auto-Analysis** - Automated positions may need manual refinement
3. **Regular Updates** - Run analysis monthly to keep positions current
4. **Monitor Analytics** - Track user topic preferences to guide content
5. **Test After Changes** - Verify alignment scores work after updating positions

---

## Future Enhancements

Planned features for the dashboard:

- [ ] Bulk import/export fighter positions (CSV)
- [ ] Visual topic position heatmap
- [ ] User activity tracking
- [ ] A/B testing alignment algorithms
- [ ] Fighter comparison tool
- [ ] Automated bill tagging
- [ ] Email notifications on script completion
- [ ] Rollback functionality for mistakes
- [ ] Fighter position version history

---

## Files Reference

**Dashboard Page:**
- `pages/admin/index.js` - Main admin dashboard

**API Routes:**
- `pages/api/admin/stats.js` - Statistics endpoint
- `pages/api/admin/analytics.js` - Analytics endpoint
- `pages/api/admin/runScript.js` - Script execution endpoint
- `pages/api/fighters/updateTopicPositions.js` - Position update endpoint

**Scripts:**
- `scripts/linkFightersToBioguide.js`
- `scripts/analyzeFighterPositions.js`
- `scripts/migrateFighterTopics.js`

**Documentation:**
- `ADMIN_DASHBOARD_GUIDE.md` - This file
- `AUTOMATED_POSITION_ANALYSIS.md` - Script details
- `ALIGNMENT_SCORE_IMPLEMENTATION.md` - System overview

---

## Support

If you encounter issues or need help:

1. Check the documentation files above
2. Review script output for error messages
3. Check MongoDB connection
4. Verify environment variables

---

## Quick Reference Commands

```bash
# Manual script execution (alternative to dashboard)
node scripts/linkFightersToBioguide.js
node scripts/analyzeFighterPositions.js
node scripts/migrateFighterTopics.js

# Check MongoDB data
# (Use MongoDB Compass or mongo shell)
db.fighters.find({ topicPositions: { $exists: true } }).count()
db.fighters.findOne({ name: "Bernie Sanders" })
```

---

**Last Updated:** January 2025
**Admin Email:** mi.andrawis@gmail.com
