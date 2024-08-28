const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isLoggedIn } = require('../middlewares/auth');

router.get('/chat/:friendId', isLoggedIn, async (req, res) => {
    try {
        const currentUser = req.user; // This comes from the session
        const friendId = req.params.friendId;

        // Fetch friend's details
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        res.render('chat', {
            friendName: friend.username, // Pass friend's name
            currentUserId: currentUser._id, // Pass current user’s ID
            friendId: friend._id // Pass friend's ID
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
