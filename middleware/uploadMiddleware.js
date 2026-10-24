
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadFolder = path.join(__dirname, '../public/uploads');

fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname).toLowerCase();

        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only JPG, PNG, and WebP images are allowed.'));
        }
    }
});

module.exports = upload;
