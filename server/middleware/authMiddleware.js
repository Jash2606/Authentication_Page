const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function (req, res, next) {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(401).send({
                success: false,
                message: 'No authorization header provided',
            });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'No token provided',
            });
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = verified.userId;
        next();
    } catch (err) {
        res.status(401).send({
            success: false,
            message: 'Invalid token',
        });
    }
};
