const express = require("express");
const path = require('path')

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

router.post("/user/forgotPassword", userController.forgotPassword);


router.post("/user/changePassword", userController.changePassword);

router.get('/password/resetpassword/:uuid', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'reset.html'));
});



router.post("/password/resetpassword/:uuid", userController.resetPassword);


module.exports = router;
