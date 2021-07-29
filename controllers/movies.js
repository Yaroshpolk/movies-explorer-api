const Movie = require('../models/movies');
const ValidationError = require('../errors/validation-err');

module.exports.getSavedMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then(movies => res.status(200).send(movies))
    .catch(next)
};

module.exports.createMovie = (req, res, next) => {
  const { country, director, duration, year, description, image,
          trailer, nameRU, nameEN, thumbnail, movieId } = req.body;

  Movie.create({country, director, duration, year, description, image,
                trailer, nameRU, nameEN, thumbnail, movieId})
    .then(movie => res.status(200).send(movie))
    .catch(err => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Ошибка валидации данных при создании фильма');
      }
      return next(err);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById()
}