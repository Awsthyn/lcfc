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

//obtainData()
