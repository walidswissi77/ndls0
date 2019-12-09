const express = require('express');

const BookmarkController = require('../controllers/bookmarkContoller');
const authMiddleware = require('../middleware/Auth-Middleware');

const router = express.Router();

router.post('/', authMiddleware.checkAuth, BookmarkController.create);
router.delete('/:id', authMiddleware.checkAuth, BookmarkController.remove);
router.get('/', authMiddleware.checkAuth, BookmarkController.getBookmarks);

module.exports = router;
