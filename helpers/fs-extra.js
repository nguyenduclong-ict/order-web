var fs = {};
var fs = require('fs');
const path = require('path');
const util = require('util');
var NError = require('../helpers/Error');

fs.move = async (src, des) => {
    try {
        let rcopy = fs.copyFileSync(src, des);
        fs.unlinkSync(src);
        return true;
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }
}
module.exports = fs;