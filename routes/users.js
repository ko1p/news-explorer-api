const usersRouter = require('express').Router();
const auth = require('../middlewares/auth');

const { getUserInfo } = require('../controllers/users');

usersRouter.get('/me', auth, getUserInfo);

module.exports = usersRouter;
