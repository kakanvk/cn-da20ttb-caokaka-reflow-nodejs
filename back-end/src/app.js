// app.js
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Connect to MongoDB
connectDB();


app.use('/api/auth', require('./routes/auth'));
app.use('/api/songs', require('./routes/song'));
app.use('/api/users', require('./routes/user'));
app.use('/api/categorys', require('./routes/category'));
app.use('/api/singers', require('./routes/singer'));
app.use('/api/backgrounds', require('./routes/background'));
app.use('/api/search', require('./routes/search'));

// Start the server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
