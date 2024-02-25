const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  const user = jwt.verify(token, "12345678910");
  User.findByPk(user.userId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};
