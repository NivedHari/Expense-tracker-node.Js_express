const { response } = require("express");
const User = require("../models/user");
const Order = require("../models/order");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.signUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.log(err);
      }

      await User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => {
          return res.status(201).json({ user });
        })
        .catch((err) => {
          return res.status(500).json({ message: "Failed to create user" });
        });
    });
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      bcrypt.compare(password, user.password, (err, response) => {
        if (err) {
          console.log(err);
          return res.status(401).json({ message: "User not authorized" });
        }
        if (response) {
          res.status(200).json({
            message: "User login successful",
            token: generateToken(user.id, user.name, user.email),
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    });
};

exports.handlePremium = (req, res, next) => {
  const razorPay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const amount = 2500;
  razorPay.orders.create({ amount, currency: "INR" }, (err, order) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Failed to create order" });
    }
    req.user
      .createOrder({ orderId: order.id, status: "PENDING" })
      .then(() => {
        return res
          .status(201)
          .json({ order, key_id: process.env.RAZORPAY_KEY_ID });
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Failed to create order for user" });
      });
  });
};

exports.updatePremium = async (req, res, next) => {
  try {
    const payment_id = req.body.payment_id;
    const order_id = req.body.order_id;
    const order = await Order.findOne({ where: { orderId: order_id } });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    await order.update({ paymentId: payment_id, status: "SUCCESS" });

    await req.user.update({ isPremium: true });

    return res
      .status(202)
      .json({ success: true, message: "Transaction Successful" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.getLeaderboard = (req, res, next) => {
  User.findAll({
    attributes: ["name", "totalExpense"],
    order: [["totalExpense", "DESC"]],
  })
    .then((expenses) => {
      return res.json({ expenses });
    })
    .catch((err) => {
      console.log(err);
    });
  // Expense.findAll({
  //   attributes: [
  //     "userId",
  //     [sequelize.fn("SUM", sequelize.col("amount")), "total"],
  //   ],
  //   group: ["userId"],
  //   raw: true,
  //   include: [
  //     {
  //       model: User,
  //       attributes: ["name"],
  //     },
  //   ],
  //   order: [[sequelize.literal("total"), "DESC"]],
  // })
  //   .then((expenses) => {
  //     expenses.forEach((expense) => {
  //       const userName = expense["user.name"];
  //       const totalExpense = expense.total;
  //       console.log(`User: ${userName}, Total Expenses: ${totalExpense}`);
  //     });
  //     return res.json({ expenses });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
};

exports.forgotPassword = (req, res, next) => {
  const userEmail = req.body.email;

  const sender = {
    email: "nivedhari44@gmail.com",
    name: "Nived Hari",
  };

  const receivers = [{ email: `${userEmail}` }];

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "Reset your password",
      htmlContent: `<h1>Reset Your Password</h1>`,
    })
    .then(console.log)
    .catch(console.log);

};

function generateToken(id, name, email) {
  return jwt.sign({ userId: id, name: name, email: email }, "12345678910");
}
