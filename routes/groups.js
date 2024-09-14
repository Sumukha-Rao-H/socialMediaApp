
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const { isLoggedIn } = require('../middlewares/auth');

router.post('/create-group', isLoggedIn, async (req, res) => {
    try {
        const { groupName } = req.body;
        const creatorId = req.user._id;

        // Check if groupName is provided
        if (!groupName || groupName.trim() === '') {
            return res.status(400).json({ message: 'Group name is required' });
        }

        const newGroup = new Group({
            groupName,
            creator: creatorId,
            profileImage: 'default.jpg' // Default profile image
        });

        await newGroup.save();

        res.status(200).json({ message: 'Group created successfully', group: newGroup });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
