const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const auth = require('../middlewares/auth');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const NotFoundErr = require('../errors/not-found-err');

router.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(20),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }).unknown(true),
  }),
  createUser);

router.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login);

router.use('/users', auth, usersRouter);

router.use('/movies', auth, moviesRouter);

router.use('/api', () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});

module.exports = router;
