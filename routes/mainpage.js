const express = require("express");

const router = express.Router();

const mainPageController = require("../controllers/mainpage");

router.get("/dashboard", mainPageController.getDashboard);
router.get("/login", mainPageController.getlogin);
router.get("/signup", mainPageController.getsignup);
router.get("/forgot-password", mainPageController.getForgot);
router.get("/", mainPageController.gethomePage);

router.get("*", mainPageController.geterrorPage);

module.exports = router;
