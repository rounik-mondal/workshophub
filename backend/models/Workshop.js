const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
    title: {type: String, required:true},
    description: String,
    date: Date,
    time: String,
    venue: String,
    seats: Number,
    instructor: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true});

module.exports = mongoose.model('Workshop', WorkshopSchema);