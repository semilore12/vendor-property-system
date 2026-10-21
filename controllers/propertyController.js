
const db = require('../config/database');

// Display the form for adding a property
exports.showAddPropertyForm = (req, res) => {
    res.render('properties/add');
};

// Save a new property to the database
exports.addProperty = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            price,
            property_type
        } = req.body;

        await db.query(
            `INSERT INTO properties
            (user_id, title, description, location, price, property_type)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [
                req.session.userId,
                title,
                description,
                location,
                price,
                property_type
            ]
        );

        return res.redirect('/properties/my-properties');

    } catch (error) {
        console.error('Add property error:', error.message);
        return res.status(500).send('Could not add property.');
    }
};

 // Display properties belonging to the logged-in vendor
exports.viewProperties = async (req, res) => {
    try {
        const [properties] = await db.query(
            'SELECT * FROM properties WHERE user_id = ? ORDER BY created_at DESC',
            [req.session.userId]
        );

        return res.render('properties/list', {
            properties: properties
        });

    } catch (error) {
        console.error('View properties error:', error.message);
        return res.status(500).send('Could not load your properties.');
    }
};

 // Display the edit form for a property
exports.showEditPropertyForm = async (req, res) => {
    try {
        const [properties] = await db.query(
            'SELECT * FROM properties WHERE id = ? AND user_id = ?',
            [req.params.id, req.session.userId]
        );

        if (properties.length === 0) {
            return res.status(404).send('Property not found.');
        }

        return res.render('properties/edit', {
            property: properties[0]
        });

    } catch (error) {
        console.error('Edit form error:', error.message);
        return res.status(500).send('Could not load the edit form.');
    }
};



exports.updateProperty = async (req, res) => {
    try {
        const {
            title,
            description,
            location,
            price,
            property_type
        } = req.body;

        const [result] = await db.query(
            `UPDATE properties
             SET title = ?, description = ?, location = ?,
                 price = ?, property_type = ?
             WHERE id = ? AND user_id = ?`,
            [
                title,
                description,
                location,
                price,
                property_type,
                req.params.id,
                req.session.userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Property not found.');
        }

        return res.redirect('/properties/my-properties');

    } catch (error) {
        console.error('Update property error:', error.message);
        return res.status(500).send('Could not update property.');
    }
};

 // Delete a property belonging to the logged-in vendor
exports.deleteProperty = async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM properties WHERE id = ? AND user_id = ?',
            [req.params.id, req.session.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).send('Property not found.');
        }

        return res.redirect('/properties/my-properties');

    } catch (error) {
        console.error('Delete property error:', error.message);
        return res.status(500).send('Could not delete property.');
    }
};

