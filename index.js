require('dotenv').config();

const express = require("express");
const connectToMongo = require("./db");
const app = express(); 
const contactRoutes = require("./routes/contact");
const cors = require("cors");
const imageRoutes = require("./routes/imageRoutes");

const corsOption = {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

app.use(cors(corsOption));

const port = process.env.PORT || 5000;
// support JSON bodies and urlencoded form bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/form', contactRoutes);

// Image upload API
app.use('/api/images', imageRoutes);

// Serve uploaded images statically
app.use('/uploads', express.static('uploads'));

connectToMongo();
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});