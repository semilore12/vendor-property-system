
const express = require('express');
const router = express.Router();

const propertyController = require('../controllers/propertyController');
const isAuthenticated = require('../middleware/authMiddleware');

// Display the add-property form
router.get('/add', isAuthenticated, propertyController.showAddPropertyForm);

// Process the submitted property form
router.post('/add', isAuthenticated, propertyController.addProperty);

router.get('/my-properties', isAuthenticated, propertyController.viewProperties);


router.get('/edit/:id', isAuthenticated, propertyController.showEditPropertyForm);

router.post('/edit/:id', isAuthenticated, propertyController.updateProperty);

router.post('/delete/:id', isAuthenticated, propertyController.deleteProperty);

module.exports = router;
