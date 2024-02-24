const User = require("../models/user");

exports.signUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    User.create({
      name,
      email,
      password,
    })
      .then((user) => {
        return res.status(201).json({ user });
      })
      .catch((err) => {
        return res.status(500).json({ message: "Failed to create user" });
      });
  });
};
