const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


// dotenv config 
dotenv.config();

// mongodb Connection 
connectDB();

// rest object 
const app = express();


// middleweres 
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// ROUTES
app.use('/api/v1/auth', require('./routes/userRoutes'));
app.use('/api/v1/post', require('./routes/postRoutes'));


// PORT 
const PORT = process.env.PORT || 3000;

// LISTEN 
app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON ${PORT}`.bgGreen.white);
})