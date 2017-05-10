'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT;

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
const commands = [
  {
    command: `help`,
    description: `Shows the available commands and how to use them.`,
    usage: `/hidi help`
  },
  {
    command: `add`,
    description: `Adds a resource to the bot.`,
    usage: `/hidi add category url "Resource title"`
  },
  {
    command: `search`,
    description: `Search for something and see what comes up.`,
    usage: `/hidi search "searchterm"`
  }
];

const categories = [
  `Javascript`,
  `Design`,
  `Typography`,
  `ReactJS`,
  `SVG`,
  `Angular`,
  `Vue`,
  `jQuery`,
  `PHP`,
  `CSS`,
  `HTML`,
  `Java`,
  `Python`,
  `Node`,
  `Tools`,
  `Hardware`,
  `Chat bots`
];

app.post('/', (req, res) => {
  let text = req.body.text;
  // console.log(req.body);
  const message = req.body.text.split(` `);
  console.log(message);
  switch (message[0]) {
    case `add`:
      const [command, category, link, ...linkTitle] = message;
      console.log(`category`, category);
      console.log(`link`, link);
      console.log(`rest`, linkTitle);
      res.json(`Adding!`);
      break;
    case `search`:
      const [first, ...searchterm] = message;
      console.log(`searchterm`, searchterm);
      res.json(`Searching!`);
      break;
    case `help`:
      res.json(`Help please!`);
      break;
    default:
      res.json(`Not Working!`);
      break;
  }
});
