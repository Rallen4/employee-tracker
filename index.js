const mysql = require("mysql2");
const inquirer = require("inquirer");


const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "company_db",
  },
  console.log("Connected to company_db database!")
);
const main = () => {
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "choices",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    })
    .then((data) => {
      switch (data.question) {
        case "View all departments":
            db.query("SELECT * FROM departments", (err, data) => {
                if (err) {
                  throw err;
                } else {
                  console.table(data);
                  main();
                }
              });
          console.log("View departments");
          main();
          break;

        case "View all roles":
          viewRoles();
          console.table(data);
          main();
          break;

        case "View all employees":
          viewEmployees();
          console.table(data);
          main();
          break;

        case "Add a role":
          addRole();
          console.table(data);
          main();
          break;

        case "Add an employee":
          addEmployee();
          console.table(data);
          main();
          break;

        case "Update an employee role":
          updateRoll();
          console.table(data);
          main();
          break;
      }
    });
};

function viewDepartments() {
  db.query("SELECT * FROM departments", (err, data) => {
    if (err) {
      throw err;
    } else {
      console.table(data);
      main();
    }
  });
}

function viewRoles() {
  db.query(
    "SELECT roles.title AS Title, roles.salary AS Salary, departments.name AS Department FROM roles JOIN departments ON roles.department_id = departments.id ;",
    (err, data) => {
      if (err) {
        throw err;
      } else {
        console.table(data);
        main();
      }
    }
  );
}

function viewEmployees() {
  db.query(
    `SELECT CONCAT(employees.first_name," ",employees.last_name) AS Employees, 
        roles.title AS Titles, 
        roles.salary AS Salary,
        departments.name AS Department, 
        employees.manager_id AS Manager
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        JOIN departments ON roles.department_id = departments.id ;`,
    (err, data) => {
      if (err) {
        throw err;
      } else {
        console.table(data);
        main();
      }
    }
  );
}

function addRole() {
  db.query("SELECT * FROM departments", (err, data) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department",
          message: "Which department is the role in?",
          choices: function () {
            const roleDepartment = data.map(({ id, name }) => ({
              name: name,
              value: id,
            }));
            return roleDepartment;
          },
        },
      ])
      .then((data) => {
        db.query(
          "INSERT INTO roles(role_title, salary, department_id)VALUES(?,?,?)",
          [data.title, data.salary, data.department],
          (err, data) => {
            if (err) {
              throw err;
            } else {
              console.table(data);
              main();
            }
          }
        );
      });
  });
}

function addEmployee() {
  db.query("SELECT * FROM employees", (err, dataManager) => {
    if (err) throw err;

    db.query("SELECT * FROM roles", (err, data) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "roles",
            message: "What is the employees role ID?",
            choices: function () {
              const newEmployee = data.map(({ id, name }) => ({
                name: title,
                value: id,
              }));
              return newEmployee;
            },
          },
          {
            type: "list",
            name: "manager",
            message: "Which manager oversees this employee?",
            choices: function () {
              const employeeManager = dataManager.map(
                ({ id, first_name, last_name }) => ({
                  name: `${first_name} ${last_name}`,
                  value: id,
                })
              );
              return employeeManager;
            },
          },
        ])
        .then((data) => {
          db.query(
            "INSERT INTO employees (first_name, last_name, role_id, manager_id)VALUES (?,?,?,?)",
            [data.first_name, data.last_name, data.role, data.manager],
            (err, data) => {
              if (err) {
                throw err;
              } else {
                console.table(data);
                main();
              }
            }
          );
        });
    });
  });
}
main();
