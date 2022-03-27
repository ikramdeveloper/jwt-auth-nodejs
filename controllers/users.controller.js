const usersDB = {
  users: require("../models/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, resp) => {
  const { username, pwd } = req.body;
  if (!username || !pwd) {
    return resp
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const findDuplicate = usersDB.users.find(
    (user) => user.username === username
  );
  if (findDuplicate)
    return resp.status(409).json({ message: "Such user already exists" });

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = { username, password: hashedPwd };

    usersDB.setUsers([...usersDB.users, newUser]);
    fsPromises.writeFile(
      path.join(__dirname, "..", "models", "users.json"),
      JSON.stringify(usersDB.users)
    );
    resp.status(200).json({ message: `User ${username} successfully created` });
  } catch (err) {
    resp.status(500).json({ err: err.message });
  }
};

module.exports = { handleNewUser };
