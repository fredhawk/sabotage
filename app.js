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
app.post('/', (req, res) => {
  let text = req.body.text;
  // console.log(req.body);
  const message = req.body.text.split(' ');
  console.log(message);
  switch (message[0]) {
    case 'add':
      res.json('Working!');
    case `help`:
      res.json(`Help please!`);
    default:
      res.json('Not Working!');
  }
});
