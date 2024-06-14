// Import required modules
const mongoose = require('mongoose');
const Url = require('./src/models/url.js'); // Adjust the path as needed
const db = require('./db.js');

const youtubeUrl = "www.youtube.com";
// db.createAndSaveUrl(youtubeUrl);

db.findUrl(youtubeUrl)
.then((urlJsonDoc) => {
    const { original_url, short_url } = urlJsonDoc;
    console.log({original_url, short_url});
})
console.log('hi');

// const {original_url, short_url} = urlJsonDoc;
