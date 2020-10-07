const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
const url = 'https://www.lcfc.com/matches/results';

/*
got(url)
.then(html => {
    setTimeout(() => console.log($('div > span', html.body).length), 15000);
    //console.log($('.match-item__score match-item__score--completed', html.body) );
    
})
.catch(function(err){
   console.log(err)
  })
*/
  
  nightmare
  .goto(url)
  .wait(15000)
  .evaluate(() => [document.querySelector('.match-item__score--completed').childNodes[1].innerText, document.querySelector('.match-item__score--completed').childNodes[3].innerText])
  .end()
  .then(console.log)
  .catch(error => {
    console.error('Search failed:', error)
  })
