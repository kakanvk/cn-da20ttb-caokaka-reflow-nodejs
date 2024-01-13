const express = require('express');
const router = express.Router();
const singerController = require('../controllers/singerController');
const authMiddleware = require('../middleware/authMiddleware');

// [GET] /api/singers 
router.get('/', singerController.getAllSingers);

// [POST] /api/singers 
router.post('/', authMiddleware.authenticate, authMiddleware.isAdmin, singerController.createSinger);

// [GET] /api/singers/:id 
router.get('/:id', singerController.getSingerById);

// [PUT] /api/singers/:id 
router.put('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, singerController.updateSingerById);

// [DELETE] /api/singers/:id 
router.delete('/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, singerController.deleteSingersByIds);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, singerController.deleteSingerById);

module.exports = router;
