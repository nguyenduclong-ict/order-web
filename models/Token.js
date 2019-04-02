const mongoose = require('../helpers/MyMongoose').mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({
    value : String
});

var Token = mongoose.model('Token', schema);
Token.methods = {};

Token.methods.addToken = (token) => {
    return new Token(token).save();
};

// export module
module.exports = Token;