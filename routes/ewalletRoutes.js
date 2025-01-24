//routes to controller

const express = require("express");
const router = express.Router();
const ewalletController = require("../controllers/ewalletController");
const validateToken = require("../middleware/validateTokenHandler");

// Middleware to validate token for all routes
router.use(validateToken);

// eWallet Routes
router.get("/", ewalletController.getBalance);
//router.get("/availableCoins", ewalletController.getBalance); // Get current balance
router.get("/balance", ewalletController.getBalance); // Get current balance
router.get("/transactionHistory/:userId", ewalletController.getTransactionHistory); // Get transaction history by user ID
router.post("/create", ewalletController.createWallet); // Create a new wallet
router.post("/addFunds", ewalletController.addFunds); // Add funds to the wallet
router.post("/subtractFunds", ewalletController.subtractFunds); // Subtract funds from the wallet
router.post("/transferFunds", ewalletController.transferFunds); // Transfer funds between wallets

module.exports = router;
