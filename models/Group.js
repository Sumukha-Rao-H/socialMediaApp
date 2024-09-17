const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    groupName: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true
    },
    profileImage: {
        type: String, 
        default: 'default-group.jpg' 
    },
    members: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        validate: [arrayLimitMembers, '{PATH} exceeds the limit of 30 members']
    },
    admins: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
        validate: [arrayLimitAdmins, '{PATH} exceeds the limit of 5 admins'],
    },
});

function arrayLimitMembers(val) {
    return val.length <= 30;
}

function arrayLimitAdmins(val) {
    return val.length <= 5;
}

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
