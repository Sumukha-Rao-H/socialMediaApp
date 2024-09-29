const mongoose = require('mongoose');

const groupChatMessageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Group' // Assuming you have a Group model
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true // This will add createdAt and updatedAt fields
});

// Create a model from the schema
const GroupChatMessage = mongoose.model('GroupChatMessage', groupChatMessageSchema);

module.exports = GroupChatMessage;