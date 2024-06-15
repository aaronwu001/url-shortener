require("dotenv").config();

// Import required modules
const mongoose = require('mongoose');
const Url = require('./src/models/url.js'); // Adjust the path as needed
const shortid = require('shortid'); // used for shortening url

mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Failed to connect to MongoDB', err));

const createAndSaveUrl = async (url) => {

    const shortUrl = shortid.generate(); // generate a unique identifier
    const newUrl = new Url({ original_url: url, short_url: shortUrl});

    try {
        const savedUrl = await newUrl.save();
        console.log('Saved document:', savedUrl);
        return savedUrl.toJSON();
    } catch (err) {
        console.error('Error saving document:', err);
        throw err;
    }
};

const findUrl = async (url) => {

    try {
        const doc = await Url.findOne({ original_url: url });
        if (doc) {
            const jsonDoc = doc.toJSON();
            console.log('Document as JSON: ', jsonDoc);
            return jsonDoc;
        } else {
            console.log('No document found with the given short URL');
            return null;
        }
    } catch (err) {
        console.error('Error finding document:', err);
        throw err;
    }
};

const disconnectFromDb = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB.');
    } catch (err) {
        console.error('Error disconnecting from MongoDB:', err);
    }
};

module.exports = { createAndSaveUrl, findUrl, disconnectFromDb };