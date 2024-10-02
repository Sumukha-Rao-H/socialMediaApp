const mongoose = require('mongoose');

// Define the schema for comments
const commentSchema = new mongoose.Schema({
    user: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        username: { type: String, required: true }
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { _id: false });

const postSchema = new mongoose.Schema({
    user: {
        _id: { type: mongoose.Schema.Types.ObjectId, required: true },
        username: { type: String, required: true }                      
    },
    description: { type: String, maxlength: 500 },                      
    mediaUrl: { type: String, required: true },                         
    mediaType: { type: String, enum: ['image', 'video'], required: true }, 
    likes: { type: Number, default: 0 },                                                                 
    comments: [commentSchema],                                          
    createdAt: { type: Date, default: Date.now }                        
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
