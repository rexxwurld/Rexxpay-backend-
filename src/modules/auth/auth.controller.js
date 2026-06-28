const service = require("./auth.service");
const jwt = require("jsonwebtoken");

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

        const { user } = await service.login(email, password);

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            user,
            token
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


