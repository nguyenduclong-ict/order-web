const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var schema = new Schema({
    username : {
        type : String,
        required : [true, 'Username not empty?'],
        unique : [true , "Username must unique"]
    },
    password : Types.password,
    email : Types.email,
    type : {
        type : String,
        enum : ['admin', 'provider', 'customer'],
        required : true
    },
    isBlock : {
        type : Boolean, 
        default : true,
        required : true
    }
});

schema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        console.log(hash);
        next();
    })
})
var User = mongoose.model('User', schema);
User.methods = {};

User.methods.addUser = (user) => {
    return new User(user).save();
};

// export module
module.exports = User;