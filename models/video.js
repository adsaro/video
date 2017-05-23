var mongoose = require('mongoose');

var videoSchema = mongoose.Schema({
  name: String,
  file: String
});

module.exports = mongoose.model('video', videoSchema);