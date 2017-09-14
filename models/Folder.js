var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var Folder = new Schema({
  name: String,
  icon: String,
  content: String
});

module.exports = mongoose.model('Folder', Folder);