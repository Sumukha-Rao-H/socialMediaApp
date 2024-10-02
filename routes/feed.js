const express = require('express');
const multer = require('multer');
const User = require('../models/User');
const Post = require('../models/Posts'); // Assuming the Post schema is in the models directory
const path = require('path');
const { isLoggedIn } = require('../middlewares/auth');
const router = express.Router();

const uploadsDir = path.join(__dirname, '../public/uploads');
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,uploadsDir); // Upload directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Handle form submission and save post to the database
router.post('/uploadPost',isLoggedIn, upload.single('media'), async (req, res) => {
    try {
        const { description } = req.body;
        const mediaFile = req.file;

        // Check if file is uploaded
        if (!mediaFile) {
            return res.status(400).send('File not uploaded');
        }

        // Determine media type based on MIME type
        const mediaType = mediaFile.mimetype.startsWith('image') ? 'image' : 'video';

        // Get the current user (make sure req.user contains user data like username and _id)
        const user = req.user; // Assuming req.user contains user information after authentication
        if (!user) {
            return res.status(401).send('Unauthorized: User information is missing');
        }

        // Create a new post instance with the data
        const newPost = new Post({
            description: description,
            mediaUrl: `/uploads/${mediaFile.filename}`, // Store relative path to access it
            mediaType: mediaType, // Set media type
            user: {
                _id: user._id,
                username: user.username
            }, // Save user details
            createdAt: Date.now()
        });

        // Save the post to the database
        await newPost.save();

        // Redirect back to feed or any other page
        res.redirect('/feed');
    } catch (err) {
        console.error('Error uploading post:', err);
        res.status(500).send('Error uploading post');
    }
});

router.get("/feed", isLoggedIn, async (req, res) => {
    try {
        res.render("feed", { user: req.user });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;