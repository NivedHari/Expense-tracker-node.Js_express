const Expense = require("../models/expense");
const User = require("../models/user");
const Sequelize = require("sequelize");
const AWS = require("aws-sdk");

const sequelize = require("../utils/database");

exports.postExpense = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "User not authorized" });
  }
  console.log("This is from controller", user);
  const amount = req.body.amount;
  const category = req.body.category;
  const description = req.body.description;

  try {
    await sequelize.transaction(async (t) => {
      const expense = await user.createExpense(
        {
          amount,
          category,
          description,
        },
        { transaction: t }
      );
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      const updatedUser = await User.findOne({
        where: { id: user.id },
        transaction: t,
      });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await updatedUser.update(
        { totalExpense: updatedUser.totalExpense + +expense.amount },
        { transaction: t }
      );
      return res.status(201).json({ expense, user: updatedUser });
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to Add expense" });
  }
};

// .then((expense) => {
//   User.findOne({ where: { id: user.id } }).then((user) => {
//     user
//       .update({ totalExpense: user.totalExpense + +expense.amount })
//       .then(() => {
//         return res.status(201).json({ expense, user });
//       })
//       .catch((err) => {
//         return res.status(500).json({ message: "Failed to find user" });
//       });
//   });
// })
// .catch((err) => {
//   return res.status(500).json({ message: "Failed to Add expense" });
// });

exports.getExpense = (req, res, next) => {
  const user = req.user;
  console.log(user);
  Expense.findAll({ where: { userId: user.id } })
    .then((expenses) => {
      //   console.log(expenses);
      return res.json({ expenses, user });
    })
    .catch();
};

// exports.deleteExpense = (req, res, next) => {
//   const userId = req.user.id;
//   const id = req.params.id;
//   console.log(id);
//   Expense.findOne({ where: { id: id, userId: userId } }).then((expense) => {
//     User.findOne({ where: { id: userId } }).then((user) => {
//       user.update({ totalExpense: totalExpense - +expense.amount });
//     });
//     expense.destroy().then(() => {
//       res.status(200).json({ message: "Expense deleted successfully" });
//     });
//   });
// };

exports.deleteExpense = async (req, res, next) => {
  const userId = req.user.id;
  const id = req.params.id;
  try {
    await sequelize.transaction(async (t) => {
      const expense = await Expense.findOne({
        where: { id: id, userId: userId },
        transaction: t,
      });
      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }
      const user = await User.findOne({
        where: { id: userId },
        transaction: t,
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await user.update(
        { totalExpense: user.totalExpense - +expense.amount },
        { transaction: t }
      );
      await expense.destroy({ transaction: t });

      return res.status(200).json({ message: "Expense deleted successfully" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete expense" });
  }
};

exports.downloadExpense = async (req, res, next) => {
  const userId = req.user.id;
  const expense = await Expense.findAll({ where: { userId: userId } });
  const stringifiedExpense = JSON.stringify(expense);
  const fileName = `Expense:${userId}/${new Date()}`;
  const fileURL = await uploadtoS3(stringifiedExpense, fileName);
  res.status(200).json({ fileURL, success: true });
};

function uploadtoS3(data, fileName) {
  return new Promise((resolve, reject) => {
    const BUCKET_NAME = "expense-tracker21";
    const IAM_USER_KEY = "AKIAYS2NSZ4FQMNJK45G";
    const IAM_USER_SECRET = "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";

    let bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
    });

    var params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: data,
      ACL: "public-read",
    };
    bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        console.log("success", s3response);
        resolve(s3response.Location);
      }
    });
  });
}
