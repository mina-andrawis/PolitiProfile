# Scripts Overview

Quick reference for all automation scripts in PolitiProfile.

## Alignment Score Scripts

### 1. **analyzeTopics.js**
Analyzes bills database to find top 15 most popular policy topics.

```bash
node scripts/analyzeTopics.js
```

**Output:** List of topics by bill count, coverage percentage

**When to run:** One-time during setup, or when re-evaluating topics

---

### 2. **migrateFighterTopics.js**
Adds empty `topicPositions` field to all fighters.

```bash
node scripts/migrateFighterTopics.js
```

**What it does:**
- Initializes topicPositions with all 15 topics set to "no-position"
- Only updates fighters that don't already have the field

**When to run:** Once before using automated analysis

---

### 3. **linkFightersToBioguide.js** ⭐
Links fighters to legislators by matching names to bioguide IDs.

```bash
node scripts/linkFightersToBioguide.js
```

**What it does:**
- Matches fighter names to legislators in database
- Adds `bioguideId` field to fighters
- Reports unmatched fighters

**When to run:**
- Before running analyzeFighterPositions
- When adding new fighters

**Output example:**
```
✅ Linked Bernie Sanders → S000033
❌ No match found for Summer Lee
```

---

### 4. **analyzeFighterPositions.js** ⭐⭐⭐
Automatically determines fighter positions by analyzing bill sponsorship.

```bash
node scripts/analyzeFighterPositions.js
```

**What it does:**
- Finds all bills sponsored/cosponsored by each fighter
- Determines stance (support/oppose/neutral) from bill language
- Calculates priority (high/medium/low) from sponsorship frequency
- Updates fighter topicPositions in database

**When to run:**
- After linking fighters to bioguideIds
- Periodically when bill database updates
- When you want to refresh positions

**Output example:**
```
🔍 Analyzing: Bernie Sanders
  📊 Found 243 bills
  ✅ Updated topic positions
  📋 Top positions:
     • Health: support (high priority)
     • Education: support (high priority)
```

---

## Recommended Workflow

### First Time Setup
```bash
# 1. Analyze which topics to use (already done for you)
node scripts/analyzeTopics.js

# 2. Initialize fighter topicPositions field
node scripts/migrateFighterTopics.js

# 3. Link fighters to bioguide IDs
node scripts/linkFightersToBioguide.js

# 4. Analyze positions from bills
node scripts/analyzeFighterPositions.js
```

### Adding New Fighters
```bash
# 1. Add fighter to database manually or via API

# 2. Link to bioguide
node scripts/linkFightersToBioguide.js

# 3. Analyze their positions
node scripts/analyzeFighterPositions.js
```

### Updating Positions (Periodic)
```bash
# When bills database updates, re-analyze
node scripts/analyzeFighterPositions.js
```

---

## Common Issues

### "No bills found for fighter"
- Fighter needs a valid `bioguideId`
- Run `linkFightersToBioguide.js` first
- Or manually add bioguideId to fighter document

### "Fighter already has bioguideId"
- This is fine! Script skips already-linked fighters
- Only new fighters will be processed

### "Unmatched fighters"
- Name doesn't match legislators database
- Manually add bioguideId from https://bioguide.congress.gov/
```javascript
db.fighters.updateOne(
  { name: "Fighter Name" },
  { $set: { bioguideId: "X000000" } }
)
```

---

## Environment Requirements

All scripts require:
- `.env.local` file with `MONGO_URI`
- MongoDB connection to `default` database
- Collections: `fighters`, `bills`, `legislators`

---

## Manual Override

To manually set a fighter's positions:

```bash
# Use the API endpoint
curl -X POST http://localhost:3000/api/fighters/updateTopicPositions \
  -H "Content-Type: application/json" \
  -d '{
    "fighterId": "64abc123...",
    "topicPositions": {
      "Health": { "stance": "support", "priority": "high" }
    }
  }'
```

---

## Script Locations

| Script | Purpose | Documentation |
|--------|---------|---------------|
| `analyzeTopics.js` | Find top topics | See code comments |
| `migrateFighterTopics.js` | Initialize positions | [ALIGNMENT_SCORE_IMPLEMENTATION.md](../ALIGNMENT_SCORE_IMPLEMENTATION.md) |
| `linkFightersToBioguide.js` | Link to legislators | [AUTOMATED_POSITION_ANALYSIS.md](../AUTOMATED_POSITION_ANALYSIS.md) |
| `analyzeFighterPositions.js` | Auto-analyze positions | [AUTOMATED_POSITION_ANALYSIS.md](../AUTOMATED_POSITION_ANALYSIS.md) |

---

## Testing After Running Scripts

1. **Check database:**
```javascript
db.fighters.findOne({ name: "Bernie Sanders" })
// Should have bioguideId and topicPositions fields
```

2. **Test in app:**
- Go to "Your Topics" and select a few topics
- Go to "Home" page
- Verify "Top Fighters for You" shows aligned fighters
- Check alignment scores are calculated

3. **Verify calculation:**
```javascript
// In browser console on home page
console.log(fighters[0].alignmentScore)
// Should show 0-100 number
```

---

## Getting Help

- Check full documentation: [AUTOMATED_POSITION_ANALYSIS.md](../AUTOMATED_POSITION_ANALYSIS.md)
- Review alignment algorithm: [../helpers/alignmentScore.js](../helpers/alignmentScore.js)
- See implementation guide: [ALIGNMENT_SCORE_IMPLEMENTATION.md](../ALIGNMENT_SCORE_IMPLEMENTATION.md)
