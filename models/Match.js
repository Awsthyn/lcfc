const { mongoose, Schema } = require("../db")
var findOrCreate = require('mongoose-findorcreate')

const MatchSchema = new Schema({
    _id: Number,
    host:  {club: String, score: Number},
    guest: {club: String, score: Number},
    date: { type: Date},
  });

MatchSchema.plugin(findOrCreate);

const Match = mongoose.model('Match', MatchSchema);

module.exports = {Match}