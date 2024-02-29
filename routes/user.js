const express = require("express");
const path = require("path");

const userController = require("../controllers/user");

const authorizationHandler = require("../middlewares/auth");

const router = express.Router();

router.post("/signUp", userController.signUp);
router.post("/login", userController.login);
router.get(
  "/premium",
  authorizationHandler.authenticateUser,
  userController.handlePremium
);
router.post(
  "/premium/update",
  authorizationHandler.authenticateUser,
  userController.updatePremium
);

router.get(
  "/leaderboard",
  authorizationHandler.authenticateUser,
  userController.getLeaderboard
);

router.post("/forgotPassword", userController.forgotPassword);

router.post("/changePassword", userController.changePassword);

router.get("/password/resetpassword/:uuid", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "reset.html"));
});

router.post("/password/resetpassword/:uuid", userController.resetPassword);


module.exports = router;
