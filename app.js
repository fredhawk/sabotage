'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const Resource = require('./models/resource');

const handleCommands = require('./commands/handleCommands');

const PORT = process.env.PORT || 8080;

// Url to database hosted at mlabs.com
var dbUrl = 'mongodb://sabotage:sabotage@ds055832.mlab.com:55832/sabotage';

// Use ES6 Promises
mongoose.Promise = global.Promise;

// Connect to database
mongoose.connect(dbUrl, (err, res) => {
  if (err) {
    console.log('DB CONNECTION FAILED: ' + err);
  } else {
    console.log('DB CONNECTION SUCCESS: ' + dbUrl);
  }
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const server = app.listen(PORT, () => {
  console.log(
    'Express server listening on port %d in %s mode',
    server.address().port,
    app.settings.env
  );
});

app.use(express.static(path.join(__dirname, 'public')));

// Route to website
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Bot route
app.post('/', (req, res) => {
  let text = req.body.text;

  // console.log(req.body);
  const message = req.body.text.split(` `);
  // console.log(message);

  handleCommands(message).then(data => {
    res.json(data);
  });
});
