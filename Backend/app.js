const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");

const sequelize = require("../Backend/utils/database");

const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ResetRequest = require("./models/resetPassword");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");

const app = express();
app.use(cors());

app.use(express.json());

app.use(userRoutes);
app.use(expenseRoutes);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(morgan("combined", { stream: accessLogStream }));

Expense.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
  foreignKey: "userId",
});
User.hasMany(Expense);
Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Order);
User.hasMany(ResetRequest);
ResetRequest.belongsTo(User);

app.use(express.static(path.join(__dirname, "public")));
console.log(express.static(path.join(__dirname, "public")));

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 3000, function () {
      console.log("Started application on port %d", process.env.PORT || 3000);
    });
  })
  .catch((err) => console.log(err));
