const express = require("express")
const routes = require('./routes/index.js');
const cookieParser = require("cookie-parser");
const {obtainData} = require('./nightmare')
const server = express();

server.use(cookieParser());
server.use(express.json());
server.use('/', routes);

server.listen(3001, () => {
  console.log("API listening at 3001"); // eslint-disable-line no-console
})

//Apenas levanto el server hago scraping
obtainData()

//Cada 24 hs hago scraping de lcfc
setInterval(() => {
  obtainData()
}, 60000*60*24);//1 minuto = 60000 ms
