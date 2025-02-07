const { mongoose, Schema } = require("../db")
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
username: {
    type: String,
    required: true,
    unique: true,
    min: 6,
    max: 15
    },
password: {
    type: String,
    required: true,
    min: 6,
    }
})

UserSchema.pre("save", function(next){
    if(!this.isModified("password"))
        return next();
    bcrypt.hash(this.password,10,(err, passwordHash)=>{
        if(err) return next(err);
        this.password = passwordHash;
        next();
    })
})

UserSchema.methods.comparePassword = function(password,cb){
    bcrypt.compare(password,this.password,(err,isMatch)=>{
        if(err) return cb(err);
        else{
            if(!isMatch) return cb(null, isMatch);
            return cb(null, this);
        }
    })
}

const User = mongoose.model('User', UserSchema);


module.exports = {User}