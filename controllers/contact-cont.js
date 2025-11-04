const contact = require("../models/contact");

const contactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !phone || !message) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        await contact.create({ name, email, phone, message });
        return res.status(201).json({
            message: "Contact created successfully",
        });
    } catch (error) {
        console.error('contactForm error:', error.message || error);
        return res.status(500).json({
            message: "Error creating contact",
        });
    }
};

module.exports = contactForm;