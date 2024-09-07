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

        if (sender._id.toString()==recipient._id.toString()) {
            return res.status(400).json({ message: 'Cannot send friend request to yourself' });
        }

        if (sender.friends.includes(recipientId)) {
            return res.status(400).json({ message: 'This user is already your friend' });
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

router.post('/accept-request', isLoggedIn, async (req, res) => {
    try {
        const { senderId } = req.body;

        // Ensure senderId is provided
        if (!senderId) {
            return res.status(400).json({ message: 'Sender ID is required' });
        }

        // Find the logged-in user (recipient of the friend request)
        const recipient = await User.findById(req.user._id);
        
        // Find the sender (user who sent the friend request)
        const sender = await User.findById(senderId);

        // Ensure both users exist
        if (!recipient || !sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the friend request exists
        if (!recipient.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: 'No friend request from this user' });
        }

        // Add sender to recipient's friends list
        recipient.friends.push(sender._id);

        // Add recipient to sender's friends list
        sender.friends.push(recipient._id);

        // Remove the sender from the recipient's friendRequests array
        recipient.friendRequests = recipient.friendRequests.filter(id => !id.equals(senderId));

        // Save both users
        await recipient.save();
        await sender.save();

        // Respond with success
        res.status(200).json({ message: 'Friend request accepted' });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: error.message });
    }
});
router.post('/reject-request', isLoggedIn, async (req, res) => {
    try {
        const { senderId } = req.body;

        if (!senderId) {
            return res.status(400).json({ message: 'Sender ID is required' });
        }

        // Find the logged-in user (recipient of the friend request)
        const recipient = await User.findById(req.user._id);
        
        // Find the sender (user who sent the friend request)
        const sender = await User.findById(senderId);

        // Ensure both users exist
        if (!recipient || !sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the friend request exists
        if (!recipient.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: 'No friend request from this user' });
        }
        // Remove the sender from the recipient's friendRequests array
        recipient.friendRequests = recipient.friendRequests.filter(id => !id.equals(senderId));

        // Save both users
        await recipient.save();
        await sender.save();

        // Respond with success
        res.status(200).json({ message: 'Friend request rejected' });
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: error.message });
    }
});



module.exports = router;
