const Expense = require("../models/expense");

exports.postExpense = (req, res, next) => {
  const amount = req.body.amount;
  const category = req.body.category;
  const description = req.body.description;

  Expense.create({
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
  Expense.findAll().then(expenses=>{
    console.log(expenses)
    return res.json({ expenses});
  }).catch();
};
