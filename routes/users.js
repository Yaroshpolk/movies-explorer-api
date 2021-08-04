const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUser } = require('../controllers/users');

usersRouter.get('/me', getUserInfo);

usersRouter.patch('/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  }),
  updateUser);

module.exports = usersRouter;
