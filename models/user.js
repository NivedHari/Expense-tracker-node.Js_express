const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const User = sequelize.define(process.env.USER_TABLE, {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: Sequelize.STRING,
  isPremium: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  totalExpense: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = User;

