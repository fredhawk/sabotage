'use strict';
// Docs https://www.npmjs.com/package/node-metainspector
const MetaInspector = require('node-metainspector');
const Resource = require('../models/resource');

const commands = [
  {
    name: `Help command`,
    command: `help`,
    description: `Shows the available commands and how to use them.`,
    usage: `/sabotage help`
  },
  {
    name: `Add command`,
    command: `add`,
    description: `Adds a resource to the bot.`,
    usage: `/sabotage add url "Resource title"`
  },
  {
    name: `Search command`,
    command: `search`,
    description: `Search for something and see what comes up.`,
    usage: `/sabotage search "searchterm"`
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
      pretext: `*${command.name}*`,
      title: `${command.command}`,
      text: `${command.description}\n ${command.usage}`,
      ts: 123456789,
      mrkdwn_in: ['pretext']
    });
  });
  return { attachments };
};

const searchCommand = searchresult => {
  const attachments = [];
  searchresult.map(search => {
    attachments.push({
      fallback: `Required plain-text summary of the attachment.`,
      color: '#36a64f',
      pretext: `*${search.linkTitle}*`,
      title: `${search.linkTitle}`,
      title_link: `${search.url}`,
      text: `${search.tagline}`,
      ts: 123456789,
      mrkdwn_in: ['pretext']
    });
  });
  return { attachments };
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
              title: 'Unknown Command',
              text: "Try '/[bot-name] help' for available commands."
            }
          ]
        });
      });
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
      var client = new MetaInspector(url, { timeout: 5000 });
      // build a query
      // Use the metainspector to extract the page title from the supplied url and use it as a title
      client.on('fetch', function() {
        let query = {
          title: client.title,
          url,
          description: linkTitle.join(' ')
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
                title: resource.title,
                title_link: resource.url,
                text: resource.description
              }
            ]
          };

          return data;
        })
    );
  });
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
