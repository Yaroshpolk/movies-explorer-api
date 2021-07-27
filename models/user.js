const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(valid) {
        return validator.isEmail(valid);
      },
    },
  },
  password: {
    type: String,
    minlength: 8,
    select: false,
    required: true,
  }
});

module.exports = mongoose.model('user', userSchema);