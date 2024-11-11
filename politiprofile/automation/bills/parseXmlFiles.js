const { XMLValidator, XMLParser } = require('fast-xml-parser');
const fs = require('fs');
const path = require('path');
const winston = require('winston');

// Set up Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),  // Outputs logs to console
    new winston.transports.File({ filename: 'parse_log.log' })  // Outputs logs to a file
  ],
});

// Directory with XML files
const DATA_DIRECTORY = path.join(__dirname, '..', '..', 'congress-scraper', 'data', '118', 'bills', 'hr');

async function processXmlFiles() {
  try {
    logger.info('Starting XML parsing process...');
    console.log('[INFO]: Starting XML parsing process...');

    if (!fs.existsSync(DATA_DIRECTORY)) {
      logger.error(`Directory does not exist: ${DATA_DIRECTORY}`);
      console.error(`[ERROR]: Directory does not exist: ${DATA_DIRECTORY}`);
      return;
    }

    // Iterate through subfolders in the hr directory
    const subFolders = fs.readdirSync(DATA_DIRECTORY).filter(folder => {
      return fs.lstatSync(path.join(DATA_DIRECTORY, folder)).isDirectory();
    });

    if (subFolders.length === 0) {
      logger.info(`No subfolders found in the directory: ${DATA_DIRECTORY}`);
      console.log(`[INFO]: No subfolders found in the directory: ${DATA_DIRECTORY}`);
      return;
    }

    for (const folder of subFolders) {
      const folderPath = path.join(DATA_DIRECTORY, folder);
      const xmlFilePath = path.join(folderPath, 'fdsys_billstatus.xml');

      if (fs.existsSync(xmlFilePath)) {
        try {
          logger.info(`Processing file ${xmlFilePath}`);
          console.log(`[INFO]: Processing file ${xmlFilePath}`);

          const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');
          const parser = new XMLParser();

          const result = XMLValidator.validate(xmlFilePath);
          if (result === true) {
            console.log(`XML file is valid`, result);
          }

          if (result.err) {
            console.log(`XML is invalid becuause of - ${result.err.msg}`, result);
          }

          const jsonData = parser.parse(xmlContent, { object: true });
          console.log(`[INFO]: Parsed JSON data for file ${xmlFilePath}:`, jsonData);

          // Defensive checks: Ensure each property exists before accessing
          const bill = jsonData.bill || {};
          console.log(`[INFO]: Parsed data for bill:`, bill);
          const billData = {
            congress: bill.congress ? bill.congress[0] : 'Unknown',
            billNumber: bill.number ? bill.number[0] : 'Unknown',
            originChamber: bill.originChamber ? bill.originChamber[0] : 'Unknown',
            type: bill.type ? bill.type[0] : 'Unknown',
            title: bill.title ? bill.title[0] : 'No Title Provided',
            introducedDate: bill.introducedDate ? bill.introducedDate[0] : 'Unknown',
            updateDate: bill.updateDate ? bill.updateDate[0] : 'Unknown',
            sponsors: bill.sponsors ? bill.sponsors[0]?.item.map(sponsor => ({
              bioguideId: sponsor.bioguideId ? sponsor.bioguideId[0] : 'Unknown',
              fullName: sponsor.fullName ? sponsor.fullName[0] : 'Unknown',
              party: sponsor.party ? sponsor.party[0] : 'Unknown',
              state: sponsor.state ? sponsor.state[0] : 'Unknown',
            })) : [],
            actions: bill.actions ? bill.actions[0]?.item.map(action => ({
              actionDate: action.actionDate ? action.actionDate[0] : 'Unknown',
              text: action.text ? action.text[0] : 'No Text Provided',
              type: action.type ? action.type[0] : 'Unknown',
            })) : [],
          };

          // Example output to see what's inside billData
          logger.info(`Parsed data for bill ${billData.type} ${billData.billNumber}: ${JSON.stringify(billData, null, 2)}`);
          console.log(`[INFO]: Parsed data for bill ${billData.type} ${billData.billNumber}:`, billData);

          // Assume the MongoDB insert happens here:
          // const result = await collection.insertOne(billData);
          // For now, simulate a success message:
          logger.info(`Inserted data for file ${xmlFilePath}, MongoDB document ID: MOCKED_ID`);
          console.log(`[INFO]: Inserted data for file ${xmlFilePath}, MongoDB document ID: MOCKED_ID`);

        } catch (fileError) {
          logger.error(`Failed to process file ${xmlFilePath}: ${fileError.message}`);
          console.error(`[ERROR]: Failed to process file ${xmlFilePath}: ${fileError.message}`);
        }
      } else {
        logger.info(`No XML file found in folder: ${folder}`);
        console.log(`[INFO]: No XML file found in folder: ${folder}`);
      }
    }

  } catch (error) {
    logger.error(`Unexpected error during file processing: ${error.message}`);
    console.error(`[ERROR]: Unexpected error during file processing: ${error.message}`);
  } finally {
    logger.info('Completed XML parsing process.');
    console.log('[INFO]: Completed XML parsing process.');
  }
}

// Execute the function
processXmlFiles()
  .then(() => {
    logger.info('XML files processed successfully.');
    console.log('[INFO]: XML files processed successfully.');
  })
  .catch((error) => {
    logger.error(`Error processing XML files: ${error.message}`);
    console.error(`[ERROR]: Error processing XML files: ${error.message}`);
  });
