/**
 * Link Fighters to Legislators by Bioguide ID
 *
 * This script helps you link your fighters collection to the legislators collection
 * so we can analyze their bill sponsorship/voting
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGO_URI;

/**
 * Fuzzy match fighter name to legislator
 */
function matchFighterToLegislator(fighter, legislators) {
  const fighterNameLower = fighter.name.toLowerCase().trim();

  // Try exact match first
  let match = legislators.find(leg => {
    const legName = `${leg.name?.first} ${leg.name?.last}`.toLowerCase().trim();
    return legName === fighterNameLower;
  });

  if (match) return match;

  // Try last name match
  const fighterLastName = fighter.name.split(' ').pop().toLowerCase();
  match = legislators.find(leg => {
    const legLastName = leg.name?.last?.toLowerCase();
    return legLastName === fighterLastName;
  });

  return match;
}

async function linkFighters() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db("default");
    const fightersCollection = database.collection("fighters");
    const legislatorsCollection = database.collection("legislators");

    const fighters = await fightersCollection.find({}).toArray();
    const legislators = await legislatorsCollection.find({}).toArray();

    console.log(`Found ${fighters.length} fighters`);
    console.log(`Found ${legislators.length} legislators\n`);

    let matchedCount = 0;
    let unmatchedFighters = [];

    for (const fighter of fighters) {
      // Skip if already has bioguideId
      if (fighter.bioguideId) {
        console.log(`✓ ${fighter.name} already has bioguideId: ${fighter.bioguideId}`);
        matchedCount++;
        continue;
      }

      const match = matchFighterToLegislator(fighter, legislators);

      if (match) {
        const bioguideId = match.bioguide_id || match.id?.bioguide;

        if (bioguideId) {
          await fightersCollection.updateOne(
            { _id: fighter._id },
            { $set: { bioguideId } }
          );

          console.log(`✅ Linked ${fighter.name} → ${bioguideId}`);
          matchedCount++;
        } else {
          console.log(`⚠️  Found match for ${fighter.name} but no bioguideId`);
          unmatchedFighters.push(fighter.name);
        }
      } else {
        console.log(`❌ No match found for ${fighter.name}`);
        unmatchedFighters.push(fighter.name);
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('📊 LINKING COMPLETE');
    console.log('═══════════════════════════════════════');
    console.log(`Matched: ${matchedCount}/${fighters.length}`);
    console.log(`Unmatched: ${unmatchedFighters.length}`);

    if (unmatchedFighters.length > 0) {
      console.log('\nUnmatched fighters:');
      unmatchedFighters.forEach(name => console.log(`  • ${name}`));
      console.log('\nℹ️  You may need to manually add bioguideId for these fighters');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

linkFighters();
