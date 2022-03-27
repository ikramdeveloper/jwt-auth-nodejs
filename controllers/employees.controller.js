const data = {
  employees: require("../models/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const getAllEmployees = (req, resp) => {
  resp.json(data.employees);
};

const getSingleEmployee = (req, resp) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );
  if (!employee) {
    return resp
      .status(400)
      .json({ message: `Employee with ID ${req.params.id} not found` });
  }
  resp.json(employee);
};

const createNewEmployee = (req, resp) => {
  const newEmployee = {
    id: data.employees?.length
      ? data.employees[data.employees.length - 1].id + 1
      : 1,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  if (!newEmployee.firstName || !newEmployee.lastName) {
    return resp
      .status(400)
      .json({ message: "First and last names are required" });
  }

  data.setEmployees([...data.employees, newEmployee]);
  resp.json(data.employees);
};

const updateEmployee = (req, resp) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );

  if (!employee) {
    return resp
      .status(400)
      .json({ message: `Employee ID: ${req.params.id} not found` });
  }

  if (req.body.firstName) employee.firstName = req.body.firstName;
  if (req.body.lastName) employee.lastName = req.body.lastName;

  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.params.id)
  );
  const unsortedArray = [...filteredArray, employee];
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );
  resp.json(data.employees);
};

const deleteEmployee = (req, resp) => {
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.params.id)
  );

  if (!employee) {
    return resp
      .status(400)
      .json({ message: `Employee ID: ${req.params.id} not found` });
  }

  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.params.id)
  );
  data.setEmployees(filteredArray);
  resp.json(data.employees);
};

module.exports = {
  getAllEmployees,
  getSingleEmployee,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
};
