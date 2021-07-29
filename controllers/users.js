const User = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const ValidationError = require('../errors/validation-err');
const DuplicateError = require('../errors/duplicate-err');

module.exports.getUserInfo = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then(user => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch(next)
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const id = req.user._id;

  User.findByIdAndUpdate(id, { name, email }, { new: true, runValidators: true })
    .then(user => {
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
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {name, email, password,} = req.body;

  User.create({ name, email, password })
    .then(user => res.status(200).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные для создания пользователя');
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new DuplicateError('Пользователь с указанным email уже зарегистрирован');
      }
    })
    .catch(next);
};