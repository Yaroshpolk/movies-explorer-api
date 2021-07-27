const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { mongoLink } = require('utils/constants');

const {PORT = 3000} = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(mongoLink, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});



app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})