const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/chat/:friendId', isLoggedIn, async (req, res) => {
    try {
        const friendId = req.params.friendId;
        const currentUserId = req.user._id;

        // Find the friend to get the username
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        // Fetch messages between the logged-in user and the friend
        const messages = await Message.find({
            $or: [
                { sender: currentUserId, receiver: friendId },
                { sender: friendId, receiver: currentUserId }
            ]
        }).sort('timestamp');

        // Render the chat view, passing the messages, friend name, and current user ID
        res.render('chat', {
            friendName: friend.username,
            messages: messages,
            currentUserId: currentUserId,
            friendId:friendId
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Failed to load chat' });
    }
});

module.exports = router;
