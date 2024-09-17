const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isLoggedIn } = require('../middlewares/auth');

// Get the current user's friends
router.get('/api/friends', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch the current user and populate the 'friends' field
        const user = await User.findById(userId).populate('friends', 'username');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the user's friends
        res.status(200).json(user.friends);
    } catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Failed to fetch friends' });
    }
});

module.exports = router;
