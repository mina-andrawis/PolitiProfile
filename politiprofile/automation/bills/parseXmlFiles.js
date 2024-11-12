require('dotenv').config({ path: '../../.env.local' });
const { MongoClient } = require('mongodb');
const { XMLValidator, XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Set up Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'parse_log.log' })],
});

// MongoDB Connection URI and Client Setup

const DATABASE_NAME = 'default';
const COLLECTION_NAME = 'bills';

const DATA_DIRECTORIES = [
  path.join(__dirname, '..', '..', 'congress-scraper', 'data', '118', 'bills', 'hr'),
  path.join(__dirname, '..', '..', 'congress-scraper', 'data', '118', 'bills', 's'),
  path.join(__dirname, '..', '..', 'congress-scraper', 'data', '118', 'bills', 'hjres'),
  path.join(__dirname, '..', '..', 'congress-scraper', 'data', '118', 'bills', 'sjres')
];

// Helper function to safely map over arrays or wrap a single item in an array
const mapItems = (item, mapCallback) => {
  if (!item) return [];
  return (Array.isArray(item) ? item : [item]).map(mapCallback);
};

async function processXmlFiles() {
  await client.connect();
  const db = client.db(DATABASE_NAME);
  const collection = db.collection(COLLECTION_NAME);

  console.log('\n \n[INFO]: Starting XML parsing process...');
  logger.info('Starting XML parsing process...');

  for (const directory of DATA_DIRECTORIES) {
    if (!fs.existsSync(directory)) {
      console.error(`[ERROR]: Directory does not exist: ${directory}`);
      logger.error(`Directory does not exist: ${directory}`);
      continue;
    }

  const subFolders = fs.readdirSync(directory).filter(folder => fs.lstatSync(path.join(directory, folder)).isDirectory());
  if (!subFolders.length) {
    console.log(`[INFO]: No subfolders found in the directory: ${directory}`);
    return logger.info(`No subfolders found in the directory: ${directory}`);
  }

  const parser = new XMLParser();
  for (const folder of subFolders) {
    const xmlFilePath = path.join(directory, folder, 'fdsys_billstatus.xml');
    if (!fs.existsSync(xmlFilePath)) {
      console.log(`[INFO]: No XML file found in folder: ${folder}`);
      logger.info(`No XML file found in folder: ${folder}`);
      continue;
    }

    try {
      console.log(`[INFO]: Processing file ${xmlFilePath}`);
      //logger.info(`Processing file ${xmlFilePath}`);

      const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');
      if (XMLValidator.validate(xmlContent) !== true) throw new Error('Invalid XML format');

      const bill = parser.parse(xmlContent, { object: true }).billStatus?.bill || {};
      const billData = {
        billId: bill.congress + '-' + bill.type + bill.number || null,
        congress: bill.congress || null,
        billNumber: bill.number || null,
        originChamber: bill.originChamber || null,
        originChamberCode: bill.originChamberCode || null,
        type: bill.type || null,
        title: bill.title || null,
        introducedDate: bill.introducedDate || null,
        updateDate: bill.updateDate || null,

        titles: mapItems(bill.titles?.item, title => ({
          titleType: title?.titleType || null,
          titleTypeCode: title?.titleTypeCode || null,
          title: title?.title || null,
          updateDate: title?.updateDate || null,
          chamberName: title?.chamberName || null,
          chamberCode: title?.chamberCode || null,
          billTextVersionName: title?.billTextVersionName || null,
          billTextVersionCode: title?.billTextVersionCode || null
        })),

        sponsor: bill.sponsors?.item ? {
          bioguideId: bill.sponsors.item?.bioguideId || null,
          fullName: bill.sponsors.item?.fullName || null,
          party: bill.sponsors.item?.party || null,
          state: bill.sponsors.item?.state || null,
          district: bill.sponsors.item?.district || null
        } : {},

        cosponsors: mapItems(bill.cosponsors?.item, cosponsor => ({
          bioguideId: cosponsor?.bioguideId || null,
          fullName: cosponsor?.fullName || null,
          party: cosponsor?.party || null,
          state: cosponsor?.state || null,
          district: cosponsor?.district || null,
          isOriginalCosponsor: cosponsor?.isOriginalCosponsor || 'False'
        })),

        relatedBills: mapItems(bill.relatedBills?.item, relatedBill => ({
          title: relatedBill?.title || null,
          congress: relatedBill?.congress || null,
          number: relatedBill?.number || null,
          type: relatedBill?.type || null
        })),

        policyArea: bill.policyArea?.name || null,

        subjects: mapItems(bill.subjects?.legislativeSubjects?.item, subject => ({
          name: subject?.name || null,
          policyArea: subject?.policyArea?.name || null
        })),

        summaries: mapItems(bill.summaries?.summary, summary => summary?.text || null),

        committees: mapItems(bill.committees?.item, committee => ({
          name: committee?.name || null,
          systemCode: committee?.systemCode || null,
          chamber: committee?.chamber || null,
          type: committee?.type || null
        })),

        actions: mapItems(bill.actions?.item, action => ({
          actionDate: action?.actionDate || null,
          text: action?.text || null, 
          type: action?.type || null
        })),

        law: bill.laws?.item ? {
          type: bill.laws.item?.type || null,
          number: bill.laws.item?.number || null
        } : ""
      };

      console.log(`[INFO]: Parsed data for bill ${billData.type} ${billData.billNumber}:`, billData);
      //logger.info(`Parsed data for bill ${billData.type} ${billData.billNumber}:`, billData);

      await collection.createIndex({ billId: 1 }, { unique: true });

      // Check if the document already exists
      const existingDoc = await collection.findOne({ billId: billData.billId });
      if (existingDoc) {
        console.log(`[INFO]: Document with billId ${billData.billId} already exists. Skipping insertion.`);
        logger.info(`Document with billId ${billData.billId} already exists. Skipping insertion.`);
        continue;
      }

      // Assume the MongoDB insert happens here:
      const result = await collection.insertOne(billData);
      logger.info(`Inserted data for bill ${billData.type} ${billData.billNumber}, MongoDB document ID: ${result.insertedId}`);
      console.log(`[INFO]: Inserted data for file ${xmlFilePath}, MongoDB document ID: ${result.insertedId}`);
      console.log('----------------------------------------------------------------------\n\n');
    } catch (fileError) {
      logger.error(`Failed to process file ${xmlFilePath}: ${fileError.message}`);
      console.error('\x1b[31m',`[ERROR]: Failed to process file ${xmlFilePath}: ${fileError.message}`);
    }
  }
}

  //logger.info('Completed XML parsing process.');
  console.log('[INFO]: Completed XML parsing process.');
}

processXmlFiles().then(() => {
  logger.info('XML files processed successfully.');
  console.log('[INFO]: XML files processed successfully.');
}).catch(error => {
  logger.error(`Error processing XML files: ${error.message}`);
  console.error(`[ERROR]: Error processing XML files: ${error.message}`);
});
