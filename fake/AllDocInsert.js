const { mongo } = require("mongoose");
const mongoose = require("mongoose");
const fs = require('fs');

// 1) connect to mongo db
const MONGO_URI = 'mongodb://realto:realto123@207.180.239.115:27017/realtodb';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to MongoDB");
}).catch(err => {
  console.error("MongoDB connection error:", err);
  process.exit(1);
});

// 2) check all the collections in the db
mongoose.connection.on('open', async () => {
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log('Collections:', collections.map(c => c.name));

  // 3) fetch data from the collection save it in a variable so that we can use it in future even when data is deleted
  const data = {};
//   for (const collection of collections) {
//     data[collection.name] = await mongoose.connection.db.collection(collection.name).find({}).toArray();
//   }
//   console.log('Data:', data);

//   // Save data to a file
//   fs.writeFileSync('/Users/vichirajan/Documents/realto/realto_server/fake/backup.json', JSON.stringify(data, null, 2));
//   console.log('Data saved to backup.json');

  // Read data from the file  /Users/vichirajan/Documents/realto/realto_server/fake/AllDocInsert.js
  const fileData = JSON.parse(fs.readFileSync('/Users/vichirajan/Documents/realto/realto_server/fake/backup.json', 'utf8'));

  // Remove duplicate data
  const uniqueData = {};
  for (const [collectionName, documents] of Object.entries(fileData)) {
    const uniqueDocuments = [];
    const seen = new Set();
    for (const document of documents) {
      const id = JSON.stringify(document);
      if (!seen.has(id)) {
        seen.add(id);
        uniqueDocuments.push(document);
      }
    }
    uniqueData[collectionName] = uniqueDocuments;
  }

  // Save the unique data back to the file
  fs.writeFileSync('/Users/vichirajan/Documents/realto/realto_server/fake/backup.json', JSON.stringify(uniqueData, null, 2));
  console.log('Duplicate data removed and saved to backup.json');

  // 4) create a function to insert data in the collection
  async function insertData(collectionName, document) {
    try {
      const result = await mongoose.connection.db.collection(collectionName).insertOne(document);
      console.log('Document inserted:', result);
    } catch (err) {
      console.error('Error inserting document:', err);
    }
  }

  // Insert data from the file into each collection
  for (const [collectionName, documents] of Object.entries(uniqueData)) {
    for (const document of documents) {
      await insertData(collectionName, document);
    }
  }

  console.error('All Data inserted:');

  // Example usage:
  // insertData('yourCollectionName', { key: 'value' });
});