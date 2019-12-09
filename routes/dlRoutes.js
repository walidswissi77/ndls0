const express = require('express');

const DLController = require('../controllers/dlController');
const authMiddleware = require('../middleware/Auth-Middleware');

const router = express.Router();

router.get('/test', DLController.test);

router.get('/progress/:available', DLController.getProgress);

router.get('/filter/:type/:size', authMiddleware.checkAuth, DLController.filterAvailableDomains);

router.get('/suggestions', DLController.getSuggestions);
module.exports = router;
