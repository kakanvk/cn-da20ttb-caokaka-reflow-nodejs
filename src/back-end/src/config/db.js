
const mongoose = require('mongoose');

async function connectDB() {

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/reflow');
        console.log("Connected to DB Successfully!");
    } catch (err) {
        console.log("Connected to DB Failure!");
    }

}

module.exports = connectDB; 