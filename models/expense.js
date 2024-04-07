const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  amount: {
    type: Number,
    requierd: true,
  },
  category: {
    type: String,
    requierd: true,
  },
  description: {
    type: String,
    requierd: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Expense", expenseSchema);

