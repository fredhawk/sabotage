'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const request = require('request');
const mongoose = require('mongoose');

const Resource = require('./models/resource');
const handleCommands = require('./commands/handleCommands');

const PORT = process.env.PORT || 8080;

// Url to database hosted at mlabs.com
var dbUrl = 'mongodb://sabotage:sabotage@ds055832.mlab.com:55832/sabotage';

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

app.get('/slack', (req, res) => {
  if (!req.query.code) {
    // access denied
    res.redirect('https://sabotage-rhinos.herokuapp.com/');
    return;
  }
  let data = {
    form: {
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
      code: req.query.code
    }
  };
  request.post('https://slack.com/api/oauth.access', data, function(
    error,
    response,
    body
  ) {
    if (!error && response.statusCode == 200) {
      // Get an auth token
      let token = JSON.parse(body).access_token;

      // Get the team domain name to redirect to the team URL after auth
      request.post(
        'https://slack.com/api/team.info',
        { form: { token: token } },
        function(error, response, body) {
          if (!error && response.statusCode == 200) {
            if (JSON.parse(body).error == 'missing_scope') {
              res.send(`Sabotage resource bot has been added to your team!`);
            } else {
              let team = JSON.parse(body).team.domain;
              res.redirect(`http://slack.com`);
            }
          }
        }
      );
    }
  });
});

// Route to website
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Bot route
app.post('/', (req, res) => {
  let text = req.body.text;

  const message = req.body.text.split(` `);

  handleCommands(message).then(data => {
    res.json(data);
  });
});
