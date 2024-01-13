const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middleware/authMiddleware');

// Route để lấy tất cả background
router.get('/', searchController.search);

module.exports = router;