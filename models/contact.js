const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

// Model name should be singular and capitalized by convention
const Contact = model('Contact', contactSchema);
module.exports = Contact;