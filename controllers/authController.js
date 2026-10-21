const db = require('../config/database');
const bcrypt = require('bcrypt');

// Register a new vendor
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const [existingUsers] = await db.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).send('Email already registered.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashedPassword]
        );

        return res.redirect('/login');

    } catch (error) {
        console.error('Registration error:', error.message);
        return res.status(500).send('Registration failed. Please try again.');
    }
};


// Log in an existing vendor
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.query(
            'SELECT id, username, email, password FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).send('Invalid email or password.');
        }

        const user = users[0];

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).send('Invalid email or password.');
        }

        req.session.userId = user.id;
        req.session.username = user.username;

        return res.redirect('/dashboard');

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).send('Login failed. Please try again.');
    }
};


// Log out the current vendor
exports.logout = (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error:', error.message);
            return res.status(500).send('Could not log out. Please try again.');
        }

        res.clearCookie('connect.sid');
        return res.redirect('/login');
    });
};