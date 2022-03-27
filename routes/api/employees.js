const express = require("express");
const router = express.Router();

const {
  getAllEmployees,
  getSingleEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../../controllers/employees.controller");

router.route("/").get(getAllEmployees).post(createNewEmployee);

router
  .route("/:id")
  .get(getSingleEmployee)
  .put(updateEmployee)
  .delete(deleteEmployee);

module.exports = router;
