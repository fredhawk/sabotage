'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Resource = require('./models/resource');

const PORT = process.env.PORT;

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
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const server = app.listen(PORT, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});

app.post('/', (req, res) => {
  let text = req.body.text;
  text = text.split(' ');
  let operation = text[0]

  // Syntax 
  // /[bot-name] find [category]
  // /[bot-name] add [category] [url] [description]
  // I have seeded the database with some entries, try "/[bot-name] find react""

  switch (operation) {
    case 'find':
      findResource({
        category: text[1]
      });
      break;
    case 'add':
      addResource({
        category: text[1],
        url: text[2],
        description: text.slice(3).join(' '),
      });
      break;
    case 'help':
      getHelp()
      break;
    default:
      res.json({
        response_type: 'ephemeral',
        attachments: [{
          title: "Unknown Command",
          text: "Try '/[bot-name] help' for available commands."
        }]
      });
  }

  function findResource(query) {
    Resource.find(query)
      .then((resources) => {
        let data = {
          response_type: 'ephemeral',
          text: 'Results',
          attachments: resources.map((resource) => {
            return {
              title: resource.url,
              text: resource.description
            }
          })
        }

        res.json(data)
      });
  }

  function addResource(query) {
    Resource.create(query)
      .then(() => Resource.findOne(query))
      .then((resource) => {
        let data = {
          response_type: 'ephemeral',
          text: 'Results',
          attachments: [
            {
              title: resource.url,
              text: resource.description
            }
          ]
        }

        res.json(data)
      });
  }

  function getHelp() {
    res.json({
      text: 'To be implemented'
    });
  }

});
