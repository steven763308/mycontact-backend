const Ewallet = require("../models/ewalletModel");
const Transaction = require("../models/transactionModel");

//Helper: Find wallet by userId
async function findWallet(userId) {
    try {
        const wallet = await Ewallet.findOne({ where: { user_id: userId } });
        if (!wallet) throw new Error("Wallet not found for the specified user");
        return wallet;
    } catch (error) {
        console.error(`Error finding wallet for user ${userId}:`, error);
        throw error;
    }
}

//Create or find eWallet for a user
async function createWallet(userId) {
    try {
        let wallet = await Ewallet.findOne({ where: { user_id: userId } });
        if (!wallet) {
            wallet = await Ewallet.create({ user_id: userId, balance: 0 });
            console.log(`Wallet created for user ${userId}`);
        } else {
            console.log(`Wallet already exists for user ${userId}`);
        }
        return wallet;
    } catch (error) {
        console.error(`Error creating wallet for user ${userId}:`, error);
        throw error;
    }
}

//Get wallet balance
async function getBalance(userId) {
    try {
        const wallet = await findWallet(userId);
        console.log(`Balance for user ${userId}: ${wallet.balance}`);
        return wallet.balance;
    } catch (error) {
        console.error(`Error retrieving balance for user ${userId}:`, error);
        throw error;
    }
}

//Helper: Log a transaction
async function logTransaction(walletId, type, amount, details) {
    try {
        await Transaction.create({
            wallet_id: walletId,
            transaction_type: type,
            amount,
            details,
        });
    } catch (error) {
        console.error("Error logging transaction:", error);
        throw error;
    }
}

//Add funds to the wallet
async function addFunds(userId, amount) {
    try {
        const wallet = await findWallet(userId);
        wallet.balance += parseFloat(amount);
        await wallet.save();
        await logTransaction(wallet.wallet_id, "add", amount, "Funds added");
        return wallet;
    } catch (error) {
        console.error(`Error adding funds for user ${userId}:`, error);
        throw error;
    }
}

//Subtract funds from the wallet
async function subtractFunds(userId, amount) {
    try {
        const wallet = await findWallet(userId);
        if (wallet.balance < amount) throw new Error("Insufficient balance");
        wallet.balance -= parseFloat(amount);
        await wallet.save();
        await logTransaction(wallet.wallet_id, "subtract", amount, "Funds subtracted");
        return wallet;
    } catch (error) {
        console.error(`Error subtracting funds for user ${userId}:`, error);
        throw error;
    }
}

//Transfer funds between wallets
async function transferFunds(fromUserId, toUserId, amount) {
    try {
        if (fromUserId === toUserId) throw new Error("Cannot transfer to your own account");

        const fromWallet = await findWallet(fromUserId);
        const toWallet = await findWallet(toUserId);

        if (fromWallet.balance < amount) throw new Error("Insufficient balance");

        // Adjust balances
        fromWallet.balance -= parseFloat(amount);
        toWallet.balance += parseFloat(amount);

        await fromWallet.save();
        await toWallet.save();

        // Log transactions
        await logTransaction(fromWallet.wallet_id, "transfer", -amount, `Transferred to user ${toUserId}`);
        await logTransaction(toWallet.wallet_id, "transfer", amount, `Received from user ${fromUserId}`);

        return { fromWallet, toWallet };
    } catch (error) {
        console.error("Error transferring funds:", error);
        throw error;
    }
}

//Get transaction history for a user
async function getTransactionHistory(userId) {
    try {
        const wallet = await findWallet(userId);
        const transactions = await Transaction.findAll({ where: { wallet_id: wallet.wallet_id } });
        return transactions;
    } catch (error) {
        console.error(`Error retrieving transaction history for user ${userId}:`, error);
        throw error;
    }
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
