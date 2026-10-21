
const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');

// Search for a realtor
router.get('/search', clientController.searchRealtor);

module.exports = router;
