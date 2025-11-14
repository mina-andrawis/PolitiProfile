/**
 * Analyze Fighter Topic Positions from Bills Database
 *
 * This script analyzes bills to determine:
 * 1. Which topics each fighter supports/opposes
 * 2. Priority level based on sponsorship frequency
 * 3. Automatically updates fighter topicPositions in database
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Topics list - copied from helpers/topics.js (top 15)
const topics = [
  { name: "Health" },
  { name: "Government Operations and Politics" },
  { name: "Armed Forces and National Security" },
  { name: "International Affairs" },
  { name: "Taxation" },
  { name: "Crime and Law Enforcement" },
  { name: "Agriculture and Food" },
  { name: "Finance and Financial Sector" },
  { name: "Education" },
  { name: "Public Lands and Natural Resources" },
  { name: "Transportation and Public Works" },
  { name: "Immigration" },
  { name: "Commerce" },
  { name: "Energy" },
  { name: "Labor and Employment" }
];

const uri = process.env.MONGO_URI;

// Map topic names to variations that might appear in bills
const TOPIC_VARIATIONS = {
  "Health": ["health", "healthcare", "medical", "medicare", "medicaid"],
  "Government Operations and Politics": ["government", "political", "administration", "federal"],
  "Armed Forces and National Security": ["military", "defense", "national security", "armed forces"],
  "International Affairs": ["foreign", "international", "diplomacy", "treaty"],
  "Taxation": ["tax", "taxation", "revenue", "irs"],
  "Crime and Law Enforcement": ["crime", "law enforcement", "police", "justice", "prison"],
  "Agriculture and Food": ["agriculture", "farm", "food", "rural"],
  "Finance and Financial Sector": ["financial", "banking", "securities", "finance"],
  "Education": ["education", "school", "student", "college", "university"],
  "Public Lands and Natural Resources": ["land", "natural resources", "parks", "wildlife"],
  "Transportation and Public Works": ["transportation", "infrastructure", "highway", "transit"],
  "Immigration": ["immigration", "immigrant", "visa", "refugee", "border"],
  "Commerce": ["commerce", "trade", "business", "consumer"],
  "Energy": ["energy", "power", "electricity", "renewable", "fossil"],
  "Labor and Employment": ["labor", "employment", "worker", "wage", "unemployment"]
};

/**
 * Determine if a bill title/summary suggests support or opposition
 * This is a heuristic - you can improve it based on your data
 */
function determineBillStance(bill) {
  const titleLower = (bill.title || '').toLowerCase();

  // Keywords that suggest opposition/restriction
  const oppositionKeywords = [
    'repeal', 'prohibit', 'restrict', 'eliminate', 'defund',
    'terminate', 'prevent', 'bar', 'ban', 'limit'
  ];

  // Keywords that suggest support/expansion
  const supportKeywords = [
    'establish', 'provide', 'support', 'expand', 'increase',
    'improve', 'enhance', 'strengthen', 'fund', 'authorize'
  ];

  const hasOpposition = oppositionKeywords.some(kw => titleLower.includes(kw));
  const hasSupport = supportKeywords.some(kw => titleLower.includes(kw));

  // Default to support if unclear (sponsoring usually means support)
  if (hasOpposition && !hasSupport) return 'oppose';
  if (hasSupport || (!hasOpposition && !hasSupport)) return 'support';

  return 'neutral'; // Both keywords present
}

/**
 * Match bill policyArea to our standardized topics
 */
function matchPolicyAreaToTopic(policyArea) {
  if (!policyArea) return null;

  // Direct match
  const directMatch = topics.find(t => t.name === policyArea);
  if (directMatch) return directMatch.name;

  // Fuzzy match using variations
  for (const [topicName, variations] of Object.entries(TOPIC_VARIATIONS)) {
    const policyLower = policyArea.toLowerCase();
    if (variations.some(v => policyLower.includes(v))) {
      return topicName;
    }
  }

  return null;
}

/**
 * Analyze bills for a specific fighter
 */
async function analyzeFighter(billsCollection, fighter) {
  const bioguideId = fighter.bioguideId || extractBioguideId(fighter);

  if (!bioguideId) {
    console.log(`  ⚠️  No bioguideId found for ${fighter.name}`);
    return null;
  }

  // Find all bills where this fighter is sponsor or cosponsor
  const bills = await billsCollection.find({
    $or: [
      { 'sponsor.bioguideId': bioguideId },
      { 'cosponsors.bioguideId': bioguideId }
    ]
  }).toArray();

  if (bills.length === 0) {
    console.log(`  ⚠️  No bills found for ${fighter.name} (${bioguideId})`);
    return null;
  }

  console.log(`  📊 Found ${bills.length} bills for ${fighter.name}`);

  // Count bills by topic and sponsorship type
  const topicStats = {};

  bills.forEach(bill => {
    const topic = matchPolicyAreaToTopic(bill.policyArea);
    if (!topic) return;

    if (!topicStats[topic]) {
      topicStats[topic] = {
        sponsored: 0,
        cosponsored: 0,
        support: 0,
        oppose: 0,
        neutral: 0
      };
    }

    const isSponsor = bill.sponsor?.bioguideId === bioguideId;
    const stance = determineBillStance(bill);

    if (isSponsor) {
      topicStats[topic].sponsored++;
    } else {
      topicStats[topic].cosponsored++;
    }

    topicStats[topic][stance]++;
  });

  // Convert stats to topicPositions
  const topicPositions = {};

  topics.forEach(topic => {
    const stats = topicStats[topic.name];

    if (!stats) {
      // No bills on this topic
      topicPositions[topic.name] = {
        stance: "no-position",
        priority: "low"
      };
      return;
    }

    // Determine stance based on bill analysis
    let stance = "neutral";
    if (stats.support > stats.oppose * 2) {
      stance = "support";
    } else if (stats.oppose > stats.support * 2) {
      stance = "oppose";
    }

    // Determine priority based on sponsorship
    let priority = "low";
    const totalBills = stats.sponsored + stats.cosponsored;

    if (stats.sponsored >= 3 || totalBills >= 10) {
      priority = "high";
    } else if (stats.sponsored >= 1 || totalBills >= 5) {
      priority = "medium";
    }

    topicPositions[topic.name] = { stance, priority };
  });

  return topicPositions;
}

/**
 * Extract bioguideId from fighter object
 * (Adjust based on your fighter schema)
 */
function extractBioguideId(fighter) {
  // Try various possible fields where bioguideId might be stored
  return fighter.bioguideId ||
         fighter.bioguide_id ||
         fighter.legislatorId ||
         fighter.bioGuideId ||
         null;
}

/**
 * Main analysis function
 */
async function analyzeAllFighters() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db("default");
    const fightersCollection = database.collection("fighters");
    const billsCollection = database.collection("bills");

    // Get all fighters
    const fighters = await fightersCollection.find({}).toArray();
    console.log(`Found ${fighters.length} fighters to analyze\n`);

    let analyzedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const fighter of fighters) {
      console.log(`\n🔍 Analyzing: ${fighter.name}`);

      const topicPositions = await analyzeFighter(billsCollection, fighter);

      if (!topicPositions) {
        skippedCount++;
        continue;
      }

      // Update fighter in database
      const result = await fightersCollection.updateOne(
        { _id: fighter._id },
        { $set: { topicPositions } }
      );

      if (result.modifiedCount > 0) {
        updatedCount++;
        console.log(`  ✅ Updated topic positions`);

        // Show top positions
        const topPositions = Object.entries(topicPositions)
          .filter(([_, pos]) => pos.stance !== "no-position")
          .sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b[1].priority] - priorityOrder[a[1].priority];
          })
          .slice(0, 5);

        if (topPositions.length > 0) {
          console.log(`  📋 Top positions:`);
          topPositions.forEach(([topic, pos]) => {
            console.log(`     • ${topic}: ${pos.stance} (${pos.priority} priority)`);
          });
        }
      }

      analyzedCount++;
    }

    console.log('\n\n═══════════════════════════════════════');
    console.log('📊 ANALYSIS COMPLETE');
    console.log('═══════════════════════════════════════');
    console.log(`Total fighters: ${fighters.length}`);
    console.log(`Analyzed: ${analyzedCount}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (no bills): ${skippedCount}`);
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

// Run if called directly
if (require.main === module) {
  analyzeAllFighters();
}

module.exports = { analyzeFighter, analyzeFighterPositions: analyzeAllFighters };
