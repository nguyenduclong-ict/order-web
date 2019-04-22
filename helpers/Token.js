const Token = require("../models/Token");

function find(token) {
    return Token.findOne({
        value: token
    }).exec();
}

async function push(token) {
    let data = {
        value: token
    }
    return Token.methods.addToken(data);
}

function remove(token) {
    let data = {
        value: token
    }
    return Token.deleteOne(data);
}
function findById(id) {
    return Token.findById(id);
}
module.exports = {
    find,
    push,
    remove,
    findById
}