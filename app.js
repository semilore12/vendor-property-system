require('dotenv').config();

const express = require('express');
const session = require('express-session');
const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const clientRoutes = require('./routes/clientRoutes');

const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

// Read form data
app.use(express.urlencoded({ extended: true }));

// Configure sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60
    }
}));


app.use('/', authRoutes);
app.use('/properties', propertyRoutes);
app.use('/', clientRoutes);


app.get('/', async (req, res) => {
    try {
        const [properties] = await db.query(`
            SELECT properties.*, users.username
            FROM properties
            JOIN users ON properties.user_id = users.id
            ORDER BY properties.created_at DESC
        `);

        res.render('home', {
            properties: properties
        });

    } catch (error) {
        console.error('Homepage properties error:', error.message);
        res.status(500).send('Could not load homepage properties.');
    }
});



app.listen(3000, async () => {
    console.log('Server is running on port 3000');

    try {
        await db.query('SELECT 1');
        console.log('MySQL database connected successfully!');
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
});