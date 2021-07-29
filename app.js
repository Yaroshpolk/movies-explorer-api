const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const NotFoundErr = require('./errors/not-found-err');
const ServerErr = require('./middlewares/server-err');
const { mongoLink } = require('./utils/constants');
const usersRouter = require('./routes/users');
const moviesRouter = require('./routes/movies');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

require('dotenv').config();

const {PORT = 3000} = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongoLink, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})

app.post('/signup', createUser);

app.post('/signin', login)

app.use('/users', auth, usersRouter);

app.use('/movies', auth, moviesRouter);

app.use('/', () => {
  throw new NotFoundErr('Запрашиваемый ресурс не найден')
});

app.use((err, req, res, next) => ServerErr(err, req, res, next));

app.listen(PORT,() => {
  console.log(`Server started with listening port ${PORT}`);
});