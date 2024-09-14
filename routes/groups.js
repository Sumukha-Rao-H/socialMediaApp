
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
            profileImage: 'default-group.jpg' // Default profile image
        });

        await newGroup.save();

        res.status(200).json({ message: 'Group created successfully', group: newGroup });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: error.message });
    }
});

router.get('/groups', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user._id;
        const groups = await Group.find({ creator: userId });

        res.render('groups', { groups }); 
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Failed to load groups' });
    }
});

router.get('/groups/:groupId', isLoggedIn, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findById(groupId);

        res.render('groupDetails', { group });
    } catch (error) {
        console.error('Error loading group:', error);
        res.status(500).json({ message: 'Failed to load group' });
    }
});

module.exports = router;
