/**
 * Update Bills Script
 *
 * This script updates the bills collection by importing new bills from the
 * unitedstates/congress data directory. It checks for new bills and updates
 * existing ones if they've been modified.
 *
 * Usage: node scripts/updateBills.js [congress] [billType]
 *
 * Examples:
 *   node scripts/updateBills.js                    // Update all bills in 118th Congress
 *   node scripts/updateBills.js 118               // Update specific congress
 *   node scripts/updateBills.js 118 hr            // Update specific bill type
 */

require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// MongoDB connection
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('❌ MONGO_URI not found in .env.local');
  process.exit(1);
}

const client = new MongoClient(uri);

// Configuration
const CONGRESS_DATA_PATH = process.env.CONGRESS_DATA_PATH || '../congress/data';
const DEFAULT_CONGRESS = '118';
const BILL_TYPES = ['hr', 's', 'hjres', 'sjres', 'hconres', 'sconres', 'hres', 'sres'];

/**
 * Main update function
 */
async function updateBills(congress = DEFAULT_CONGRESS, billType = null) {
  console.log('📊 Starting bills update process...\n');

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const database = client.db('default');
    const billsCollection = database.collection('bills');

    const billTypesToProcess = billType ? [billType] : BILL_TYPES;

    let totalProcessed = 0;
    let totalUpdated = 0;
    let totalNew = 0;
    let totalErrors = 0;

    for (const type of billTypesToProcess) {
      const billTypePath = path.join(CONGRESS_DATA_PATH, congress, 'bills', type);

      if (!fs.existsSync(billTypePath)) {
        console.log(`⚠️  Skipping ${type}: Directory not found at ${billTypePath}`);
        continue;
      }

      console.log(`📂 Processing ${type.toUpperCase()} bills...`);

      const billDirs = fs.readdirSync(billTypePath).filter(dir => {
        return fs.statSync(path.join(billTypePath, dir)).isDirectory();
      });

      for (const billDir of billDirs) {
        const dataJsonPath = path.join(billTypePath, billDir, 'data.json');

        if (!fs.existsSync(dataJsonPath)) {
          continue;
        }

        try {
          const billData = JSON.parse(fs.readFileSync(dataJsonPath, 'utf-8'));

          // Extract bill number from directory name (e.g., "hr1" -> "1")
          const billNumber = billDir.replace(/\D/g, '');
          const billId = `${congress}-${type}${billNumber}`;

          // Add metadata
          billData.billId = billId;
          billData.congress = congress;
          billData.billType = type;
          billData.billNumber = billNumber;
          billData.updatedAt = new Date();

          // Upsert bill to database
          const result = await billsCollection.updateOne(
            { billId: billId },
            { $set: billData },
            { upsert: true }
          );

          if (result.upsertedCount > 0) {
            totalNew++;
          } else if (result.modifiedCount > 0) {
            totalUpdated++;
          }

          totalProcessed++;

          // Progress indicator every 100 bills
          if (totalProcessed % 100 === 0) {
            process.stdout.write(`   Processed ${totalProcessed} bills...\r`);
          }

        } catch (err) {
          totalErrors++;
          console.error(`   ❌ Error processing ${billDir}: ${err.message}`);
        }
      }

      console.log(`   ✅ Completed ${type.toUpperCase()}: ${billDirs.length} bills checked\n`);
    }

    console.log('\n📊 Update Summary:');
    console.log(`   Total bills processed: ${totalProcessed}`);
    console.log(`   New bills added: ${totalNew}`);
    console.log(`   Existing bills updated: ${totalUpdated}`);
    console.log(`   Unchanged: ${totalProcessed - totalNew - totalUpdated}`);
    console.log(`   Errors: ${totalErrors}`);

    if (totalNew > 0 || totalUpdated > 0) {
      console.log('\n✅ Bills database successfully updated!');
    } else {
      console.log('\n✅ No updates needed - bills are current!');
    }

  } catch (error) {
    console.error('\n❌ Error during update:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

/**
 * Validate Congress data directory
 */
function validateDataDirectory() {
  if (!fs.existsSync(CONGRESS_DATA_PATH)) {
    console.error(`❌ Congress data directory not found: ${CONGRESS_DATA_PATH}`);
    console.error('\nPlease ensure you have:');
    console.error('1. Cloned the congress repository: git clone https://github.com/unitedstates/congress.git');
    console.error('2. Set CONGRESS_DATA_PATH in .env.local (or use default ../congress/data)');
    console.error('3. Run the congress scraper to download bills');
    process.exit(1);
  }
}

/**
 * Command line interface
 */
if (require.main === module) {
  const congress = process.argv[2] || DEFAULT_CONGRESS;
  const billType = process.argv[3] || null;

  console.log('🇺🇸 PolitiProfile Bills Updater\n');
  console.log(`Congress: ${congress}`);
  console.log(`Bill Type: ${billType || 'All'}`);
  console.log(`Data Path: ${CONGRESS_DATA_PATH}\n`);

  validateDataDirectory();

  updateBills(congress, billType)
    .then(() => {
      console.log('\n✅ Update process completed successfully!');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n❌ Update process failed:', error);
      process.exit(1);
    });
}

module.exports = { updateBills };
