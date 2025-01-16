const mongoose = require('mongoose');

const StoriesSchema = new mongoose.Schema({
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
   
        createdAt: {
          type: Date,
          default: Date.now,
        },
}, { timestamps: true });

const stories = mongoose.model('Stories', StoriesSchema);

module.exports = stories;