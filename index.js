require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const dns = require('dns');

// // connect to mongoose
// const mongoose = require('mongoose');
// main().catch(err => console.log(err));
// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/test', { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Database connection successful');
//   })
//   .catch((err) => {
//     console.error('Database connection error');
//   });
// }

app.use(cors());

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// DNS middleware function
function verifyUrl (req, res, next) {

  const url = req.body.url;
  let hostName;

  try {
    const parseUrl = new URL(url);
    hostName = parseUrl.hostname;
  } catch (error) {
    return res.json({ error: 'invalid url' });
  }

  dns.lookup(hostName, (err, address) => {
    if (err) {
      res.json({ error: 'invalid url' });
    } else {
      next();
    }
  });
};

// mounting the middleware to where the POST request goes to
app.post('/api/shorturl', verifyUrl);

app.post('/api/shorturl', (req, res) => {
  res.json({ original_url : req.body.url, short_url : "hi"});
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
