const User = require('../models/user');

module.exports.getUserById = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then(user => {
      if (!user) {

      }
    })
}