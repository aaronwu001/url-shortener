let mongoose = require('mongoose');

let urlSchema = new mongoose.Schema({
    original_url: {
        type: String, 
        required: true
    }, 
    short_url: {
        type: String, 
        required: true, 
        unique: true
    }
});

const Url = mongoose.model('UrlModel', urlSchema);

module.exports = Url;