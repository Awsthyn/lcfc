require("dotenv").config();
const express = require("express")
var mongoose = require('mongoose');
var moment = require('moment')

const { USER, PASSWORD, DB_NAME } = process.env;
const uri = `mongodb+srv://${USER}:${PASSWORD}@cluster0.jsj3e.gcp.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})

var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })

// Define schema
var Schema = mongoose.Schema;

const matchSchema = new Schema({
    _id: Number,
    host:  {club: String, score: Number},
    guest: {club: String, score: Number},
    date: { type: Date},
  });
  const Match = mongoose.model('Match', matchSchema);




const url = 'https://www.lcfc.com/matches/results';
/*
  nightmare
  .goto(url)
  .wait(15000)
  .evaluate(() => [
      document.querySelector('.match-item__team--home').innerText,
      document.querySelector('.match-item__score--completed').childNodes[1].innerText,
      document.querySelector('.match-item__team--away').innerText, 
      document.querySelector('.match-item__score--completed').childNodes[3].innerText,
      document.querySelector('.highlighted-match').getAttribute("data-match-id"),
      document.querySelector(".highlighted-match__date").innerText])
  .end()
  .then(res => {
      let data = {host: {}, guest: {}}
      data._id = Number(res[4])
      data.host.club = res[0]
      data.host.score = Number(res[1])
      data.guest.club = res[2]
      data.guest.score = Number(res[3])
      data.date = moment(res[5],  'dddd D MMMM').format('YYYY-MM-DD')
      const lastMatch = new Match(data);
      lastMatch.save(function (err, lastMatch) {
        if (err) return console.error(err);
        console.log(lastMatch)
      });


  })
  .catch(error => {
    console.error('Search failed:', error)
  })
*/

nightmare
  .goto(url)
  .wait(15000)
  .evaluate(() => {
    
    let idNodeList = document.querySelectorAll('.match-item')
    //let idArray = Array.from(idNodeList)
    let dateNodeList = document.querySelectorAll('.match-item__date')
    let dateArray = Array.from(dateNodeList).map(e => e.innerText)
    let principalData = Array.from(idNodeList).map(e => {return {_id: e.getAttribute('data-matchid')}})
    for(let i = 0; i <dateArray.length; i++){
      principalData[i].date = dateArray[i]
    }
    return principalData})
  .end()
  .then(res => {
    console.log(res)
    //console.log(res.getAttribute('data-competition-matches-list'))
  })
  .catch(error => {
    console.error(error)
  })