const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', songController.getAllSongs);
router.get('/:id', songController.getSongById);
router.post('/', authMiddleware.authenticate, songController.createSong);

module.exports = router;
