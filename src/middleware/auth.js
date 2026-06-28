const jwt = require("jsonwebtoken");
const auth = (req, res, next) => {

    console.log("Cookies:", req.cookies);

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
