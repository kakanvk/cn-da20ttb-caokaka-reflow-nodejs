const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', songController.getAllSongs);
router.post('/', authMiddleware.authenticate, authMiddleware.isAdmin, songController.createSong);
router.delete('/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, songController.deleteSongsByIds);
router.delete('/:id/sections/multiple', authMiddleware.authenticate, authMiddleware.isAdmin, songController.deleteSectionsByIds);
router.get('/:songId/sections/:sectionId', songController.getSectionById);
router.put('/:songId/sections/:sectionId', authMiddleware.authenticate, authMiddleware.isAdmin, songController.updateSectionById);
router.get('/:id', songController.getSongById);
router.put('/:id', authMiddleware.authenticate, authMiddleware.isAdmin, songController.updateSongById);
router.post('/addSection/:id', authMiddleware.authenticate, authMiddleware.isAdmin, songController.addSectionToSong);

module.exports = router;
