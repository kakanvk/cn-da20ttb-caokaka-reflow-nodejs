const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

const register = async (req, res) => {

    const { username, password, name, email, avatar, role } = req.body;

    try {
        // Kiểm tra xem người dùng đã tồn tại hay chưa
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username is already taken' });
        }

        // Nếu người dùng chưa tồn tại, thực hiện đăng ký
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            name,
            role: role ? role : 'Free',
            avatar: avatar ? avatar : "https://cdn-icons-png.flaticon.com/512/8792/8792047.png"
        });

        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const secretKey = "REFLOW";

        const token = jwt.sign({ user: { id: user.id, username: user.username, role: user.role } }, secretKey, {
            expiresIn: '6h',
        });
        
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const logout = async (req, res) => {
    try {
        // Gỡ bỏ token từ cookie
        res.clearCookie('token');

        res.json({ message: 'Logout successful' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    register,
    login,
    logout,
};
