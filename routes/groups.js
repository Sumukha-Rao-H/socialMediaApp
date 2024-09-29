
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const { isLoggedIn } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, req.params.groupId + path.extname(file.originalname));
    }
});


function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/; 
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only images are allowed!');
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, 
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('groupIcon');

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
            profileImage: 'default-group.jpg', // Default profile image
            admins: [creatorId],  // Add the creator as an admin
            members: [creatorId],
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
        const groups = await Group.find({
            $or: [
                { members: userId },
                { creator: userId } 
            ]
        });
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

        const userId = req.user._id;
        const user = await User.findById(userId).populate('friends');
        const friends = user.friends;
        const isAdmin = group.admins.includes(req.user._id);
        const members = await User.find({ _id: { $in: group.members } });

        res.render('groupDetails', { group, isAdmin, friends, members, user });


    } catch (error) {
        console.error('Error loading group:', error);
        res.status(500).json({ message: 'Failed to load group' });
    }

});

router.post('/uploadGroupIcon/:groupId', isLoggedIn, function (req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        if (!req.file) {
            return res.status(400).json({ message: 'No file selected!' });
        }

        try {
            const groupId = req.params.groupId;
            const group = await Group.findById(groupId);

            if (!group) {
                return res.status(404).json({ message: 'Group not found!' });
            }

            group.profileImage = req.file.filename;
            await group.save();

            res.redirect(`/groups/${groupId}`);
        } catch (error) {
            console.error('Error updating group icon:', error);
            res.status(500).json({ message: 'Failed to save profile picture.' });
        }
    });
});

router.post('/addMembers/:groupId', isLoggedIn, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { members } = req.body;

        if (!Array.isArray(members)) {
            if (typeof members === 'string') {
                members = [members]; // Convert single string to array
            } else {
                return res.status(400).json({ message: 'Invalid members format' });
            }
        }

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Ensure only admins can add members
        if (!group.admins.includes(req.user._id)) {
            return res.status(403).json({ message: 'You do not have permission to add members' });
        }

        // Add each selected member to the group
        members.forEach(memberId => {
            if (!group.members.includes(memberId)) {
                group.members.push(memberId);
            }
        });

        await group.save();
        res.redirect(`/groups/${groupId}`);
    } catch (error) {
        console.error('Error adding members:', error);
        res.status(500).json({ message: 'Failed to add members' });
    }
});

router.post('/groups/:groupId/promote', isLoggedIn, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const { memberId } = req.body; // ID of the member to promote
        const userId = req.user._id; // ID of the user making the request

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (!group.admins.includes(userId)) {
            return res.status(403).json({ message: 'You are not authorized to promote members' });
        }

        if (group.admins.includes(memberId)) {
            return res.status(400).json({ message: 'This member is already an admin' });
        }

        if (!group.members.includes(memberId)) {
            return res.status(400).json({ message: 'This user is not a member of the group' });
        }

        group.admins.push(memberId);
        await group.save();

        res.status(200).json({ message: 'Member promoted to admin successfully' });
    } catch (error) {
        console.error('Error promoting member to admin:', error);
        res.status(500).json({ message: 'Failed to promote member to admin' });
    }
});

module.exports = router;
