// Import the MongoClient from the mongodb package
const { MongoClient } = require('mongodb');
// Import the Node.js file system module for reading and writing files
const fs = require('fs');
// Import the Node.js path module for resolving file paths
const path = require('path');

// --- Configuration ---
// MongoDB connection URI. Replace with your actual MongoDB connection string.
// Example: 'mongodb://localhost:27017' for a local instance
// Example: 'mongodb+srv://user:password@cluster.mongodb.net/testdb' for MongoDB Atlas
const MONGODB_URI =  "mongodb://realto:realto123@207.180.239.115:27017/realtodb"
// The name of the database you want to backup/restore
const DB_NAME = 'realtodb'; // <--- IMPORTANT: Change this to your database name

// The name of the file where data will be stored
const BACKUP_FILE_NAME = 'mongodb_backup.json';
// Resolve the full path for the backup file
const BACKUP_FILE_PATH = path.join(__dirname, BACKUP_FILE_NAME);

/**
 * Connects to MongoDB.
 * @returns {Promise<Db>} A promise that resolves to the MongoDB database object.
 */
async function connectToMongo() {
    const client = new MongoClient(MONGODB_URI); // Removed deprecated options
    try {
        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        console.log('Successfully connected to MongoDB!');
        return client.db(DB_NAME);
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        throw error; // Re-throw to propagate the error
    }
}

/**
 * Exports all data from all collections in the specified database to a JSON file.
 */
async function exportData() {
    let client;
    try {
        const db = await connectToMongo();
        client = db.client; // Get the client instance to close it later

        console.log(`Exporting data from database: ${DB_NAME}`);

        try {
            const collections = await db.listCollections().toArray();
            const collectionNames = collections.map(c => c.name);

            const dataToExport = {};

            for (const collectionName of collectionNames) {
                if (collectionName.startsWith('system.')) {
                    console.log(`Skipping system collection: ${collectionName}`);
                    continue;
                }
                console.log(`Fetching data from collection: ${collectionName}`);
                const collection = db.collection(collectionName);
                const documents = await collection.find({}).toArray();
                dataToExport[collectionName] = documents;
                console.log(`Fetched ${documents.length} documents from ${collectionName}.`);
            }

            fs.writeFileSync(BACKUP_FILE_PATH, JSON.stringify(dataToExport, null, 2), 'utf8');
            console.log(`Data successfully exported to ${BACKUP_FILE_PATH}`);
        } catch (authError) {
            if (authError.codeName === 'Unauthorized') {
                console.error('Authorization error: Ensure the MongoDB user has the required permissions to list collections.');
                console.error('Please grant the user the "read" role on the database or check the connection string credentials.');
            } else {
                console.error('An unexpected error occurred:', authError);
            }
            throw authError;
        }
    } catch (error) {
        console.error('Error during data export:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed after export.');
        }
    }
}

/**
 * Imports data from a JSON file back into the specified MongoDB database.
 * This function will drop existing collections before inserting new data to ensure a clean restore.
 * Be cautious when using this in production environments!
 */
async function importData() {
    let client;
    try {
        // Read the data from the backup file
        if (!fs.existsSync(BACKUP_FILE_PATH)) {
            console.error(`Backup file not found at: ${BACKUP_FILE_PATH}. Please run exportData() first.`);
            return;
        }
        const fileContent = fs.readFileSync(BACKUP_FILE_PATH, 'utf8');
        const dataToImport = JSON.parse(fileContent);

        const db = await connectToMongo();
        client = db.client; // Get the client instance to close it later

        console.log(`Importing data into database: ${DB_NAME}`);

        // Iterate over the data and insert into respective collections
        for (const collectionName in dataToImport) {
            if (dataToImport.hasOwnProperty(collectionName)) {
                const documents = dataToImport[collectionName];
                const collection = db.collection(collectionName);

                console.log(`Processing collection: ${collectionName}`);

                // !!! WARNING !!!
                // Drop the collection to ensure a clean import.
                // In a real-world scenario, you might want to handle this more carefully
                // (e.g., only drop if confirmed, or use upserts for updates).
                const collectionExists = await db.listCollections({ name: collectionName }).hasNext();
                if (collectionExists) {
                    console.log(`Dropping existing collection: ${collectionName}`);
                    await collection.drop();
                }

                if (documents.length > 0) {
                    console.log(`Inserting ${documents.length} documents into ${collectionName}.`);
                    // Insert many documents. Use { ordered: false } for better performance if order doesn't matter
                    // and you want to continue inserting even if some documents fail.
                    await collection.insertMany(documents, { ordered: false });
                    console.log(`Successfully inserted documents into ${collectionName}.`);
                } else {
                    console.log(`No documents to insert for collection: ${collectionName}.`);
                }
            }
        }

        console.log('Data import process completed.');

    } catch (error) {
        console.error('Error during data import:', error);
    } finally {
        if (client) {
            await client.close();
            console.log('MongoDB connection closed after import.');
        }
    }
}

// --- Main execution logic ---
// You can uncomment one of the following lines to run either export or import.
// For a full cycle, you would run exportData() first, then importData().

// To export data:
exportData();

// To import data (make sure you have a backup file first):
// importData();

// Example of how you might run both sequentially (for testing, be careful with data!):
/*
(async () => {
    console.log('--- Starting Export Process ---');
    await exportData();
    console.log('\n--- Starting Import Process ---');
    // It's often good practice to ensure the export is fully done before importing,
    // especially if you're dropping collections.
    await importData();
    console.log('\n--- All processes finished ---');
})();
*/
