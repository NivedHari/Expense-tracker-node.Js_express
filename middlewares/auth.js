const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.authenticateUser = (req, res, next) => {
  const token = req.header("Authorization");
  const user = jwt.verify(token, process.env.TOKEN);
  User.findByPk(user.userId)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
};
