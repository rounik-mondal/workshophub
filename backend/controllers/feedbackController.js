const Feedback = require('../models/Feedback');

const addFeedback = async (req, res) => {
    try {
        const {workshop, rating, comment} = req.body;
        if (!workshop || !rating) return res.status(400).json({message: "Workshop and rating are both required"});

        const f = await Feedback.create({workshop, user: req.user._id, rating, comment});
        res.status(201).json(f);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error adding feedback"});
    }
};

const listFeedback = async (req, res) => { // feedback -> plural
    try {
        const filter = {};
        if (req.query.workshop) filter.workshop = req.query.workshop;
        const f = await Feedback.find(filter).populate('user', 'name email');
        res.json(f);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({message: "Error listing feedback"});
    }
};

module.exports = {addFeedback, listFeedback};