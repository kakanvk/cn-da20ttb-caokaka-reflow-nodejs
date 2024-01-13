const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.authenticate, authMiddleware.isAdmin, userController.getAllUsers);
router.get('/info', authMiddleware.authenticate, userController.getCurrentUser);
router.get('/favorites', authMiddleware.authenticate, userController.getFavoriteSongs);
router.post('/favorites', authMiddleware.authenticate, userController.addFavoriteSong);
router.delete('/favorites/multiple', authMiddleware.authenticate, userController.removeFavoriteSongsByIds);
router.delete('/favorites/:id', authMiddleware.authenticate, userController.removeFavoriteSongById);
router.put('/edit-info', authMiddleware.authenticate, userController.changeInfoCurrentUser);
router.get('/:id', authMiddleware.authenticate, userController.getUserById);
router.put('/:id', authMiddleware.authenticate, userController.updateUserById);
router.delete('/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, userController.deleteUsersByIds);
router.delete('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, userController.deleteUserById);

module.exports = router;
