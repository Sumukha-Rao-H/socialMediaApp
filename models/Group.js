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
});

const Group = mongoose.model('Group', groupSchema);
module.exports = Group;
