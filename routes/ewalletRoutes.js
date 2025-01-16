//import from ewallet controller

const express = require('express');
const router = express.Router();
const ewalletController = require('../controllers/ewalletController');
const validateToken = require('../middleware/validateTokenHandler');
//add ewallet

router.use(validateToken);

router.get('/balance', ewalletController.getBalance);
router.post('/addFunds', ewalletController.addFunds);
router.post('/subtractFunds', ewalletController.subtractFunds);
// Add more routes for balance, transaction history, etc.

module.exports = router;
