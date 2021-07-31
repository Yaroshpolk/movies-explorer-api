const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const ServerErr = require('./middlewares/server-err');
const { mongoLink } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const cors = require('./middlewares/cors');
const router = require('./routes/index');

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

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => ServerErr(err, req, res, next));

app.listen(PORT);
