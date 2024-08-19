const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isLoggedIn } = require('../middlewares/auth'); // Ensure this middleware sets req.user

// Fetch incoming friend requests
router.get('/requests', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('friendRequests', 'username _id');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.render('acceptfriends', { user: req.user, friendRequests: user.friendRequests });
        res.json({ friendRequests: user.friendRequests });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Send friend request
router.post('/send-request', isLoggedIn, async (req, res) => {
    try {
        const { recipientId } = req.body;

        if (!recipientId) {
            return res.status(400).json({ message: 'Recipient ID is required' });
        }

        const sender = await User.findById(req.user._id);
        const recipient = await User.findById(recipientId);

        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        if (sender.friendRequests.includes(recipientId)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }

        recipient.friendRequests.push(sender._id);
        await recipient.save();

        res.status(200).json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
