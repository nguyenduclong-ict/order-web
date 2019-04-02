
var Store = [];
var push = (token) => {
    Store.push(token);
}
var remove = (token) => {
    let index = Store.indexOf(token);
    Store.splice(index, 1);
}
module.exports = {
    Store, push, remove
}