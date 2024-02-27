const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Expense = sequelize.define(process.env.EXPENSE_TABLE, {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: Sequelize.INTEGER,
  category: Sequelize.STRING,
  description: Sequelize.STRING,
});

module.exports = Expense;
