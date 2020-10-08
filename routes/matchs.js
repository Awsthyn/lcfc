const server = require("express").Router();
const {Match} = require("../models/Match");
var moment = require('moment');

const passport = require("passport")
const passportConfig = require("../passport")

//GET Resultado del último partido
  server.get("/last", passport.authenticate("jwt",{session:false}), (req, res, next) => {
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
  server.get("/", passport.authenticate("jwt",{session:false}), (req, res, next) => {
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
server.get("/date", passport.authenticate("jwt",{session:false}), (req, res, next) => {
    const {date} = req.query
    let parsedDate = moment(date, "DD-MM-YYYY")

    try {
        Match.findOne({ 'date': {$gte: moment(parsedDate).subtract(1, 'days'), $lt: parsedDate}})
        .then((data)=>{
            res.status(200)
            res.json(data)
        })
    } catch (error) {
      console.error(error.message);
    }
});

//GET Resultado de los últimos 50 partidos
server.get("/last50", passport.authenticate("jwt",{session:false}), (req, res, next) => {
  try {
      Match.find().sort({date: -1}).limit(50)
      .then((data)=>{
          res.status(200)
          res.json(data)
      })
  } catch (error) {
    console.error(error.message);
  }
});

//si query.score == 0  => GET Partidos por intervalo de fecha
//si query.score == 1 => GET para obtener los puntos que tiene Leicester por un rango de fechas
server.get("/rangedate", passport.authenticate("jwt",{session:false}), (req, res, next) => {
  let score;
  const minDate = moment(req.query.minDate, "DD-MM-YYYY")
  const maxDate = moment(req.query.maxDate, "DD-MM-YYYY")
  if(!req.query.score) score = 0
  else score = req.query.score

  try {
      Match.find({ 'date': {$gte: moment(minDate).subtract(1, 'days'), $lt: maxDate}}).sort({date: -1})
      .then((data)=>{
          
          if(!!Number(score) === false) res.status(200).json(data)
          else {
            let accumulator = 0;
            for(elem of data){
              if(elem.host.club === "Leicester") accumulator += elem.host.score
              else accumulator += elem.guest.score
            }
          res.status(200).json({totalScore: accumulator})  
          }
      })
  } catch (error) {
    console.error(error.message);
  }
});


  //POST
  server.post("/", passport.authenticate("jwt",{session:false}), (req, res, next) => {
    const {host, guest} = req.body
    const date =  moment.utc(req.body.date, "DD-MM-YYYY")//agrego método UTC para homogeneizar los resgistros en la DB.
    //Si no hago esto, las queryes de búsquedas andan mal.
    try {
      let newMatch = new Match({host, guest, date, _id: Date.now()})
        newMatch.save(req.query.id)
        .then((data)=>{
            res.status(200)
            res.json(data)
        })
    } catch (error) {
      console.error(error.message);
    }
  });

module.exports = server;
