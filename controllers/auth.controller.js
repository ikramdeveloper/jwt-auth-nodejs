const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");
require("dotenv").config();

const handleLogin = async (req, resp) => {
  const { username, pwd } = req.body;
  if (!username || !pwd)
    return resp
      .status(400)
      .json({ message: "Username and password are required" });

  const findUser = usersDB.users.find((user) => user.username === username);
  if (!findUser) return resp.sendStatus(401);

  const matchPwd = await bcrypt.compare(pwd, findUser.password);
  if (matchPwd) {
    const accessToken = jwt.sign(
      { username: findUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "60s" }
    );

    const refreshToken = jwt.sign(
      { username: findUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // saving refreshToken with currentUser
    const otherUsers = usersDB.users.filter(
      (user) => user.username !== findUser.username
    );
    const currentUser = { ...findUser, refreshToken };

    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );

    resp.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    // resp.cookie("jwt", refreshToken, {
    //   httpOnly: true,
    //   sameSite: "None",
    //   secure: true,
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    resp.status(200).json({ accessToken });
  } else {
    resp.sendStatus(401);
  }
};

module.exports = { handleLogin };
