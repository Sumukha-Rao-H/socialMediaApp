const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose');
var userSchema = new Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    profileImage: {
        type: String,
        default: '/uploads/default.jpg'
    },
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
})


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('user', userSchema)