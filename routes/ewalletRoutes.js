//import from ewallet controller

const express = require('express');
const router = express.Router();
const ewalletController = require('../controllers/ewalletController');
const validateToken = require('../middleware/validateTokenHandler');
//add ewallet

router.use(validateToken);

router.get('/balance', ewalletController.getBalance);
router.post('/create', ewalletController.createWallet);
router.post('/addFunds', ewalletController.addFunds);
router.post('/subtractFunds', ewalletController.subtractFunds);
router.post('/transferFunds', ewalletController.transferFunds);
//router.post('/transactions', ewalletController.getTransactionHistory);
// Add more routes for balance, transaction history, etc.

module.exports = router;
