const Expense = require("../models/expense");
const User = require("../models/user");
const Download = require("../models/download");

const AWS = require("aws-sdk");
const download = require("../models/download");

exports.postExpense = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "User not authorized" });
  }
  const { amount, category, description } = req.body;
  try {
    const newExpense = new Expense({
      amount,
      category,
      description,
      userId: user._id,
    });

    await newExpense.save();
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $inc: { totalExpense: amount } },
      { new: true }
    );
    res.status(201).json({
      message: "Expense added successfully",
      expense: newExpense,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

exports.getExpense = async (req, res, next) => {
  const user = req.user;
  const { limit, skip } = req.query;
  try {
    const count = await Expense.countDocuments({ userId: user._id });
    const expenses = await Expense.find({ userId: user._id })
      .limit(Number(limit))
      .skip(Number(skip));

    res.json({ count, expenses, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteExpense = async (req, res, next) => {
  const userId = req.user._id;
  const id = req.params.id;
  try {
    const deletedExpense = await Expense.findByIdAndDelete({ _id: id });
    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalExpense: -deletedExpense.amount } },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Expense deleted successfully", deletedExpense });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};

exports.downloadExpense = async (req, res, next) => {
  const user = req.user;
  const userId = req.user._id;
  const expense = await Expense.find({ userId: userId });
  const stringifiedExpense = JSON.stringify(expense);
  const fileName = `Expense:${userId}/${new Date()}`;
  const fileURL = await uploadtoS3(stringifiedExpense, fileName);
  const newDownload = new Download({
    downloadUrl: fileURL,
    userId: userId,
  });
  await newDownload.save()
  res.status(200).json({ fileURL, success: true });
};

function uploadtoS3(data, fileName) {
  return new Promise((resolve, reject) => {
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

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
