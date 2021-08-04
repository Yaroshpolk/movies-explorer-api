require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const DuplicateError = require('../errors/duplicate-err');
const AuthentificationError = require('../errors/authentification-err');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUserInfo = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении профиля');
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new DuplicateError('Пользователь с указанным email уже зарегистрирован');
      }
      next(err);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, email } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((password) => {
      User.create({ name, email, password })
        .then((user) => res.status(200).send({
          _id: user._id,
          name: user.name,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new ValidationError('Переданы некорректные данные при создании пользователя');
          }
          if (err.name === 'MongoError' && err.code === 11000) {
            throw new DuplicateError('Пользователь с указанным email уже зарегистрирован');
          }
          next(err);
        })
        .catch(next);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      throw new AuthentificationError('Неправильная почта или пароль');
    })
    .catch(next);
};
