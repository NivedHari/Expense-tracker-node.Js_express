const express = require("express");

const expenseController = require("../controllers/expense");

const authorizationHandler = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/add",
  authorizationHandler.authenticateUser,
  expenseController.postExpense
);
router.get(
  "/",
  authorizationHandler.authenticateUser,
  expenseController.getExpense
);
router.delete(
  "/:id",
  authorizationHandler.authenticateUser,
  expenseController.deleteExpense
);

router.get(
  "/download",
  authorizationHandler.authenticateUser,
  expenseController.downloadExpense
);



module.exports = router;
