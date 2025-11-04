const multer = require("multer");
const path = require("path");
const fs = require("fs");



// Set up storage engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './uploads'); 

	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
	}
});

// File filter for images only
const fileFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	} else {
		cb(new Error('Only image files are allowed!'), false);
	}
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


// Controller function for uploading image and saving info to DB
const Image = require("../models/image");
const uploadImage = async (req, res) => {
	if (!req.file) {
		return res.status(400).json({ error: 'No file uploaded' });
	}
	try {
		const newImage = new Image({
			Path: req.file.path,
			filename: req.file.filename
		});
		await newImage.save();
		res.json({ filename: req.file.filename, path: req.file.path, dbId: newImage._id });
	} catch (err) {
		res.status(500).json({ error: 'Failed to save image to database' });
	}
};



const getAllImages = async (req, res) => {
    try {
        const images = await Image.find({});
        res.json(images);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch images' });
		throw err;
    }
};

module.exports = { upload, uploadImage,  getAllImages };


