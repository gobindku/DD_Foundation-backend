const mongoose = require('mongoose');

// Read DB URL from env. Accept both DATABASE_URL and MONGO_URI for compatibility.
const URI = process.env.DATABASE_URL || process.env.MONGO_URI;

const connectToMongo = async () => {
    if (!URI) {
        console.warn('No DATABASE_URL or MONGO_URI provided. Skipping DB connection (useful for local dev without DB).');
        return;
    }

    try {
        await mongoose.connect(URI);
        console.log('connected to db');
    } catch (error) {
        console.error('failed to connect to mongo:', error.message || error);
        // don't exit automatically in case user wants to debug server without DB
    }
};

module.exports = connectToMongo;