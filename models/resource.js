const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the resource schema
const ResourceSchema = new Schema({
  title: String,
  description: String,
  // category: String,
  url: String
});

// Create a model using the resource schema
const Resource = mongoose.model('resource', ResourceSchema);

module.exports = Resource;