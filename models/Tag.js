var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var Tag = new Schema({
  name: String
});

module.exports = mongoose.model('Tag', Tag);