const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const isAuthenticated = require('../middleware/authMiddleware');


router.get('/register', (req, res) => {
    res.render('auth/register');
});


router.post('/register', authController.register);


router.get('/login', (req, res) => {
    res.render('auth/login');
});


router.post('/login', authController.login);


router.get('/dashboard', isAuthenticated, (req, res) => {
    res.render('dashboard', {
        username: req.session.username
    });
});

// Log out the current vendor
router.post('/logout', authController.logout);

module.exports = router;