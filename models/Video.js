const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    name: String,
    timestamps: [Number],
    url: String,
  });
  
  const Video = mongoose.model('Video', videoSchema);

  module.exports = Video;