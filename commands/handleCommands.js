'use strict';
// Docs https://www.npmjs.com/package/node-metainspector
const MetaInspector = require('node-metainspector');
const Resource = require('../models/resource');

const commands = [
  {
    name: `Help command`,
    description: `Shows the available commands and how to use them.`,
    usage: `/[bot-name] help`
  },
  {
    name: `Add command`,
    description: `Adds a resource to the bot.`,
    usage: `/[bot-name] add url "Resource title"`
  },
  {
    name: `Search command`,
    description: `Search for something and see what comes up.`,
    usage: `/[bot-name] search "search term"`
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

const helpCommands = commands => {
  const attachments = [];
  commands.map(command => {
    attachments.push({
      fallback: `Required plain-text summary of the attachment.`,
      color: '#36a64f',
      title: `${command.name}`,
      text: `${command.description}\n ${command.usage}`
    });
  });
  return {
    response_type: `ephemeral`,
    text: `*Help instructions* \n A list of all the available commands.`,
    attachments
  };
};

const handleCommand = message => {
  switch (message[0]) {
    case `add`:
      return new Promise((resolve, reject) => {
        resolve(addResource(message));
      });
    case `search`:
      return new Promise((resolve, reject) => {
        resolve(findResource(message));
      });
    // respond with the search result, how many results should be returned?
    case `help`:
      return new Promise((resolve, reject) => {
        resolve(helpCommands(commands));
      });
    default:
      return new Promise((resolve, reject) => {
        resolve({
          response_type: 'ephemeral',
          attachments: [
            {
              color: 'danger',
              title: 'Unknown Command',
              text: "Try '/[bot-name] help' for available commands."
            }
          ]
        });
      });
  }
};

function addResource(message) {
  const [command, url, ...linkDescription] = message;

  if (!url) {
    let data = {
      response_type: 'ephemeral',
      text: 'URL is required',
    };

    return data;
  }

  if (linkDescription.length === 0) {
    let data = {
      response_type: 'ephemeral',
      text: 'Description is required',
    };

    return data;
  }

  const buildQuery = () => {
    return new Promise((resolve, reject) => {
      var client = new MetaInspector(url, { timeout: 5000 });
      // build a query
      // Use the metainspector to extract the page title from the supplied url and use it as a title
      client.on('fetch', function() {
        let query = {
          title: client.title,
          url,
          description: linkDescription.join(' ')
        };

        resolve(query);
      });

      client.fetch();
    });
  };

  return buildQuery().then(query => {
    // Create a database entry using the query
    return (
      Resource.create(query)
        // Return the created entry and forward it to slack.
        .then(() => Resource.findOne(query))
        .then(resource => {
          let data = {
            response_type: 'ephemeral',
            text: 'Yay you have added a resource!',
            attachments: [
              {
                color: 'good',
                title: resource.title,
                title_link: resource.url,
                text: resource.description
              }
            ]
          };

          return data;
        })
    );
  })
}

function findResource(message) {
  const [first, ...searchterm] = message;
  // check the database for the search term matching
  console.log(`searchterm`, searchterm);

  // Search the database using the query
  return (
    Resource.find({
      $text: { $search: searchterm.join(' ') }
    })
      // Return the resourced found and forward it to slack.
      .then(resources => {
        let data = {
          response_type: 'ephemeral',
          text: 'Results',
          attachments: resources.map(resource => {
            return {
              color: 'good',
              title: resource.title,
              title_link: resource.url,
              text: resource.description
            };
          })
        };

        if (resources.length === 0) {
          return {
            response_type: 'ephemeral',
            attachments: [
              {
                color: 'danger',
                title: 'No results',
                text: 'Try searching for something else.'
              }
            ]
          };
        } else {
          return data;
        }
      })
  );
}

module.exports = handleCommand;
