const mongoose = require('mongoose');

module.exports = mongoose.model("Cat", {
    name: String,
    colour: String,
    date: {
        type: Date,
        default: Date.now()
    }
}, "Cats");