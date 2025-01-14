//import from ewallet controller

const express = require('express');
const router = express.Router();
const ewalletController = require('../controllers/ewalletController');
const validateToken = require('../middleware/validateTokenHandler');

router.use(validateToken);

router.post('/addFunds', ewalletController.addFunds);
router.post('/subtractFunds', ewalletController.subtractFunds);
// Add more routes for balance, transaction history, etc.

module.exports = router;
