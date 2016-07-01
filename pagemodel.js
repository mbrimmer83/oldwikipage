var mongoose = require('mongoose');

var Page = mongoose.model('Page', {
  pagename: String,
  content: String
});

module.exports = Page;
