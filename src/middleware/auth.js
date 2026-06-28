const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {

    console.log("Cookies:", req.cookies);

    const token = req.cookies.token;

    if (!token) {
        return res.redirect("/login");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: decoded.id,
            email: decoded.email
        };

        next();

    } catch (err) {
        return res.redirect("/login");
    }
};

module.exports = auth;
