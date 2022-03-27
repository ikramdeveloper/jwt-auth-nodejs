const express = require("express");
const { handleNewUser } = require("../controllers/users.controller");
const router = express.Router();

router.post("/", handleNewUser);

module.exports = router;
