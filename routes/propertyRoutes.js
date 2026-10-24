
const express = require('express');
const router = express.Router();

const propertyController = require('../controllers/propertyController');
const isAuthenticated = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Display the add-property form
router.get('/add', isAuthenticated, propertyController.showAddPropertyForm);

// Save a property with an optional image
router.post(
    '/add',
    isAuthenticated,
    upload.single('image'),
    propertyController.addProperty
);

router.get('/my-properties', isAuthenticated, propertyController.viewProperties);

router.get('/edit/:id', isAuthenticated, propertyController.showEditPropertyForm);

// Update a property with an optional new image
router.post(
    '/edit/:id',
    isAuthenticated,
    upload.single('image'),
    propertyController.updateProperty
);

router.post('/delete/:id', isAuthenticated, propertyController.deleteProperty);

module.exports = router;
