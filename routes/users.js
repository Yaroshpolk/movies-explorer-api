const usersRouter = require('express').Router();

const { getUserInfo, updateUser } = require('../controllers/users');

usersRouter.get('/me', getUserInfo);

usersRouter.patch('/me', updateUser);

module.exports = usersRouter;