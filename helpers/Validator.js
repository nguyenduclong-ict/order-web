/**
 * 
 * @param {*} obj 
 * @param {*} match Mảng các giá trị mà phần tử truyền vào sẽ bị xóa đi
 */
const validateRemove = (obj = {}, match = []) => {
    for(let key in obj) {
        if(match.indexOf(obj[key]) >= 0) delete(obj[key]);
    }
    return obj;
}

/**
 * 
 * @param {*} obj Object truyen vao
 * @param {*} match Mảng các phầ tử không hợp lệ
 */
const validate = (obj = {}, match = []) => {
    for(let key in obj) {
        if(match.includes(obj[key])) return false;
    }
    return true;
}

module.exports = {validateRemove, validate};