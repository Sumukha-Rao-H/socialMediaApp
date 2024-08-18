const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const { isLoggedIn } = require('../middlewares/auth');
const router = express.Router();

const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb) {
        cb(null, req.user.username + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).single('profileImage');

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

router.post('/upload', isLoggedIn, function(req, res) {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err });
        }
        if (req.file == undefined) {
            return res.status(400).json({ message: 'No file selected!' });
        }

        try {
            const user = await User.findById(req.user._id);
            user.profileImage = '/uploads/' + req.file.filename;
            await user.save();
            res.redirect('/profile');
        } catch (error) {
            res.status(500).json({ message: 'Failed to save profile picture.' });
        }
    });
});

module.exports = router;