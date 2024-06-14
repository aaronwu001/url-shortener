require("dotenv").config();

// Import required modules
const mongoose = require('mongoose');
const UrlModel = require('./src/models/url.js'); // Adjust the path as needed

const youtubeUrl = new UrlModel({ original_url: "www.youtube.com", short_url: "1234"});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB.');

    // Save the document
    return youtubeUrl.save();
})
.then((doc) => {
    console.log('Saved document:', doc);
})
.catch((err) => {
    console.error('Error saving document:', err);
})
.finally(() => {
    // Close the connection after operations (optional)
    mongoose.disconnect()
    .then(() => console.log('Disconnected from MongoDB.'))
    .catch((err) => console.error('Error disconnecting from MongoDB:', err));
});