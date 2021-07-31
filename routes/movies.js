const moviesRouter = require('express').Router();
const { deleteMovie, createMovie, getSavedMovies } = require('../controllers/movies');

moviesRouter.get('/', getSavedMovies);

moviesRouter.post('/', createMovie);

moviesRouter.delete('/:movieId', deleteMovie);

module.exports = moviesRouter;
