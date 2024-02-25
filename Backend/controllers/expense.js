const Expense = require("../models/expense");
const User = require("../models/user");
const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

exports.postExpense = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "User not authorized" });
  }
  console.log("This is from controller", user);
  const amount = req.body.amount;
  const category = req.body.category;
  const description = req.body.description;

  user
    .createExpense({
      amount,
      category,
      description,
    })
    .then((expense) => {
      return res.status(201).json({ expense, user });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Failed to add expense" });
    });
};

exports.getExpense = (req, res, next) => {
  const user = req.user;
  console.log(user);
  Expense.findAll({ where: { userId: user.id } })
    .then((expenses) => {
      //   console.log(expenses);
      return res.json({ expenses, user });
    })
    .catch();
};

exports.deleteExpense = (req, res, next) => {
  const userId = req.user.id;
  const id = req.params.id;
  console.log(id);
  Expense.findOne({ where: { id: id, userId: userId } }).then((expense) => {
    expense.destroy().then(() => {
      res.status(200).json({ message: "Expense deleted successfully" });
    });
  });
};

exports.getLeaderboard = (req, res, next) => {
  Expense.findAll({
    attributes: [
      "userId",
      [sequelize.fn("SUM", sequelize.col("amount")), "total"],
    ],
    group: ["userId"],
    raw: true,
    include: [
      {
        model: User,
        attributes: ["name"],
      },
    ],
    order: [[sequelize.literal("total"), "DESC"]],
  })
    .then((expenses) => {
      expenses.forEach((expense) => {
        const userName = expense["user.name"];
        const totalExpense = expense.total;
        console.log(`User: ${userName}, Total Expenses: ${totalExpense}`);
      });
      return res.json({ expenses });
    })
    .catch((err) => {
      console.log(err);
    });
};
