const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isLoggedIn } = require('../middlewares/auth');

router.get("/", (req, res) => res.render("login"));
router.get("/about", (req, res) => res.render("about"));
router.get("/welcome", isLoggedIn, (req, res) => res.render("welcome"));
router.get("/feed", isLoggedIn, (req, res) => res.render("feed"));
router.get("/groupDetails", isLoggedIn, (req, res) => res.render("groupDetails"));

router.get("/profile", isLoggedIn, function (req, res) {
    res.render("profile", { user: req.user });
});

router.get('/social', isLoggedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        .populate('friendRequests', 'username _id')
        .populate('friends', 'username _id');
      
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const query = req.query.q;
      let users = [];
      if (query) {
          users = await User.find({ username: new RegExp(query, 'i') });
      }

      res.render('social', { user: req.user, friendRequests: user.friendRequests, users: users, friends: user.friends});
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

module.exports = router;

