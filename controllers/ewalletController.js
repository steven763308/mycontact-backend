//import from ewallet services

//server - route, route - controller,  controller-service

const ewalletService = require('../services/ewalletService');
const asyncHandler = require('express-async-handler');
//const Wallet = require('../models/walletModel');

/*
//get balance
const getBalance = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const wallet = await Wallet.findOne({ where: { user_id: userId } });

    if(!wallet){
        res.status(404);
        throw new Error("Wallet not found");
    }
    res.status(200).json({ balance: wallet.balance });
});

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

module.exports = {
    //getBalance,
    //createWallet,
    addFunds,
    subtractFunds,
};
