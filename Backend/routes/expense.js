const express = require("express");

const expenseController = require("../controllers/expense");

const authorizationHandler = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/expense/add",
  authorizationHandler.authenticateUser,
  expenseController.postExpense
);
router.get(
  "/expense",
  authorizationHandler.authenticateUser,
  expenseController.getExpense
);
router.delete(
  "/expense/:id",
  authorizationHandler.authenticateUser,
  expenseController.deleteExpense
);

router.get(
  "/expense/download",
  authorizationHandler.authenticateUser,
  expenseController.downloadExpense
);



module.exports = router;
