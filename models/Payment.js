const mongoose = require('../helpers/MyMongoose').mongoose;

var Schema = mongoose.Schema;
var schema = new Schema({
    name: {
        type: String,
        required: true
    },
    code: String,
    description: {
        type: String,
        required: true
    },
    isShow: Boolean,
    created: {type: Date, default: Date.now()}
});
var Payment = {};
Payment.methods = {};
Payment.native = mongoose.model('Payment', schema);

Payment.methods.getList = () => {
    return Payment.native.find({});
}

Payment.methods.addPayment = (Payment) => {

    let payment = new Payment(Payment);
    payment.isShow = true;
    return payment.save();

};

// export module
module.exports = Payment;