const express = require('express');

const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/Auth-Middleware');

const router = express.Router();

router.get('/username/:username', UserController.checkUsername);
router.post('/login', UserController.login);
router.patch('/firstlogin', UserController.firstLogin);
router.post('/create', UserController.createUser);

router.get('/all', authMiddleware.checkAdmin, UserController.getUsers);
router.patch('/block', authMiddleware.checkAdmin, UserController.block);

router.delete('/', authMiddleware.checkAuth, UserController.delete);
router.delete('/deleteuser/:username', authMiddleware.checkAdmin, UserController.deleteUser);
router.get('/', authMiddleware.checkAuth, UserController.getUser);



module.exports = router;
