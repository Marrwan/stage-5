const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');


const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/screen_recording_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>console.log("DB connection established"));


app.use(router)

module.exports = app;
