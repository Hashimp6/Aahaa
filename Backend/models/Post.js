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
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    },
    likes: {
          type: Number,
          default: 0,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;