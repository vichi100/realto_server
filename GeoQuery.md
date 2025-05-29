const mongoose = require("mongoose");
const Property = require("./models/propertyModel"); // Adjust the path to your model file

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/your-database-name", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Array of locations (coordinates) to search around
const locations = [
  [72.1234, 18.5678], // First location
  [72.1245, 18.5689], // Second location
  [72.1256, 18.5690], // Third location
];

// Convert 5 miles to radians (Earth's radius is approximately 3963.2 miles)
const radiusInMiles = 5;
const radiusInRadians = radiusInMiles / 3963.2;

// Create an array of geospatial queries for each location
const locationQueries = locations.map((coordinates) => ({
  location: {
    $geoWithin: {
      $centerSphere: [coordinates, radiusInRadians],
    },
  },
}));

// Combined query with multiple locations and other filters
const query = {
  $or: locationQueries, // Check if the property is near any of the locations
  property_type: "residential", // Filter by property_type
  property_for: "", // Empty filter (can be customized)
  property_status: "1", // Filter by property_status
  "property_address.city": "", // Empty filter (can be customized)
  "property_details.bhk_type": "2 BHK", // Filter by bhk_type
  "rent_details.expected_rent": {
    $gte: 15000, // Greater than or equal to 15000
    $lte: 20000, // Less than or equal to 20000
  },
  "rent_details.available_from": "", // Empty filter (can be customized)
};

// Execute the query
Property.find(query)
  .then((properties) => {
    console.log("Matching properties:", properties);
  })
  .catch((error) => {
    console.error("Error fetching properties:", error);
  })
  .finally(() => {
    mongoose.connection.close(); // Close the connection
  });




  ###     BELOW IS SAMPLE DATA  #######






  {
  property_id: "12345",
  agent_id: "67890",
  property_type: "residential",
  property_for: "rent",
  property_status: "1",
  is_close_successfully: "no",
  owner_details: {
    name: "John Doe",
    mobile1: "1234567890",
    mobile2: "",
    address: "123 Main St"
  },
  location: {
    type: "Point",
    coordinates: [72.1235, 18.5679] // Slightly different from the center coordinates
  },
  property_address: {
    city: "Mumbai",
    main_text: "Near XYZ Mall",
    formatted_address: "123 Main St, Mumbai",
    flat_number: "101",
    building_name: "ABC Apartments",
    landmark_or_street: "Near XYZ Mall",
    pin: "400001"
  },
  property_details: {
    house_type: "Apartment",
    bhk_type: "2 BHK",
    washroom_numbers: "2",
    furnishing_status: "Furnished",
    parking_type: "Covered",
    parking_number: "1",
    property_age: "5",
    floor_number: "3",
    total_floor: "10",
    lift: "Yes",
    property_size: "1000 sqft"
  },
  rent_details: {
    expected_rent: "18000",
    expected_deposit: "90000",
    available_from: "2023-10-01",
    preferred_tenants: "Family",
    non_veg_allowed: "No"
  },
  sell_details: {
    expected_sell_price: "",
    maintenance_charge: "",
    available_from: "",
    negotiable: ""
  },
  image_urls: [],
  reminders: [],
  create_date_time: new Date(),
  update_date_time: new Date()
}



###### Query to find customer who have same name and have location around 5km #####



const mongoose = require('mongoose');
const Customer = require('./models/Customer'); // Import Customer model
const Location = require('./models/Location'); // Import Location model

async function findCustomersByNameAndLocation(name, coordinates, maxDistance) {
  try {
    const results = await Customer.aggregate([
      // Step 1: Match customers by name
      {
        $match: {
          name: name, // Filter by name
        },
      },
      // Step 2: Join the Location collection
      {
        $lookup: {
          from: 'locations', // Name of the Location collection
          localField: '_id', // Field from Customer collection
          foreignField: 'customer_id', // Field from Location collection
          as: 'locations', // Output array field
        },
      },
      // Step 3: Unwind the locations array (one document per location)
      {
        $unwind: '$locations',
      },
      // Step 4: Filter locations within 5 km of the given coordinates
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: coordinates, // Center point
          },
          distanceField: 'distance', // Add a field to store the distance
          maxDistance: maxDistance, // 5 km in meters
          spherical: true, // Use spherical geometry
          query: { 'locations.location': { $exists: true } }, // Ensure location exists
          key: 'locations.location', // Geospatial field to query
        },
      },
      // Step 5: Group results by customer
      {
        $group: {
          _id: '$_id', // Group by customer ID
          name: { $first: '$name' }, // Include customer name
          email: { $first: '$email' }, // Include customer email
          locations: { $push: '$locations' }, // Include matching locations
        },
      },
    ]);

    if (results.length === 0) {
      console.log('No customers found with the specified criteria.');
      return;
    }

    // Step 6: Return the results
    console.log('Customers:', results);
    return results;
  } catch (error) {
    console.error('Error finding customers:', error);
  }
}

// Example usage
const name = 'vichi';
const coordinates = [72.81703279999999, 19.1246969]; // [longitude, latitude]
const maxDistance = 5000; // 5 km in meters

findCustomersByNameAndLocation(name, coordinates, maxDistance);



Processing collection: residential_customer_buys
Processing collection: commercial_customer_buys
Processing collection: commercial_customer_rent_locations
Processing collection: residential_customer_rent_locations
Processing collection: residential_property_sells
Processing collection: commercial_customer_buy_locations
Processing collection: commercial_property_sells
Processing collection: reminders
Processing collection: residential_customer_rents
Processing collection: commercial_customer_rents
Processing collection: residential_property_rents
Processing collection: commercial_property_rents


commercial_buy_customer_matches
commercial_buy_property_matches






commercial_rent_customer_matches
commercial_rent_property_matches

residential_buy_customer_matches
residential_buy_property_matches
residential_customer_buy_locations





residential_rent_customer_matches
residential_rent_property_matches
users