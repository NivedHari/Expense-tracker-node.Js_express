const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Order = sequelize.define(process.env.ORDER_TABLE, {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  paymentId: Sequelize.STRING,
  orderId: Sequelize.STRING,
  status: Sequelize.STRING,
});

module.exports = Order;
