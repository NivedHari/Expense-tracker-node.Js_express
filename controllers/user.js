const User = require("../models/user");
const Order = require("../models/order");
const ResetRequest = require("../models/resetPassword");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.API_KEY;

const tranEmailApi = new Sib.TransactionalEmailsApi();

exports.signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create user" });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    return res.status(200).json({
      message: "User login successful",
      token: generateToken(user.id, user.name, user.email),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.handlePremium = async (req, res, next) => {
  const razorPay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const amount = 2500;
  try {
    const order = await razorPay.orders.create({ amount, currency: "INR" });
    const newOrder = new Order({
      orderId: order.id,
      status: "PENDING",
      userId: req.user._id,
    });
    await newOrder.save();
    return res.status(201).json({ order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create order" });
  }
};

exports.updatePremium = async (req, res, next) => {
  const payment_id = req.body.payment_id;
  const order_id = req.body.order_id;
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: order_id },
      { paymentId: payment_id, status: "SUCCESS" },
      { new: true }
    );

    if (!updatedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    await User.findByIdAndUpdate(req.user._id, { isPremium: true });

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

exports.getLeaderboard = async (req, res, next) => {
  try {
    const expenses = await User.find()
      .select("name totalExpense")
      .sort({ totalExpense: -1 });
    return res.json({ expenses });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const userEmail = req.body.email;

  const user = await User.findOne({ email: userEmail });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const requestId = uuidv4();

  console.log("request id:", requestId);

  // await user.createResetRequest({
  //   requestId: requestId,
  //   isActive: true,
  // });

  const newRequest = new ResetRequest({
    requestId: requestId,
    isActive: true,
    userId: user._id,
  });

  await newRequest.save();

  const resetUrl = `${process.env.WEBSITE}/user/password/resetpassword/${requestId}?email=${userEmail}`;
  const emailContent = `<h1>Reset Your Password</h1><hr> <h3>Click on the following button to <strong>reset your password</strong>:<br> ${resetUrl}</h3>`;

  console.log(resetUrl);

  const sender = {
    email: process.env.SENDER_EMAIL,
    name: process.env.SENDER_NAME,
  };

  const receivers = [{ email: `${userEmail}` }];

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "Reset your password",
      htmlContent: emailContent,
    })
    .then(() =>
      res.status(200).json({ message: "Reset password link sent successfully" })
    )
    .catch(console.log);
};

exports.resetPassword = async (req, res, next) => {
  const uuid = req.params.uuid;
  const resetRequest = await ResetRequests.findOne({ requestId: uuid });
  if (!resetRequest || !resetRequest.isActive) {
    return res
      .status(404)
      .json({ message: "Reset request not found or expired" });
  }
  res.sendFile(path.join(__dirname, "public", "reset.html"));
};

exports.changePassword = async (req, res, next) => {
  const { password, email, uuid } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hash = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate({ _id: user._id }, { password: hash });

    const request = await ResetRequest.findOne({ requestId: uuid });

    if (!request || !request.isActive) {
      return res
        .status(404)
        .json({ message: "Reset request not found or expired" });
    }
    await ResetRequest.findOneAndUpdate({ _id: request._id }, { isActive: false });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

function generateToken(id, name, email) {
  return jwt.sign({ userId: id, name: name, email: email }, process.env.TOKEN);
}
