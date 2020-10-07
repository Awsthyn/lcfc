const express = require("express")
const {Match} = require("./db")
var moment = require('moment')

const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })

const url = 'https://www.lcfc.com/matches/results';

nightmare
  .goto(url)
  .wait(15000)
  .evaluate(() => {

    let idNodeList = document.querySelectorAll('.match-item')
    let principalData = Array.from(idNodeList).map(e => {return {_id: e.getAttribute('data-matchid')}})

    let dateNodeList = document.querySelectorAll('.match-item__date')
    let dateArray = Array.from(dateNodeList).map(e => e.innerText)
    
    let hostTeamNodeList = document.querySelectorAll('.match-item__team--home')
    let hostTeamArray = Array.from(hostTeamNodeList).map(e => e.innerText)

    let guestTeamNodeList = document.querySelectorAll('.match-item__team--away')
    let guestTeamArray = Array.from(guestTeamNodeList).map(e => e.innerText)

    let resultsNodeList = document.querySelectorAll('.match-item__score--completed')
    let resultsArray = Array.from(resultsNodeList).map(e => {return {host: e.childNodes[1].innerText, guest: e.childNodes[3].innerText }})
    //let array = [principalData.length, dateArray.length, hostTeamArray.length, guestTeamArray.length, resultsArray.length]

    for(let i = 0; i < principalData.length-1; i++){
      //LastMatch comparte algunas clases con los matches, pero no todas. Por eso se suma +1 o +2 a los i en algunos casos.
      //En realidad se puede hacer una selección más precisa del DOM.
      principalData[i].date = moment(dateArray[i],'dddd D MMMM').format('YYYY-MM-DD')
      principalData[i].host = {club: hostTeamArray[i+2], score: resultsArray[i+1].host}
      principalData[i].guest = {club: guestTeamArray[i+2], score: resultsArray[i+1].guest}
    }
    return principalData})
  .end()
  .then(res => {
    res.pop()
    res.forEach(e => {
      const match = new Match(e);
      match.save(function (err, match) {
        if (err) return console.error(err);
        console.log(match)
    });
  })
  })
  .catch(error => {
    console.error(error)
  })




















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
