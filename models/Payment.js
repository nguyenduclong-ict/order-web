const mongoose = require('../helpers/MyMongoose').mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({
    name : {
        type : String,
        required : true
    }, 
    description : {
        type : String ,
        required : true
    }
});

var Payment = mongoose.model('Payment', schema);
Payment.methods = {};

Payment.methods.addPayment = (Payment) => {
    return new Payment(Payment).save();
};

// export module
module.exports = Payment;