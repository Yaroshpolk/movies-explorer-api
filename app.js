const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
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

const {PORT = 3000} = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet);

mongoose.connect(mongoLink, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

app.use(requestLogger);

app.post('/signup', createUser);

app.post('/signin', login)

app.use('/users', auth, usersRouter);

app.use('/movies', auth, moviesRouter);

app.use(errorLogger);

app.use('/', () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден')
});

app.use((err, req, res, next) => ServerErr(err, req, res, next));

app.listen(PORT,() => {
  console.log(`Server started with listening port ${PORT}`);
});