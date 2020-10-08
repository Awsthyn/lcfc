const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const {User} = require("./models/User")

const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies){
        token = req.cookies["access_token"]
    }
    return token;
}

passport.use(new JwtStrategy({
    jwtFromRequest: cookieExtractor,
    secretOrKey: "tiendadolar"
},(payload,done)=>{
    User.findById(payload.sub)
    .then((user)=>{
    if(user) return done(null,user);
    else return done(null, false)
    })
    .catch(err => done(err))
}))


passport.use(new LocalStrategy((username, password, done)=>{
    User.findOne({username})
    .then(user => {
        if(!user) done(null, false)
        user.comparePassword(password, done)

    })
    .catch(err => done(err))
}))

module.exports = {passport}