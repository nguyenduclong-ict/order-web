const mongoose = require("../helpers/MyMongoose").mongoose;
const validator = require("../helpers/Validator");
var Schema = mongoose.Schema;
const Product = require("../models/Product");

var schema = new Schema({
    startDate: {
        // Ngày bắt đẩu áp dụng
        type: Date,
        required: true,
        default: Date.now()
    },
    endDate: {
        // ngày hết hạn
        type: Date,
        required: true,
        default: Date.now()
    },
    status: {
        type: Boolean, // Co the ap dung khong?
        default: true
    },
    value: {
        // Phần trăm giảm giá
        type: Number,
        required: () => {
            return this.value > 0;
        },
        default: 0
    },
    products: [
        // Những sản phẩm được áp dụng
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
            default: []
        }
    ],
    providers: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    created: {type: Date, default: Date.now()}
});
// var Discount = {};
var Discount = mongoose.model("Discount", schema);
Discount.methods = {};

Discount.methods.addDiscount = Discount => {
    return new Discount(Discount).save();
};

function getDetail(_id) {
    let result = Discount.findOne({_id: _id})
        .populate("products")
        .populate("prividers");
    return result.exec();
}

Discount.methods.getList = function getList(from, page, product, provider) {
    from = Number(from);
    page = Number(page);
    let products = product ? {$all: [product]} : {$exists: true};
    let providers = provider ? {$all: [provider]} : {$exists: true};
    console.log(products, providers);
    let result = Discount.find({
        $or: [{products}, {providers}]
    })
        .populate("products")
        .populate("providers")
        .skip(from)
        .limit(page);
    return result.exec();
};

Discount.methods.getListByName = async (from, page, search) => {
    from = Number(from);
    page = Number(page);
    let regex = new RegExp(search, "gi");

    return Discount.find()
        .populate("products")
        .populate("providers", "info")
        .exec()
        .then(list => {
            // console.log(list);
            list = list.filter(e => {
                let rs1 = e.products.some(e2 => e2.name.match(regex));
                let rs2 = e.providers.some(e2 => e2.info.name.match(regex));
                return rs1 || rs2;
            });
            return list;
        });
};

// Check discount
const checkDiscount = async (id, productId) => {
    console.log('â', id, productId);
    let discount = await getDetail(id);
    discount.products = discount.products.map(e => e._id);
    console.log(discount, productId);
    if (!discount.status) return {ok: false, message: "Mã giảm giá đã được sử dụng"};
    let i = discount.products.indexOf(productId);
    if (i < 0) return {ok: false, message: "Mã giảm giá không áp dụng cho sản phẩm này"};
    if (discount.products.endDate < Date.now()) return {ok: false, message: "Mã giảm giá hết hạn"};
    return {ok: true, discount};
};

async function editDiscount(data) {
    data.products = data.products.map(e => e._id);
    data.providers = await Product.find({_id: {$in: data.products}}, ["providerId"]).exec();
    data.providers = data.providers.map(e => e.providerId);
    console.log(data);
    return Discount.updateOne({_id: data._id}, data);
}

function changeStatus(ids, status) {
    ids = Array.isArray(ids) ? ids : [];
    return Discount.update(
        {
            _id: {$in: ids}
        },
        {status: status}
    );
}

async function addDiscount(startDate, endDate, status, value, products) {
    let arr = await Product.find({_id: {$in: products}}, ["providerId"]).lean();
    let providers = [];
    arr.forEach(e => {
        providers.push(e.providerId);
    });
    console.log(providers);
    let newDiscount = new Discount({
        startDate,
        endDate,
        status,
        value,
        products,
        providers
    });
    return newDiscount.save();
}

Discount.methods.editDiscount = editDiscount;
Discount.methods.addDiscount = addDiscount;
Discount.methods.getDetail = getDetail;
Discount.methods.changeStatus = changeStatus;
Discount.methods.checkDiscount = checkDiscount;

// export module
module.exports = Discount;
