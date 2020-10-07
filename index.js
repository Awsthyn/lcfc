const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const url = 'https://www.lcfc.com/matches/results';

  let data = {}
  nightmare
  .goto(url)
  .wait(15000)
  .evaluate(() => [
      document.querySelector('.match-item__team--home').innerText,
      document.querySelector('.match-item__score--completed').childNodes[1].innerText,
      document.querySelector('.match-item__team--away').innerText, 
      document.querySelector('.match-item__score--completed').childNodes[3].innerText])
  .end()
  .then(res => {
      data[res[0]] = res[1]
      data[res[2]] = res[3]
    console.log(data)  })
  .catch(error => {
    console.error('Search failed:', error)
  })
