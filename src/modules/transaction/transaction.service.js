const mongoose = require("mongoose");
const Wallet = require("../wallet/wallet.model");
const Transaction = require("./transaction.model");

const transfer = async (
    senderId,
    receiverAccountNumber,
    amount,
    description
) => {

    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        amount = Number(amount);

        const senderWallet = await Wallet.findOne({ userId: senderId }).session(session);

        if (!senderWallet) throw new Error("Sender wallet not found");

        if (senderWallet.balance < amount) {
            throw new Error("Insufficient balance");
        }

        const receiverWallet = await Wallet.findOne({
            accountNumber: receiverAccountNumber
        }).session(session);

        if (!receiverWallet) throw new Error("Receiver wallet not found");

        if (senderWallet.accountNumber === receiverWallet.accountNumber) {
            throw new Error("Cannot transfer to self");
        }

        senderWallet.balance -= amount;
        await senderWallet.save({ session });

        receiverWallet.balance += amount;
        await receiverWallet.save({ session });

        const transaction = await Transaction.create([{
            sender: senderId,
            receiver: receiverWallet.userId,
            amount,
            description, // ✅ now defined
            type: "transfer",
            status: "success"
        }], { session });

        await session.commitTransaction();
        session.endSession();

        return transaction;

    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
};


        






// GET USER TRANSACTIONS


const getUserTransactions = async (userId) => {

    const transactions = await Transaction.find({
        $or: [
            { sender: userId },
            { receiver: userId }
        ]
    })
    .sort({ createdAt: -1 })
    .populate("sender", "fullname email")
    .populate("receiver", "fullname email");

    // 🔥 ENHANCE DATA FOR FRONTEND
    return transactions.map(tx => {

        let direction = "unknown";

        if (tx.sender && tx.sender._id.toString() === userId.toString()) {
            direction = "sent";
        }

        if (tx.receiver && tx.receiver._id.toString() === userId.toString()) {
            direction = "received";
        }

        return {
            _id: tx._id,
            amount: tx.amount,
            description: tx.description,
            type: tx.type,
            status: tx.status,
            direction,
            sender: tx.sender,
            receiver: tx.receiver,
            createdAt: tx.createdAt
        };
    });
};



// 🔥 IMPORTANT FIX: EXPORT FUNCTION
module.exports = {
    transfer,
    getUserTransactions
};
