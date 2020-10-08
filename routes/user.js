const server = require("express").Router();
const {User} = require("../models/User")

const passport = require("passport")
const passportConfig = require("../passport")
const JWT = require("jsonwebtoken")

const signToken = userID =>{
    return JWT.sign({
        iss: "tiendadolar",
        sub: userID
    }, "tiendadolar",{expiresIn: "1h" });
}

server.post("/register", (req,res)=>{
    const {username, password} = req.body
    console.log(req.body)
    User.findOne({username})
    .then(user => {
        if(user) res.status(400).json("Usuario existente")
        else {
            const newUser = new User({username,password})
            newUser.save()
            res.status(201).json("Usuario creado")
        }
    })
    .catch(err => res.sendStatus(500))
})

server.post("/login",passport.authenticate("local",{session:false}), (req,res)=>{
    if(req.isAuthenticated()){
        const {_id,username} = req.user
        const token = signToken(_id);
        res.cookie("access_token",token,{httpOnly: true,sameSite: true})
        res.status(200).json({isAuthenticated:true, user: {username}})
    }
})

server.get("/logout",passport.authenticate("jwt",{session:false}), (req,res)=>{
    res.clearCookie("access_token")
    res.json({user: {username: ""}, success: true})
})

module.exports = server