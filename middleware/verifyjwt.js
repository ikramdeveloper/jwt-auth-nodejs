const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, resp, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return resp.sendStatus(401);

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return resp.sendStatus(403); // invalid token
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
