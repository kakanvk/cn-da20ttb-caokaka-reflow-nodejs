const express = require('express');
const router = express.Router();
const backgroundController = require('../controllers/backgroundController');
const authMiddleware = require('../middleware/authMiddleware');

// Route để lấy tất cả background
router.get('/', backgroundController.getAllBackgrounds);
router.get('/:id', backgroundController.getBackgroundById);

// Route để thêm background mới
router.post('/', authMiddleware.authenticate, authMiddleware.isAdmin,  backgroundController.createBackground);

// Route để cập nhật thông tin background theo id
router.put('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, backgroundController.updateBackgroundById);

// Route để xoá background theo id hoặc danh sách id
router.delete('/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, backgroundController.deleteBackgroundsByIds);

module.exports = router;