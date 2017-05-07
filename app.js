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
const commands = {
  help: {
    command: `help`,
    description: `Shows the available commands and how to use them.`,
    usage: `/hidi help`
  },
  add: {
    command: `add`,
    description: `Adds a resource to the bot.`,
    usage: `/hidi add category link`
  }
};
app.post('/', (req, res) => {
  let text = req.body.text;
  // console.log(req.body);
  const message = req.body.text.split(' ');
  console.log(message);
  switch (message[0]) {
    case 'add':
      const [category, link] = [message[1], message[2]];
      console.log(`category`, category);
      console.log(`link`, link);
      res.json('Working!');
      break;
    case `help`:
      res.json(`Help please!`);
      break;
    default:
      res.json('Not Working!');
      break;
  }
});
