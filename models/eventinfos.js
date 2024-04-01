const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
const signup = new mongoose.Schema({


    username: String,
    email: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },

})

const signupDetails = new mongoose.model('userSignup', signup);
module.exports = signupDetails;