const {Match} = require("./models/Match")
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: false })
var moment = require('moment')

const url = 'https://www.lcfc.com/matches/results';
function obtainData(){
nightmare
  .goto(url)
  .wait(15000)
  .evaluate(() => {
    //Último partido se obtiene de una forma particular, al estar renderizado de otra forma.
    let lastMatch = [
      document.querySelector('.match-item__team--home').innerText,
      document.querySelector('.match-item__score--completed').childNodes[1].innerText,
      document.querySelector('.match-item__team--away').innerText, 
      document.querySelector('.match-item__score--completed').childNodes[3].innerText,
      document.querySelector('.highlighted-match').getAttribute("data-match-id"),
      document.querySelector(".highlighted-match__date").innerText]

    //Resto de los partidos  
    let idNodeList = document.querySelectorAll('.match-item')
    let principalData = Array.from(idNodeList).map(e => {return {_id: e.getAttribute('data-matchid')}})
    let year =  Array.from(idNodeList).map(e => Number(e.parentElement.parentElement.getAttribute("data-competition-matches-list").slice(-4)))

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
      //LastMatch comparte algunas clases con los matches, pero no todas. Al ocurrir esto, algunos datos se desfasan. Por eso se suma +1 o +2 a los i en algunos casos.
      //En realidad se puede hacer una selección más precisa del DOM.
      principalData[i].date = moment(year[i]+ " " + dateArray[i],'YYYY dddd D MMMM').format('YYYY-MM-DD')
      principalData[i].host = {club: hostTeamArray[i+2], score: resultsArray[i+1].host}
      principalData[i].guest = {club: guestTeamArray[i+2], score: resultsArray[i+1].guest}
    }
    principalData.unshift({
      _id: lastMatch[4],
      host:  {club: lastMatch[0], score: lastMatch[1]},
      guest: {club: lastMatch[2], score: lastMatch[3]},
      date: moment(lastMatch[5],  'dddd D MMMM').format('YYYY-MM-DD')})
    return principalData})
  .end()
  .then(res => {
    res.pop()
    res.forEach(e => {
      return Match.findOrCreate({_id: e._id}, 
        {host: e.host, guest: e.guest, date: e.date},
        function(err, match, created) {
          if (err) return console.error(err);
          console.log(match)
          console.log(created)
      })
  })
  })
  .catch(error => {
    console.error(error)
  })
}

module.exports = {obtainData}