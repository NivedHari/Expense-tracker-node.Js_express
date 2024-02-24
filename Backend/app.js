const express = require('express');
const cors = require("cors");

const sequelize = require('../Backend/utils/database')

const userRoutes = require('./routes/user');

const app = express();
app.use(cors());

app.use(express.json());

app.use(userRoutes);

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
