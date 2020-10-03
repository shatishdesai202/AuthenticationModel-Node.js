const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        enum: ['male', 'female'],
        default: 'male'
    },

    password: {
        type: String,
        required: true
    },

    resetPassword: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now()
    }

});

module.exports = mongoose.model('user', userSchema);