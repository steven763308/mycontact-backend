//import from ewallet services

//server - route, route - controller,  controller-service

const ewalletService = require('../services/ewalletService');

//add funds
const addFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id; // Assuming user ID is available via middleware
        const wallet = await ewalletService.addFunds(userId, amount);
        res.status(200).json(wallet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

//subtract funds
const subtractFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id;
        const wallet = await ewalletService.subtractFunds(userId, amount);
        res.status(200).json(wallet);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    addFunds,
    subtractFunds,
};
