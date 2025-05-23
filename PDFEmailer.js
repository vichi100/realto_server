// Import necessary modules
const mongoose = require('mongoose'); // For MongoDB interaction
const PDFDocument = require('pdfkit'); // For PDF generation
const nodemailer = require('nodemailer'); // For sending emails
const fs = require('fs'); // For file system operations (saving PDF temporarily)
const path = require('path'); // For path manipulation

// --- Configuration ---
// IMPORTANT: Replace these with your actual credentials and details
const MONGODB_URI = 'mongodb://localhost:27017/your_database_name'; // Your MongoDB connection string
const SENDER_EMAIL = 'your_email@example.com'; // Your email address
const SENDER_PASSWORD = 'your_email_password'; // Your email password or app-specific password
const RECIPIENT_EMAIL = 'recipient@example.com'; // The email address to send the PDF to

// --- MongoDB Schema (Example) ---
// Define a simple schema for your data in MongoDB.
// Adjust this schema to match the structure of your actual data.
const DataSchema = new mongoose.Schema({
    name: String,
    value: Number,
    description: String,
    createdAt: { type: Date, default: Date.now }
});

const DataModel = mongoose.model('YourDataCollection', DataSchema);

// --- Main Function to Orchestrate the Process ---
async function generatePdfAndSendEmail() {
    try {
        // 1. Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully.');

        // 2. Get Data from MongoDB
        console.log('Fetching data from MongoDB...');
        // Example: Fetch all documents from 'YourDataCollection'
        // You can add filters, sorts, limits here as per your requirement.
        const data = await DataModel.find({});
        if (data.length === 0) {
            console.log('No data found in MongoDB to generate PDF.');
            return;
        }
        console.log(`Fetched ${data.length} records.`);

        // Define the path where the PDF will be temporarily saved
        const pdfFileName = `report_${Date.now()}.pdf`;
        const pdfFilePath = path.join(__dirname, pdfFileName);

        // 3. Create PDF using the fetched data
        console.log('Generating PDF...');
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(pdfFilePath);
        doc.pipe(stream);

        // Add content to the PDF
        doc.fontSize(25).text('Data Report from MongoDB', { align: 'center' });
        doc.moveDown();

        data.forEach((item, index) => {
            doc.fontSize(16).text(`Record ${index + 1}:`);
            doc.fontSize(12).text(`  Name: ${item.name}`);
            doc.text(`  Value: ${item.value}`);
            doc.text(`  Description: ${item.description || 'N/A'}`);
            doc.text(`  Created At: ${item.createdAt.toLocaleString()}`);
            doc.moveDown();
        });

        doc.end(); // Finalize the PDF

        // Wait for the PDF to be fully written to the file
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });
        console.log(`PDF generated and saved to ${pdfFilePath}`);

        // 4. Attach this PDF in Mail and Send
        console.log('Configuring email transporter...');
        const transporter = nodemailer.createTransport({
            service: 'gmail', // You can use other services like 'outlook', 'yahoo', or custom SMTP
            auth: {
                user: SENDER_EMAIL,
                pass: SENDER_PASSWORD,
            },
        });

        const mailOptions = {
            from: SENDER_EMAIL,
            to: RECIPIENT_EMAIL,
            subject: 'MongoDB Data Report PDF',
            text: 'Please find attached the PDF report generated from MongoDB data.',
            attachments: [
                {
                    filename: pdfFileName,
                    path: pdfFilePath,
                    contentType: 'application/pdf',
                },
            ],
        };

        console.log('Sending email...');
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: %s', info.messageId);

        // 5. Clean up: Delete the temporary PDF file
        fs.unlink(pdfFilePath, (err) => {
            if (err) {
                console.error('Error deleting temporary PDF file:', err);
            } else {
                console.log('Temporary PDF file deleted.');
            }
        });

    } catch (error) {
        console.error('An error occurred:', error);
    } finally {
        // Disconnect from MongoDB
        if (mongoose.connection.readyState === 1) {
            await mongoose.disconnect();
            console.log('MongoDB disconnected.');
        }
    }
}

// Call the main function to start the process
generatePdfAndSendEmail();

/*
    To run this program:

    1.  **Install Node.js:** If you don't have it, download and install it from nodejs.org.

    2.  **Initialize a Node.js project:**
        Open your terminal or command prompt, navigate to your desired directory, and run:
        `npm init -y`

    3.  **Install required packages:**
        `npm install mongoose pdfkit nodemailer`

    4.  **MongoDB Setup:**
        * Ensure you have a MongoDB instance running (e.g., locally or a cloud service like MongoDB Atlas).
        * Create a database and a collection.
        * Insert some sample data into your collection that matches the `DataSchema` defined in the code.
            Example data you can insert into your `your_database_name.your_data_collection` collection:
            ```json
            [
              { "name": "Product A", "value": 100, "description": "Description for Product A" },
              { "name": "Product B", "value": 250, "description": "Description for Product B" },
              { "name": "Product C", "value": 75, "description": "Description for Product C" }
            ]
            ```

    5.  **Email Setup (Gmail Specific):**
        * If using Gmail, you might need to enable "Less secure app access" (though Google is phasing this out) or, more securely, generate an "App password" for your Gmail account.
            * Go to your Google Account.
            * Click on "Security" in the left navigation panel.
            * Under "How you sign in to Google," click "2-Step Verification." (If it's off, you'll need to turn it on).
            * Scroll down and click "App passwords."
            * Follow the instructions to generate a new app password. This 16-character password is what you'll use for `SENDER_PASSWORD`.

    6.  **Update Configuration:**
        * Replace `MONGODB_URI`, `SENDER_EMAIL`, `SENDER_PASSWORD`, and `RECIPIENT_EMAIL` with your actual values.

    7.  **Save the code:** Save the code above as a `.js` file (e.g., `app.js`).

    8.  **Run the program:**
        `node app.js`

    The program will connect to MongoDB, fetch data, create a PDF, and send it to the specified recipient email.
*/
