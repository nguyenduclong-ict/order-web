const mongoose = require('../helpers/MyMongoose').mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({   
    name : {
        type : String,
        required : true
    }, 
    code : String,
    description : {
        type : String ,
        required : true
    },
    isShow : Boolean
});

var Payment = mongoose.model('Payment', schema);
Payment.methods = {};

Payment.methods.addPayment = (Payment) => {

    let payment =  new Payment(Payment);
    payment.isShow = true;
    return payment.save();
    
};

// export module
module.exports = Payment;