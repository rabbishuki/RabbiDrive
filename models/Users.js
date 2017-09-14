var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId;

var Users = new Schema({
  displayName: String,
  gender: String,
  id: String,
  name:{familyName: String, givenName: String},
  photos: Array,
  email: String,
  isAdmin: Boolean
});

Users.pre('save', function(next){
    // if( !this.addedOn ) this.addedOn = new Date();
    next();
});

module.exports = mongoose.model('Users', Users);