var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  business_name: String,
  business_address: String,
  business_city: String,
  business_state: String,
  business_zip_code: String,
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = User;