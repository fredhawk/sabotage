'use strict';
// Docs https://www.npmjs.com/package/node-metainspector
const MetaInspector = require('node-metainspector');
const Resource = require('../models/resource');

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

// Example categories
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

const handleCommand = message => {
  switch (message[0]) {
    case `add`:
      return new Promise((resolve, reject) => {
        resolve(addResource(message))
      });
    case `search`:  
      return new Promise((resolve, reject) => {
        resolve(findResource(message))
      })
      // respond with the search result, how many results should be returned?
    case `help`:
      // map over the commands object and output a response with all the commands information
      return `Help please!`;
    default:
      return new Promise((resolve, reject) => {
        resolve({
          response_type: 'ephemeral',
          attachments: [{
            title: "Unknown Command",
            text: "Try '/[bot-name] help' for available commands."
          }]
        });
      })
  }
};

function addResource(message) {
  const [command, url, ...linkTitle] = message;
  // Make check so the inputs aren't malicious code.
  // console.log(`category`, category);
  console.log(`link`, url);
  console.log(`rest`, linkTitle);

  const buildQuery = () => {
    return new Promise((resolve, reject) => {
      var client = new MetaInspector(url, { timeout: 5000 });
      client.on("fetch", function(){
        let query = {
          title: client.title,
          url,
          description: linkTitle.join(' '),
        }
        
        resolve(query)
      });

      client.fetch()
    })
  }
  
  buildQuery().then((query) => {
    Resource.create(query)
      .then(() => Resource.findOne(query))
      .then((resource) => {
        let data = {
          response_type: 'ephemeral',
          text: 'Results',
          attachments: [
            {
              title: resource.title,
              text: resource.url + '\n' + resource.description
            }
          ]
        }

        resolve(data)
      });
  })
}

function findResource(message) {
  const [first, ...searchterm] = message;
  // check the database for the searchterm matching
  console.log(`searchterm`, searchterm);

  return Resource.find({
    $text: { $search: searchterm.join(' ')}
  })
    .then((resources) => {
      let data = {
        response_type: 'ephemeral',
        text: 'Results',
        attachments: resources.map((resource) => {
          return {
            title: resource.title,
            text: resource.url + '\n' + resource.description
          }
        })
      }
      
      return(data)
    });
}

module.exports = handleCommand;
