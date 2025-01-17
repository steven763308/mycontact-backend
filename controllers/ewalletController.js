//import from ewallet services

//server - route, route - controller,  controller-service

const ewalletService = require('../services/ewalletService');
const asyncHandler = require('express-async-handler');


//get balance
const getBalance = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const wallet = await ewalletService.findWallet(userId);
        res.status(200).json({ balance: wallet.balance });
        console.log(`Current balance for user ${userId}: ${wallet.balance}`);
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.log("Error: ", err.message);
    }
});

/*
//create wallet if no wallet detected for user
const createWallet = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const wallet = await Wallet.create({
        user_id: userId,
        balance: 0,
    });
    res.status(201).json(wallet);
});
*/


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

//transfer funds **HAVENT ADD

module.exports = {
    getBalance,
    //createWallet,
    addFunds,
    subtractFunds,
};
