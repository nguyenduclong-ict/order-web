let validate = {};

validate.validateRemove = (obj = {}, match = []) => {
    for(let key in obj) {
        if(match.indexOf(obj[key]) >= 0) delete(obj[key]);
    }
    return obj;
}

module.exports = validate;