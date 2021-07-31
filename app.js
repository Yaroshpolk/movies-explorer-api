const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const NotFoundErr = require('./errors/not-found-err');
const ServerErr = require('./middlewares/server-err');
const { mongoLink } = require('./utils/constants');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const auth = require('./middlewares/auth');
const cors = require('./middlewares/cors');

require('dotenv').config();

const { PORT = 3000, NODE_ENV, CURR_URL } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect(NODE_ENV === 'production' ? CURR_URL : mongoLink, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors);
app.use(requestLogger);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(20),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }).unknown(true),
  }),
  createUser);

app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login);

app.use('/users', auth, usersRouter);

app.use('/movies', auth, moviesRouter);

app.use(errorLogger);

app.use(errors());

app.use('/', () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден');
});

app.use((err, req, res, next) => ServerErr(err, req, res, next));

app.listen(PORT);
