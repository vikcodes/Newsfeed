var mongoose = require('mongoose');

var postSchema = mongoose.Schema({ //the schema for Mongoose
  api: String,
  source: String,
  title: String,
  upvotes: Number
});

module.exports = mongoose.model('Post', postSchema);
