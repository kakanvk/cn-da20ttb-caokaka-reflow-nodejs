const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middleware/authMiddleware');

// [GET] /api/categorys
router.get('/', categoryController.getAllCategories);

// [POST] /api/categorys/:id
router.post('/', authMiddleware.authenticate, authMiddleware.isAdmin, categoryController.createCategory);

// [GET] /api/categorys/:id
router.get('/:id', categoryController.getCategoryById);

// [PUT] /api/categorys/:id
router.put('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, categoryController.updateCategoryById);

// [DELETE] /api/categorys/:id
router.delete('/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, categoryController.deleteCategoriesByIds);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, categoryController.deleteCategoryById);

module.exports = router;
