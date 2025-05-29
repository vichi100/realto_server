const fs = require('fs');
const path = require('path');

// --- Configuration ---
const INPUT_FILE_NAME = 'mongodb_backup.json';
const OUTPUT_FILE_NAME = 'mongodb_backup_converted.json';

const INPUT_FILE_PATH = path.join(__dirname, INPUT_FILE_NAME);
const OUTPUT_FILE_PATH = path.join(__dirname, OUTPUT_FILE_NAME);

// Define the paths to fields that need type conversion
// This is based on your provided schema definitions and the structure in mongodb_backup.json
const CONVERSION_RULES = {
    // Collection: 'residential_customer_buys'
    "residential_customer_buys": {
        "customer_buy_details.expected_buy_price": "Number",
        "customer_buy_details.available_from": "Date",
        "customer_buy_details.maintenance_charge": "Number"
    },
    // Collection: 'commercial_customer_buys'
    "commercial_customer_buys": {
        "customer_buy_details.expected_buy_price": "Number",
        "customer_buy_details.available_from": "Date",
        "customer_buy_details.maintenance_charge": "Number" // Appears in some docs
    },
    // Collection: 'commercial_customer_rent_locations'
    "commercial_customer_rent_locations": {
        "customer_rent_details.expected_rent": "Number",
        "customer_rent_details.expected_deposit": "Number"
    },
    // Collection: 'residential_customer_rent_locations'
    "residential_customer_rent_locations": {
        "customer_rent_details.expected_rent": "Number",
        "customer_rent_details.expected_deposit": "Number",
        "customer_rent_details.available_from": "Date"
    },

    // Collection: 'residential_customer_buy_locations'
    "residential_customer_buy_locations": {
        "customer_buy_details.expected_buy_price": "Number",
        "customer_buy_details.maintenance_charge": "Number",
        "customer_buy_details.available_from": "Date"
    },

    // Collection: 'residential_property_sells'
    "residential_property_sells": {
        "sell_details.expected_sell_price": "Number",
        "sell_details.maintenance_charge": "Number",
        "sell_details.available_from": "Date"
    },
    // Collection: 'commercial_customer_buy_locations'
    "commercial_customer_buy_locations": {
        "customer_buy_details.expected_buy_price": "Number",
        "customer_buy_details.available_from": "Date",
        // "customer_buy_details.maintenance_charge": "Number" - not explicitly in your schema, but present in some docs
    },
    // Collection: 'commercial_property_sells'
    "commercial_property_sells": {
        "sell_details.expected_sell_price": "Number",
        "sell_details.maintenance_charge": "Number",
        "sell_details.available_from": "Date"
    },

    // Collection: 'commercial_property_rents'
    "commercial_property_rents": {
        "rent_details.expected_sell_price": "Number",
        "rent_details.maintenance_charge": "Number",
        "rent_details.available_from": "Date"
    },
    // Collection: 'residential_property_rents'
    "residential_property_rents": {
        "rent_details.expected_rent": "Number",
        "rent_details.expected_deposit": "Number",
        "rent_details.available_from": "Date"
    },
    // Collection: 'residential_customer_rents'
    "residential_customer_rents": {
        "customer_rent_details.expected_rent": "Number",
        "customer_rent_details.expected_deposit": "Number",
        "customer_rent_details.available_from": "Date"
    },
    // Collection: 'commercial_customer_rents'
    "commercial_customer_rents": {
        "customer_rent_details.expected_rent": "Number",
        "customer_rent_details.expected_deposit": "Number",
        "customer_rent_details.available_from": "Date"
    },
     // Collection: 'reminders'
    "reminders": {
        "meeting_date": "Date" // Assuming this needs to be a Date object too for proper handling
    }
    // Add other collections and their fields as needed based on your `mongodb_backup.json`
};

/**
 * Parses a string path to a nested object property.
 * Example: getNestedProperty(obj, "a.b.c") returns obj.a.b.c
 */
function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => (current && typeof current === 'object' ? current[key] : undefined), obj);
}

/**
 * Sets a nested object property.
 * Example: setNestedProperty(obj, "a.b.c", value) sets obj.a.b.c = value
 */
function setNestedProperty(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (i === parts.length - 1) {
            current[part] = value;
        } else {
            if (!current[part] || typeof current[part] !== 'object') {
                current[part] = {}; // Create nested object if it doesn't exist
            }
            current = current[part];
        }
    }
}

async function convertDataTypes() {
    try {
        if (!fs.existsSync(INPUT_FILE_PATH)) {
            console.error(`Error: Input file not found at ${INPUT_FILE_PATH}`);
            return;
        }

        const rawData = fs.readFileSync(INPUT_FILE_PATH, 'utf8');
        const jsonData = JSON.parse(rawData);

        const convertedData = {};

        for (const collectionName in jsonData) {
            if (jsonData.hasOwnProperty(collectionName) && CONVERSION_RULES[collectionName]) {
                console.log(`Processing collection: ${collectionName}`);
                convertedData[collectionName] = jsonData[collectionName].map(doc => {
                    const newDoc = { ...doc }; // Create a shallow copy

                    for (const fieldPath in CONVERSION_RULES[collectionName]) {
                        const targetType = CONVERSION_RULES[collectionName][fieldPath];
                        const currentValue = getNestedProperty(newDoc, fieldPath);

                        if (currentValue !== undefined && currentValue !== null) {
                            let convertedValue = currentValue;

                            switch (targetType) {
                                case "Number":
                                    // Attempt to convert string to Number
                                    convertedValue = Number(currentValue);
                                    if (isNaN(convertedValue)) {
                                        console.warn(`  Warning: Could not convert "${currentValue}" to Number for ${collectionName}.${fieldPath} in document ${doc._id}. Keeping as original value.`);
                                        convertedValue = currentValue; // Keep original if conversion fails
                                    }
                                    break;
                                case "Date":
                                    // Attempt to convert string to Date object
                                    const parsedDate = new Date(currentValue);
                                    if (isNaN(parsedDate.getTime())) {
                                        console.warn(`  Warning: Could not convert "${currentValue}" to Date for ${collectionName}.${fieldPath} in document ${doc._id}. Keeping as original value.`);
                                        convertedValue = currentValue; // Keep original if conversion fails
                                    } else {
                                        convertedValue = parsedDate;
                                    }
                                    break;
                                // Add more cases for other types if needed (e.g., Boolean, ObjectId if they are strings)
                            }
                            setNestedProperty(newDoc, fieldPath, convertedValue);
                        }
                    }
                    return newDoc;
                });
            } else {
                // If no conversion rules are defined for a collection, just copy it over
                convertedData[collectionName] = jsonData[collectionName];
            }
        }

        fs.writeFileSync(OUTPUT_FILE_PATH, JSON.stringify(convertedData, null, 2), 'utf8');
        console.log(`\nConversion complete! Converted data written to ${OUTPUT_FILE_PATH}`);

    } catch (error) {
        console.error('An error occurred during data conversion:', error);
    }
}

convertDataTypes();
