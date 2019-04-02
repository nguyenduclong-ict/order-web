const Token = require("../models/Token");

function find(token) {
    Token.findOne({value : token}).exec();    
}

async function push (token) {
    Token.methods.addToken(token);
}

function remove (token) {
    Token.deleteOne({value : token});
}

module.exports = {
    find, push, remove
}