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
    }, 
    info : {
        name : String,
        address : String,
        phone : Number,
        avatar : [String]
    }
});

schema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        if(!this.info) this.info = {
            name : '',
            address : '',
            phone : '',
            avatar : []
        }
        console.log(hash);
        next();
    })
});

schema.pre('updateOne', function (next) {
    let update = this._update;
    bcrypt.hash(update.$set.password, 10, (err, hash) => {
        this._update.$set.password = hash;
        console.log(hash);
        next();
    })
});

var User = mongoose.model('User', schema);
User.methods = {};

User.methods.addUser = (user) => {
    return new User(user).save();
};

// export module
module.exports = User;