// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config/jwt');

const authenticate = (req, res, next) => {
    // Lấy token từ cookie
    const token = req.cookies.token;

    // Kiểm tra xem token có tồn tại hay không
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    try {
        const secretKey = "REFLOW";

        // Xác minh và giải mã token
        const decoded = jwt.verify(token, secretKey);

        // Lưu thông tin người dùng vào yêu cầu để sử dụng trong các xử lý tiếp theo
        req.user = decoded.user;

        // console.log('Authenticated user:', req.user); // Thêm dòng này để kiểm tra thông tin người dùng

        // Chuyển đến middleware hoặc xử lý tiếp theo
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
};

const isAdmin = (req, res, next) => {

    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }

    // Nếu là admin, chuyển đến middleware hoặc xử lý tiếp theo
    next();
};

module.exports = { authenticate, isAdmin };
