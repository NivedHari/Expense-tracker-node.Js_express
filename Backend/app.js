const express = require("express");
const cors = require("cors");

const sequelize = require("../Backend/utils/database");

const User = require("./models/user");
const Expense = require("./models/expense");

const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");

const app = express();
app.use(cors());

app.use(express.json());

app.use(userRoutes);
app.use(expenseRoutes);

Expense.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Expense);

const PORT = 3000;
sequelize
  .sync()
  // .sync({force:true})
  .then((result) => {
    app.listen(PORT, function () {
      console.log("Started application on port %d", PORT);
    });
  })
  .catch((err) => console.log(err));
