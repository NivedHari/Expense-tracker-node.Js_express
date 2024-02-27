const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const ResetRequest = sequelize.define(process.env.RESET_REQUEST_TABLE, {
  requestId: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
  },
});

module.exports = ResetRequest;
