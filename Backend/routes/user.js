const express = require("express");

const userController = require("../controllers/user");

const authorizationHandler = require("../middlewares/auth");

const router = express.Router();

router.post("/user/signUp", userController.signUp);
router.post("/user/login", userController.login);
router.get(
  "/user/premium",
  authorizationHandler.authenticateUser,
  userController.handlePremium
);
router.post(
  "/user/premium/update",
  authorizationHandler.authenticateUser,
  userController.updatePremium
);

router.get(
  "/user/leaderboard",
  authorizationHandler.authenticateUser,
  userController.getLeaderboard
);

module.exports = router;
