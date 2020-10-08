require("dotenv").config();
var mongoose = require('mongoose');

const { USER, PASSWORD, DB_NAME } = process.env;

const uri = `mongodb+srv://${USER}:${PASSWORD}@cluster0.jsj3e.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schema
var Schema = mongoose.Schema;

module.exports = {mongoose, Schema}