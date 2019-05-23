let validate = {};

validate.validateRemove = (obj = {}, match = []) => {
    for(let key in obj) {
        if(match.indexOf(obj[key]) >= 0) delete(obj[key]);
    }
    return obj;
}

validate.validate = (obj = {}, match = []) => {
    for(let key in obj) {
        if(match.includes(obj[key])) return false;
    }
    return true;
}

module.exports = validate;