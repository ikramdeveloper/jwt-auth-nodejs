const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = (req, resp) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return resp.sendStatus(401);
  const refreshToken = cookies.jwt;

  const findUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!findUser) return resp.sendStatus(403); // Forbidden

  // evaluate jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || findUser.username !== decoded.username)
      return resp.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );
    resp.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
