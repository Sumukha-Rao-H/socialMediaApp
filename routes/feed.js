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

        const friends = await User.find({ _id: { $in: user.friends } });
        await Promise.all(friends.map(friend => 
            User.findByIdAndUpdate(friend._id, { $push: { feed: newPost._id } })
        ));

        // Redirect back to feed or any other page
        res.redirect('/feed');
    } catch (err) {
        console.error('Error uploading post:', err);
        res.status(500).send('Error uploading post');
    }
});

router.get('/feed', isLoggedIn, async (req, res) => {
    try {
        const user = req.user; // Assuming req.user contains user information after authentication

        const userWithFeed = await User.findById(user._id).populate('feed'); // Populate the feed array

        const defaultposts = userWithFeed.feed;

        const posts = defaultposts.reverse()

        res.render('feed', { user, posts }); 
    } catch (err) {
        console.error('Error fetching feed:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/like/:postId', isLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

        // Find the post
        const post = await Post.findById(postId);

        // Check if the user has already liked the post
        if (post.likedBy.includes(userId)) {
            return res.status(400).json({ message: 'You have already liked this post' });
        }

        // Add the like
        post.likes += 1;
        post.likedBy.push(userId); // Add user ID to likedBy array
        await post.save();

        res.status(200).json({ message: 'Post liked', likes: post.likes });
    } catch (err) {
        console.error('Error liking post:', err);
        res.status(500).send('Error liking post');
    }
});

router.post('/unlike/:postId', isLoggedIn, async (req, res) => {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

        // Find the post
        const post = await Post.findById(postId);

        // Check if the user has not liked the post yet
        const likeIndex = post.likedBy.indexOf(userId);
        if (likeIndex === -1) {
            return res.status(400).json({ message: 'You have not liked this post' });
        }

        // Remove the like
        post.likes -= 1;
        post.likedBy.splice(likeIndex, 1); // Remove user ID from likedBy array
        await post.save();

        res.status(200).json({ message: 'Post unliked', likes: post.likes });
    } catch (err) {
        console.error('Error unliking post:', err);
        res.status(500).send('Error unliking post');
    }
});



module.exports = router;