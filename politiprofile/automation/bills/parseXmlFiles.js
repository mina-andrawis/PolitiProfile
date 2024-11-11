const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');
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

    console.log('DATA_DIRECTORY: ', DATA_DIRECTORY);

    // Get all folders (e.g., hr1, hr2, etc.)
    const subFolders = fs.readdirSync(DATA_DIRECTORY).filter(folder => {
      return fs.lstatSync(path.join(DATA_DIRECTORY, folder)).isDirectory();
    });

    if (subFolders.length === 0) {
      logger.info(`No subfolders found in the directory: ${DATA_DIRECTORY}`);
      console.log(`[INFO]: No subfolders found in the directory: ${DATA_DIRECTORY}`);
      return;
    }

    // Iterate through each subfolder and look for XML files
    for (const subFolder of subFolders) {
      const folderPath = path.join(DATA_DIRECTORY, subFolder);
      logger.info(`Processing folder ${subFolder}`);
      console.log(`[INFO]: Processing folder ${subFolder}`);

      const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.xml'));

      if (files.length === 0) {
        logger.info(`No XML files found in the directory: ${folderPath}`);
        console.log(`[INFO]: No XML files found in the directory: ${folderPath}`);
        continue;
      }

      logger.info(`Found ${files.length} XML files in folder ${subFolder}`);
      console.log(`[INFO]: Found ${files.length} XML files in folder ${subFolder}`);
      
      for (const file of files) {
        try {
          logger.info(`Processing file ${file}`);
          console.log(`[INFO]: Processing file ${file}`);
          
          const xmlFilePath = path.join(folderPath, file);
          const xmlContent = fs.readFileSync(xmlFilePath, 'utf-8');
          const jsonData = await parseStringPromise(xmlContent);

          // Prepare data to insert into MongoDB (replace with your actual MongoDB insert logic)
          const billData = {
            congress: jsonData.bill.congress[0],
            billNumber: jsonData.bill.number[0],
            originChamber: jsonData.bill.originChamber[0],
            type: jsonData.bill.type[0],
            title: jsonData.bill.title[0],
            introducedDate: jsonData.bill.introducedDate[0],
            updateDate: jsonData.bill.updateDate[0],
          };

          // Assume the MongoDB insert happens here:
          // const result = await collection.insertOne(billData);
          // Uncomment and use a dummy success message for now:
          logger.info(`Inserted data for file ${file}, MongoDB document ID: MOCKED_ID`);
          console.log(`[INFO]: Inserted data for file ${file}, MongoDB document ID: MOCKED_ID`);

        } catch (fileError) {
          logger.error(`Failed to process file ${file}: ${fileError.message}`);
          console.error(`[ERROR]: Failed to process file ${file}: ${fileError.message}`);
        }
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
