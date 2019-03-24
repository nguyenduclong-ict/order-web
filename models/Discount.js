const mongoose = require('../helpers/MyMongoose').mongoose;
var Types = require('../helpers/MyMongoose').Types;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var schema = new Schema({
   startdate : {
        type : Date, 
        required : true
   }, 
   endDate : {
    type : Date, 
    required : true
   }, 
   status : {
       type : Number ,
       enum : [-1, 0 ,1],
       default : [0]
   }, 
   value : {
       type : Number,
       required : () => {
            return this.value > 0;
       },
       default : 0
   }
});

var Discount = mongoose.model('Discount', schema);
Discount.methods = {};

Discount.methods.addDiscount = (Discount) => {
    return new Discount(Discount).save();
};

// export module
module.exports = Discount;