'use strict';

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
      const [command, category, link, ...linkTitle] = message;
      // Make check so the inputs aren't malicious code.
      console.log(`category`, category);
      console.log(`link`, link);
      console.log(`rest`, linkTitle);
      return `Adding!`;
    case `search`:
      const [first, ...searchterm] = message;
      // check the database for the searchterm matching
      console.log(`searchterm`, searchterm);
      // respond with the search result, how many results should be returned?
      return `Searching!`;
    case `help`:
      // map over the commands object and output a response with all the commands information
      return `Help please!`;
    default:
      return `Not working!`;
  }
};

module.exports = handleCommand;
