// routes/payments.js
const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  refundPaymentIntent,
} = require("../Controllers/PaymentsController");
const {
  createEasyPaisaDeposit,
  refundEasyPaisaDeposit
   
} = require("../Controllers/EasyPaidaController");

router.post("/deposit", createPaymentIntent); // For deposits
router.post("/withdraw", refundPaymentIntent); // For withdrawals
router.post("/easy-deposit", createEasyPaisaDeposit); // For withdrawals
router.post("/easy-withdraw", refundEasyPaisaDeposit); // For withdrawals

module.exports = router;
