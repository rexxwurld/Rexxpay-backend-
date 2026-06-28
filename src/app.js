const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// 🔥 CORE MIDDLEWARE
app.use(express.json());
app.use(cookieParser());

// 🔥 CORS (COOKIE SAFE)
app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://rexxpay.netlify.app"
    ],
    credentials: true
}));

// ROUTES
const authRoutes = require("./modules/auth/auth.routes");
const walletRoutes = require("./modules/wallet/wallet.routes");
const transactionRoutes = require("./modules/transaction/transaction.routes");

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);

// HOME
app.get("/", (req, res) => {
    res.send("RexxPay API Running...");
});

module.exports = app;