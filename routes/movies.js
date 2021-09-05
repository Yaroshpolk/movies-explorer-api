const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { deleteMovie, createMovie, getSavedMovies } = require('../controllers/movies');
const urlValidator = require('../middlewares/urlValidator');

moviesRouter.get('/', getSavedMovies);

moviesRouter.post('/',
  celebrate({
    body: Joi.object().keys({
      image: Joi.string().required().custom(urlValidator),
      trailer: Joi.string().required().custom(urlValidator),
      thumbnail: Joi.string().required().custom(urlValidator),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().integer().required(),
      year: Joi.string().min(4).max(4).required(),
      description: Joi.string().required(),
      movieId: Joi.number().integer().min(1).required(),
    }),
  }),
  createMovie);

moviesRouter.delete('/:movieId',
  celebrate({
    params: Joi.object().keys({
      movieId: Joi.string().length(24).hex(),
    }),
  }),
  deleteMovie);

module.exports = moviesRouter;
