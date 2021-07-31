const Movie = require('../models/movies');
const ValidationError = require('../errors/validation-err');
const NotFoundError = require('../errors/not-found-err');
const AccessDeniedErr = require('../errors/access-denied-err');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send(
      {
        _id: movie._id,
        country,
        director,
        duration,
        year,
        description,
        image,
        trailer,
        nameRU,
        nameEN,
        thumbnail,
        movieId,
        owner,
      },
    ))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации данных при создании фильма');
      }
      return next(err);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм с указанным _id не найден');
      }
      if (!movie.owner.equals(req.user._id)) {
        throw new AccessDeniedErr('Невозможно удалить чужую карточку');
      }
      Movie.findByIdAndDelete(req.params.movieId)
        .then((data) => {
          res.status(200).send(data);
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError(err.message);
      }
      next(err);
    })
    .catch(next);
};
