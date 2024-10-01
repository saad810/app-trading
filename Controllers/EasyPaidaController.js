const User = require("../models/User");
const logger = require("../utils/logger");
const uuidv4 = require("uuid").v4;

exports.createEasyPaisaDeposit = async (req, res) => {
    try {
        const { email, balance, easypaisaNumber } = req.body;
        console.log(req.body);

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's balance
        const balanceAmnt = user.balance + balance;
        console.log("balance: ", balanceAmnt);

        await user.updateOne({
            balance: balanceAmnt,
            type: "deposit",
            method: "EasyPaisa",
            transactionId: uuidv4(), // Generate a unique transaction ID
            easypaisaNumber: easypaisaNumber,
            currency: "PKR",
        });

        // logger(`EasyPaisa Deposit of ${balance} by ${email}`, "payments.txt");

        console.log("Deposit successful:", email);
        res.status(200).json({
            //   message: "Deposit successful",
            balance: balanceAmnt,
            type: "deposit",
            method: "EasyPaisa",
        });
    } catch (error) {
        console.error("Error during deposit:", error);
        res.status(500).json({
            message: "Deposit failed. Please try again later.",
            error: error.message,
        });
    }
};

// 78978946456
exports.refundEasyPaisaDeposit = async (req, res) => {
    try {
        const { email, amount, easypaisaNumber } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.easypaisaNumber !== easypaisaNumber) {
            return res.status(400).json({ message: "Invalid EasyPaisa Number" });
        }

        if (user.balance < amount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        if (amount <= 0) {
            return res.status(400).json({ message: "Invalid refund amount" });
        }

        // Update the user's balance
        user.balance -= amount;
        await user.save();

        console.log("Refund successful:", email);

        res.status(200).json({ message: "Refund successful", balance: user.balance });
    } catch (error) {
        console.error("Error during refund:", error);
        res.status(500).json({
            message: "Refund failed. Please try again later.",
            error: error.message,
        });
    }
};
