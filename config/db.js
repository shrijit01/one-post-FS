const mongoose = require('mongoose');
const colors = require('colors');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connect to the DATABASE ${mongoose.connection.host}`.bgCyan.white);
    } catch (e) {
        console.log(`Error in Connecting DB ${e}`.bgRed.white);
    }
}

module.exports = connectDB;