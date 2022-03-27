const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, resp) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return resp.sendStatus(204); // no content
  const refreshToken = cookies.jwt;

  const findUser = usersDB.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!findUser) {
    // resp.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    resp.clearCookie("jwt", { httpOnly: true });
    return resp.sendStatus(204);
  }

  // Delete refresh token i db
  const otherUsers = usersDB.users.filter(
    (user) => user.username !== findUser.username
  );
  const currentUser = { ...findUser, refreshToken: "" };
  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "models", "users.json"),
    JSON.stringify(usersDB.users)
  );

  // resp.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  resp.clearCookie("jwt", { httpOnly: true });
  resp.sendStatus(204);
};

module.exports = { handleLogout };
