const Expense = require("../models/expense");
const User = require("../models/user");
const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

exports.postExpense = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "User not authorized" });
  }
  console.log("This is from controller", user);
  const amount = req.body.amount;
  const category = req.body.category;
  const description = req.body.description;

  try {
    await sequelize.transaction(async (t) => {
      const expense = await user.createExpense(
        {
          amount,
          category,
          description,
        },
        { transaction: t }
      );
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      const updatedUser = await User.findOne({
        where: { id: user.id },
        transaction: t,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await updatedUser.update(
        { totalExpense: updatedUser.totalExpense + +expense.amount },
        { transaction: t }
      );
      return res.status(201).json({ expense, user: updatedUser });
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to Add expense" });
  }
};

// .then((expense) => {
//   User.findOne({ where: { id: user.id } }).then((user) => {
//     user
//       .update({ totalExpense: user.totalExpense + +expense.amount })
//       .then(() => {
//         return res.status(201).json({ expense, user });
//       })
//       .catch((err) => {
//         return res.status(500).json({ message: "Failed to find user" });
//       });
//   });
// })
// .catch((err) => {
//   return res.status(500).json({ message: "Failed to Add expense" });
// });

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

// exports.deleteExpense = (req, res, next) => {
//   const userId = req.user.id;
//   const id = req.params.id;
//   console.log(id);
//   Expense.findOne({ where: { id: id, userId: userId } }).then((expense) => {
//     User.findOne({ where: { id: userId } }).then((user) => {
//       user.update({ totalExpense: totalExpense - +expense.amount });
//     });
//     expense.destroy().then(() => {
//       res.status(200).json({ message: "Expense deleted successfully" });
//     });
//   });
// };

exports.deleteExpense = async (req, res, next) => {
  const userId = req.user.id;
  const id = req.params.id;
  try {
    await sequelize.transaction(async (t) => {
      const expense = await Expense.findOne({
        where: { id: id, userId: userId },
        transaction: t,
      });
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      const user = await User.findOne({
        where: { id: userId },
        transaction: t,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.update(
        { totalExpense: user.totalExpense - +expense.amount },
        { transaction: t }
      );
      await expense.destroy({ transaction: t });

      return res.status(200).json({ message: "Expense deleted successfully" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete expense" });
  }
};
