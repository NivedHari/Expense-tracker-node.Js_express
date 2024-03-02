const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Download = sequelize.define("downloads", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  downloadUrl: {
    type: Sequelize.STRING,
    unique: true,
    notEmpty: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Download;
