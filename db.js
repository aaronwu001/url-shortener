require("dotenv").config();

// Import required modules
const mongoose = require('mongoose');
const Url = require('./src/models/url.js'); // Adjust the path as needed
const shortid = require('shortid'); // used for shortening url

mongoose.connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
});

const createAndSaveUrl = async (url) => {
    const shortUrl = shortid.generate(); // generate a unique identifier
    const newUrl = new Url({ original_url: url, short_url: shortUrl});
    newUrl.save()
    .then((doc) => {
        console.log('Saved document:', doc);
        disconnectFromDb();
    })
    .catch((err) => {
        console.error('Error saving document:', err);
        disconnectFromDb();
    });
};

const findUrl = (url) => {
    return Url.findOne({"original_url": url})
    .then((doc) => {
        if (doc) {
            jsonDoc = doc.toJSON();
            console.log('Document as JSON: ', jsonDoc);
            disconnectFromDb();
            return jsonDoc;
        } else {
            console.log('No document found with the given short URL');
            disconnectFromDb();
            return null;
        }
    })
}

const disconnectFromDb = () => {
    mongoose.disconnect()
    .then(() => console.log('Disconnected from MongoDB.'))
    .catch((err) => console.error('Error disconnecting from MongoDB:', err));
}

exports.createAndSaveUrl = createAndSaveUrl;
exports.findUrl = findUrl;

// createAndSaveURl(youtubeUrl);