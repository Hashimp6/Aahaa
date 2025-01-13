const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    media: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
