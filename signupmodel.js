var mongoose = require('mongoose');

var User = mongoose.model('User', {
  _id: { type: String, required: true},
  firstname: { type: String, required: true},
  lastname: { type: String, required: true},
  password: { type: String, required: true},
  address: { type: String, required: true},
  city: { type: String, required: true},
  state: { type: String, required: true},
  zipcode: { type: Number, required: true}
});

module.exports = User;
