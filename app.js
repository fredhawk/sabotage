'use strict'

const express = require('express');
const bodyParser = require('body-parser');

const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const server = app.listen(PORT, () => {
  console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
app.post('/', (req, res) => {
  let text = req.body.text;
  console.log(req.body);
  // What follows are example of response
  if (! /^\d+$/.test(text)) {
    res.send('U R doing it wrong. Enter a status code like 200!')
    return;
  }
  let data = {
    response_type: 'ephemeral',
    text: '302: Found',
    attachments: [
      {
        image_url: 'https://http.cat/302.jpg'
      }
    ]
  }
  // end of example
  res.json(data)
})
