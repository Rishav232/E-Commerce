const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET||"thisismysecret";

const fetchUser = (req, res, next) => {

    const token = req.header("auth-token");
    if (!token) {
        res.send(401).send({ error: "Authticate using valid token" });
    }
    // console.log(JWT_SECRET);
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
}
module.exports = fetchUser;