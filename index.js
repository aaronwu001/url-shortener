require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const dns = require('dns');

const db = require('./db.js');

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
app.post('/api/shorturl', verifyUrl, async (req, res) => {
  const url = req.body.url;
  console.log('Received URL:', url);

  try {
    const jsonDoc = await db.findUrl(url);
    if (jsonDoc) {
      const { original_url, short_url } = jsonDoc;
      console.log('Found document:', { original_url, short_url });
      res.json({ original_url, short_url });
    } else {
      const savedUrl = await db.createAndSaveUrl(url);
      const { original_url, short_url } = savedUrl;
      console.log('Saved new URL:', { original_url, short_url });
      res.json({ original_url, short_url });
    }
  } catch (err) {
    console.error('Error handling the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/shorturl/:url', async (req, res) => {
  const url = req.params.url;
  try {
    const jsonDoc = await db.findUrl(url);
    if (jsonDoc) {
      const { original_url, short_url } = jsonDoc;
      console.log('Found document:', { original_url, short_url });
      res.redirect(original_url);
    } else {
      res.status(404).send('Not Found'); // 404 Not Found response with 'Not Found' message
    }
  } catch (err) {
    console.error('Error handling the request:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
