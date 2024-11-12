const { XMLValidator, XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Set up Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'parse_log.log' })],
});

// Directory with XML files
const DATA_DIRECTORY = path.join(__dirname, '..', '..', 'congress-scraper', 'data', '118', 'bills', 'hr');

// Helper function to safely map over arrays or wrap a single item in an array
const mapItems = (item, mapCallback) => {
  if (!item) return [];
  return (Array.isArray(item) ? item : [item]).map(mapCallback);
};

async function processXmlFiles() {
  console.log('\n \n[INFO]: Starting XML parsing process...');
  logger.info('Starting XML parsing process...');
  if (!fs.existsSync(DATA_DIRECTORY)) {
    console.error(`[ERROR]: Directory does not exist: ${DATA_DIRECTORY}`);
    return logger.error(`Directory does not exist: ${DATA_DIRECTORY}`);
  }

  const subFolders = fs.readdirSync(DATA_DIRECTORY).filter(folder => fs.lstatSync(path.join(DATA_DIRECTORY, folder)).isDirectory());
  if (!subFolders.length) {
    console.log(`[INFO]: No subfolders found in the directory: ${DATA_DIRECTORY}`);
    return logger.info(`No subfolders found in the directory: ${DATA_DIRECTORY}`);
  }

  const parser = new XMLParser();
  for (const folder of subFolders) {
    const xmlFilePath = path.join(DATA_DIRECTORY, folder, 'fdsys_billstatus.xml');
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
        billId: bill.type + bill.number + '-' + bill.congress || null,
        congress: bill.congress || null,
        billNumber: bill.number || null,
        originChamber: bill.originChamber || null,
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

      // Assume the MongoDB insert happens here:
      // const result = await collection.insertOne(billData);
      // For now, simulate a success message:
      //logger.info(`Inserted data for file ${xmlFilePath}, MongoDB document ID: MOCKED_ID`);
      console.log(`[INFO]: Inserted data for file ${xmlFilePath}, MongoDB document ID: MOCKED_ID`);

      console.log('----------------------------------------------------------------------\n\n');
    } catch (fileError) {
      logger.error(`Failed to process file ${xmlFilePath}: ${fileError.message}`);
      console.error('\x1b[31m',`[ERROR]: Failed to process file ${xmlFilePath}: ${fileError.message}`);
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
