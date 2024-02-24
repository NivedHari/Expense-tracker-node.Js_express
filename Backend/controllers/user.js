const { response } = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");

exports.signUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
      }

      await User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          return res.status(201).json({ user });
        })
        .catch((err) => {
          return res.status(500).json({ message: "Failed to create user" });
        });
    });
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      bcrypt.compare(password, user.password, (err, response) => {
        if (err) {
          console.log(err);
          return res.status(401).json({ message: "User not authorized" });
        }
        if (response) {
          res.status(200).json({ message: "User login successful" });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
};
