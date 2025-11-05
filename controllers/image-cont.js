const multer = require("multer");
const path = require("path");
const fs = require("fs");



// Determine uploads directory (allow override via env)
const uploadsDir = path.join(__dirname, '..', process.env.UPLOAD_DIR || 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
	fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// Use the absolute uploadsDir so multer writes to an existing folder
		cb(null, uploadsDir);
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
		// Use a URL-friendly path when returning/storing so frontend can fetch via /uploads/:filename
		const publicPath = `/uploads/${req.file.filename}`;
		const newImage = new Image({
			Path: publicPath,
			filename: req.file.filename,
		});
		await newImage.save();
		res.json({ filename: req.file.filename, path: publicPath, dbId: newImage._id });
	} catch (err) {
		console.error('Error saving image to DB:', err);
		res.status(500).json({ error: 'Failed to save image to database' });
	}
};



const getAllImages = async (req, res) => {
	try {
		const images = await Image.find({});

		// Normalize returned paths so frontend can reliably fetch via /uploads/:filename
		const normalized = images.map(img => {
			const filename = img.filename || (img.Path && path.basename(img.Path)) || null;
			return {
				_id: img._id,
				filename,
				path: filename ? `/uploads/${filename}` : (img.Path || null),
			};
		});

		res.json(normalized);
	} catch (err) {
		console.error('Error fetching images:', err);
		res.status(500).json({ error: 'Failed to fetch images' });
	}
};

module.exports = { upload, uploadImage,  getAllImages };


