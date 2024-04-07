//start of app.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");

const PORT = process.env.PORT;



const User = require("./models/user");
const Expense = require("./models/expense");
const Order = require("./models/order");
const ResetRequest = require("./models/resetPassword");
const Download = require("./models/download");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const mainPageRouter = require("./routes/mainpage");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(express.static(path.join(__dirname, "public")));


app.use("/expense", expenseRoutes);
app.use("/user", userRoutes);
app.use(mainPageRouter);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

// Expense.belongsTo(User, {
//   constraints: true,
//   onDelete: "CASCADE",
//   foreignKey: "userId",
// });
// User.hasMany(Expense);
// Order.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
// User.hasMany(Order);
// User.hasMany(ResetRequest);
// ResetRequest.belongsTo(User);
// User.hasMany(Download);
// Download.belongsTo(User, { constraints: true, onDelete: "CASCADE" });


app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://checkout.razorpay.com"],
    },
  })
);


mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@shop.belb8l9.mongodb.net/${process.env.MONGO_COLLECTION}?retryWrites=true&w=majority&appName=shop`
  )
  .then(() => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", process.env.PORT || 3000);
    });
  })
  .catch((err) => console.log(err));
