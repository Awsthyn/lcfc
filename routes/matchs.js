const server = require("express").Router();
const {Match} = require("../db")
var moment = require('moment')

//GET Resultado del último partido
  server.get("/last", (req, res, next) => {
    try {
        Match.find().sort({date: -1}).limit(1)
        .then((data)=>{
            res.status(200)
            res.json(data)
        })
    } catch (error) {
      console.error(error.message);
    }
  });

  //GET Resultado de un partido en particular por id
  server.get("/", (req, res, next) => {
    try {
        Match.findById(req.query.id)
        .then((data)=>{
            res.status(200)
            res.json(data)
        })
    } catch (error) {
      console.error(error.message);
    }
  });

//GET Resultado de un partido en particular por fecha
server.get("/try", (req, res, next) => {
    const {day, month, year } = req.query
    console.log(req.query)

    let date = moment(new Date(year, month, day))
    //No sé por qué, cuando transformo a date, se agrega un mes de más. Así que lo tengo que restar.
    date = moment(date).subtract(1, 'months')
    //2020 6 20
    console.log(moment(date).add(1, 'days'))
    try {
        Match.findOne({ 'date': {$gte: moment(date).subtract(1, 'days'), $lt: date}})
        .then((data)=>{
            res.status(200)
            res.json(data)
        })
    } catch (error) {
      console.error(error.message);
    }
});



module.exports = server;
