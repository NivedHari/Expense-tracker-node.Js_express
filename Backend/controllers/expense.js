const Expense = require("../models/expense");

exports.postExpense = (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "User not authorized" });
  }
  console.log("This is from controller", user);
  const amount = req.body.amount;
  const category = req.body.category;
  const description = req.body.description;

  user.createExpense({
    amount,
    category,
    description,
  })
    .then((expense) => {
      return res.status(201).json({ expense });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Failed to add expense" });
    });
};

exports.getExpense = (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  Expense.findAll({ where: { userId: userId } })
    .then((expenses) => {
      //   console.log(expenses);
      return res.json({ expenses });
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
