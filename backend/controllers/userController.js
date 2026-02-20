const User = require('../models/User');

const getMyProfile = async (req, res) => {
    try {
        res.json(req.user);
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
};

// admin only
const getAllUsers = async (req, res) => {
    try {
        console.log('Query role:', req.query.role);

        const filter = {}

        if (req.query.role){
            filter.role = req.query.role;
        }

        const users = await User.find(filter).select('-password');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({message: "Server error"});
    }
}

module.exports = {getMyProfile, getAllUsers};