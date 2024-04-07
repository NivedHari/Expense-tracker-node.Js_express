const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const downloadSchema = new Schema({
  downloadUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Download", downloadSchema);

// const Sequelize = require("sequelize");
// const sequelize = require("../utils/database");

// const Download = sequelize.define("downloads", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     primaryKey: true,
//     allowNull: false,
//   },
//   downloadUrl: {
//     type: Sequelize.STRING,
//     unique: true,
//     notEmpty: true,
//     allowNull: false,
//   },
//   userId: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
// });

// module.exports = Download;
