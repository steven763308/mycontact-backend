//logic (deduct, substract, sum, transfer, etc) should be in service

const Ewallet = require('../models/ewalletModel');
const Transaction = require('../models/transactionModel');

// Helper: Find wallet by userId
async function findWallet(userId) {
    const wallet = await Ewallet.findOne({ where: { user_id: userId } });
    if (!wallet) throw new Error('Recipient wallet not found!!');
    return wallet;
}

//create wallet
// Create or find eWallet for a user
async function createWallet(userId) {
    try {
        // Check if wallet exists for the user
        let wallet = await Ewallet.findOne({ where: { user_id: userId } });

        if (!wallet) {
            // Create wallet if it doesn't exist
            wallet = await Ewallet.create({ user_id: userId, balance: 0 });
            console.log(`Wallet created for user ${userId}`);
        } else {
            console.log(`Wallet already exists for user ${userId}`);
        }

        return wallet;
    } catch (error) {
        console.error('Error creating or finding wallet:', error);
        throw error;
    }
}

// Get balance
async function getBalance(userId) {
    const wallet = await findWallet(userId);
    console.log(`Current balance for user ${userId}: ${wallet.balance}`); // Log the balance before responding
    return wallet.balance;
}

// Helper: Log a transaction
async function logTransaction(walletId, type, amount, details) {
    await Transaction.create({
        wallet_id: walletId,
        transaction_type: type,
        amount,
        details,
    });
}

// Add funds
async function addFunds(userId, amount) {
    const wallet = await findWallet(userId);
    wallet.balance = parseFloat(amount) + parseFloat(wallet.balance);
    await wallet.save();
    await logTransaction(wallet.wallet_id, 'add', amount, 'Funds added');
    return wallet;
}

// Subtract funds
async function subtractFunds(userId, amount) {
    const wallet = await findWallet(userId);
    if (wallet.balance < amount) throw new Error('Insufficient balance');
    wallet.balance = parseFloat(wallet.balance) - parseFloat(amount);
    await wallet.save();
    await logTransaction(wallet.wallet_id, 'subtract', amount, 'Funds subtracted');
    return wallet;
}

// Transfer funds
async function transferFunds(fromUserId, toUserId, amount) {
    if(fromUserId === toUserId) throw new Error('Cannot transfer to own account');

    const fromWallet = await findWallet(fromUserId);
    const toWallet = await findWallet(toUserId);

    if(!toWallet) throw new Error('Recipient wallet not found');
    if (fromWallet.balance < amount) throw new Error('Insufficient balance');

    fromWallet.balance = parseFloat(fromWallet.balance) - parseFloat(amount);
    toWallet.balance = parseFloat(toWallet.balance) + parseFloat(amount);

    await fromWallet.save();
    await toWallet.save();

    await logTransaction(fromWallet.wallet_id, 'transfer', -amount, `Transferred to user ${toUserId}`);
    await logTransaction(toWallet.wallet_id, 'transfer', amount, `Received from user ${fromUserId}`);

    return { fromWallet, toWallet };
}

//get transaction history
// Get transaction history
async function getTransactionHistory(userId) {
    const wallet = await findWallet(userId);
    const transactions = await Transaction.findAll({ where: { wallet_id: wallet.wallet_id } });
    return transactions;
}

module.exports = {
    findWallet,
    createWallet,
    getBalance,
    addFunds,
    subtractFunds,
    transferFunds,
    getTransactionHistory,
};

