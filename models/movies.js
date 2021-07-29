const mongoose = require('mongoose');
const { regUrl } = require('../utils/constants');

const movieSchema = mongoose.Schema({
  nameRU: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  nameEN: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 50
  },
  year: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  director: {
    type: String,
    required: true,
    maxlength: 25,
  },
  country: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regUrl.test(v);
      },
      message: 'Неверный формат ссылки на изображение',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regUrl.test(v);
      },
      message: 'Неверный формат ссылки на изображение',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regUrl.test(v);
      },
      message: 'Неверный формат ссылки на трейлер фильма',
    },
  },
  movieId: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);