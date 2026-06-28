const service = require("./auth.service");

exports.register = async (req, res) => {
    try {
        const user = await service.register(req.body);
        res.status(201).json({ message: "Registered", user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await service.login(email, password);

        // extract token from service result
        const { user, token } = result;

        // set cookie FIRST
        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // true in production (Render HTTPS)
            sameSite: "none",
            path: "/", // 🔥 add this
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // then send response
        res.status(200).json({
            message: "Login successful",
            user
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
        path: "/", // 🔥 add this
    });

    res.status(200).json({
        message: "Logged out successfully"
    });
};
