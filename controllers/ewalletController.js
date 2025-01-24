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

//create wallet if no wallet detected for user
const createWallet = asyncHandler(async (req, res) => {
    const userId = req.user.id; // Assuming `req.user` contains the authenticated user info

    try {
        // Validate the user ID
        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        // Current DateTime
        const now = new Date();

        // Insert the new wallet into the database using a service or raw query
        const wallet = await ewalletService.createWallet(userId, "0", "1", now, now);

        // Respond with the newly created wallet
        res.status(201).json(wallet);
    } catch (err) {
        console.error("Error creating wallet:", err.message);
        res.status(500).json({ error: "Unable to create wallet. Please try again later." });
    }
});


//add funds
const addFunds = async (req, res) => {
    try {
        const { amount } = req.body;
        const userId = req.user.id; // Assuming user ID is available via middleware
        console.log(typeof amount);
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

//transfer funds 
const transferFunds = asyncHandler(async (req, res) => {
    try {
        const { amount, recipientId } = req.body;
        const userId = req.user.id;
        const { fromWallet, toWallet } = await ewalletService.transferFunds(userId, recipientId, amount);
        res.status(200).json({ newBalance: fromWallet.balance });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const getTransactionHistory = asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;
        const transactions = await ewalletService.getTransactionHistory(userId);
        res.status(200).json(transactions);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = {
    getBalance,
    createWallet,
    addFunds,
    subtractFunds,
    transferFunds,
    getTransactionHistory,
};