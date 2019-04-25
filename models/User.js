const mongoose = require('../helpers/MyMongoose').mongoose;
const Types = require('../helpers/MyMongoose').Types;
const bcrypt = require('bcrypt');

var Schema = mongoose.Schema;
var schema = new Schema({
    username: {
        type: String,
        required: [true, 'Username not empty?'],
        unique: [true, "Username must unique"]
    },
    password: Types.password,
    email: Types.email,
    type: {
        type: String,
        enum: ['admin', 'provider', 'customer'],
        required: true
    },
    isBlock: {
        type: Boolean,
        default: true,
        required: true
    },
    info: {
        name: String,
        address: String,
        phone: Number
    }
});

schema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        this.password = hash;
        if (!this.info) this.info = {
            name: '',
            address: '',
            phone: '',
            avatar: []
        }
        console.log(hash);
        next();
    })
});

schema.pre('updateOne', function (next) {
    let update = this._update;
    bcrypt.hash(update.$set.password, 10, (err, hash) => {
        this._update.$set.password = hash;
        console.log(hash);
        next();
    })
});
var User = {};
User = mongoose.model('User', schema);
User.methods = {};
User.methods.addUser = addUser;
function addUser (data) {
    let user = new User(data);
    return user.save();
}
User.methods.getUser = async function (username) {
    return User.aggregate(
        [{
                $lookup: {
                    from: "files",
                    localField: '_id',
                    foreignField: "owner",
                    as: "avatar"
                }
            },
            {
                $match: {
                    "username": username,
                    "type": "provider"
                }
            },
            {
                $project: {
                    username: 1,
                    isBlock: 1,
                    email: 1,
                    type: 1,
                    info: {
                        name: 1,
                        address: 1,
                        phone: 1,
                        avatar: {
                            $filter: {
                                input: "$avatar",
                                as: "item",
                                cond: {
                                    $and: [{
                                            $gte: [{
                                                $indexOfArray: ["$$item.tags", "user"]
                                            }, 0]
                                        },
                                        {
                                            $gte: [{
                                                $indexOfArray: ["$$item.tags", "avatar"]
                                            }, 0]
                                        },
                                        {
                                            $eq: ["$$item.type", "image"]
                                        }
                                    ]
                                }
                            },
                        }
                    }

                }
            }
        ]);
}


User.methods.getListUser = async function (type, from, page) {
    let match = type === 'all' ? {} : {
        "type": type
    };
    return User.aggregate(
            [{
                    $lookup: {
                        from: "files",
                        localField: '_id',
                        foreignField: "owner",
                        as: "avatar"
                    }
                },
                {
                    $match: match
                },
                {
                    $project: {
                        username: 1,
                        isBlock: 1,
                        email: 1,
                        type: 1,
                        info: {
                            name: 1,
                            address: 1,
                            phone: 1,
                            avatar: {
                                $filter: {
                                    input: "$avatar",
                                    as: "item",
                                    cond: {
                                        $and: [{
                                                $gte: [{
                                                    $indexOfArray: ["$$item.tags", "user"]
                                                }, 0]
                                            },
                                            {
                                                $gte: [{
                                                    $indexOfArray: ["$$item.tags", "avatar"]
                                                }, 0]
                                            },
                                            {
                                                $eq: ["$$item.type", "image"]
                                            }
                                        ]
                                    }
                                },
                            }
                        }

                    }
                }
            ])
        .skip(from)
        .limit(page);
}
// export module
module.exports = User;