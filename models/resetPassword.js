const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const requestSchema = new Schema({
  requestId: {
    type: mongoose.Types.UUID,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("ResetRequest", requestSchema);

// const Sequelize = require("sequelize");

// const sequelize = require("../utils/database");

// const ResetRequest = sequelize.define(process.env.RESET_REQUEST_TABLE, {
//   requestId: {
//     type: Sequelize.UUID,
//     allowNull: false,
//     primaryKey: true,
//   },
//   isActive: {
//     type: Sequelize.BOOLEAN,
//     defaultValue: true,
//   },
// });

// module.exports = ResetRequest;
