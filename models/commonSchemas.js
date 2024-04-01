const { Schema, model } = require('mongoose');
const commonSchema = new Schema({
    title: String,
    description: String,
    date: Date,
    time: String,
    location: String,
    category: String,
    capacity: Number,
    deadlines: Date,
    requirements: String
})
const Event = new model('Event', commonSchema);
module.exports = Event;