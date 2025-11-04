const express = require('express');
const router = express.Router();
const { upload, uploadImage, getAllImages } = require('../controllers/image-cont');

// Improved error handling for image upload
router.post('/upload', (req, res, next) => {
    upload.single('image')(req, res, function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
}, uploadImage);

// Route to fetch all images from DB
router.get('/all', getAllImages);

module.exports = router;