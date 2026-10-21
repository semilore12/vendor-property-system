
const db = require('../config/database');

// Search for a realtor by username
exports.searchRealtor = async (req, res) => {
    try {
        const { username } = req.query;

        // Find the realtor
        const [realtors] = await db.query(
            'SELECT id, username, email FROM users WHERE username = ?',
            [username]
        );

        if (realtors.length === 0) {
            return res.send('No realtor found with that username.');
        }

        const realtor = realtors[0];

        // Find this realtor's properties
        const [properties] = await db.query(
            'SELECT * FROM properties WHERE user_id = ? ORDER BY created_at DESC',
            [realtor.id]
        );

        // Display the realtor's profile
        return res.render('clients/realtor', {
            realtor: realtor,
            properties: properties
        });

    } catch (error) {
        console.error('Realtor search error:', error.message);
        return res.status(500).send('Could not search for realtor.');
    }
};
