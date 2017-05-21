const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the resource schema
const ResourceSchema = new Schema({
  title: String,
  description: {
    type: String,
    required: [true, 'Description is required.']
  },
  // category: String,
  url: {
    type: String,
    required: [true, 'URL is required.']
  }
});

// Create a model using the resource schema
const Resource = mongoose.model('resource', ResourceSchema);

module.exports = Resource;