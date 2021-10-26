const mysql = require("mysql2");
const inquirer = require("inquirer");


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'company_db'
    },
    console.log('Connected to company_db database!')
);
const main = () => {
    
    inquirer.prompt({
        type: 'list',
        message: "What would you like to do?",
        name: "choices",
        choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
    }).then((data) => {
        if(data.choices==="View all departments"){
            db.query("SELECT * FROM departments",(err, data)=>{
                if(err){
                    throw err
                } else {
                    console.table(data)
                    main();
                }
            });
        } else if (data.choices  === "View all roles") {
            db.query("SELECT * FROM roles",(err, data)=>{
                if(err){
                    throw err
                } else {
                    console.table(data)
                    main();
                }
            });
        } else if (data.choices  === "View all employees") {
            db.query("SELECT * FROM employees AS Employees",(err, data)=>{
                if(err){
                    throw err
                } else {
                    console.table(data)
                    main();
                }
            });
        } else if (data.choices  === "Add a department") {
            db.query("SELECT * FROM departments", (err, data) => {
            if (err) {
                throw err
            } else {
                console.log("department added!")
            };

    inquirer
      .prompt([
        {
          type: "list",
          name: "department",
          message: "Which department would you like to add?",
          choices: function () {
            const newDepartment = data.map(({ id, name }) => ({
              name: name,
              value: id,
            }));
            return newDepartment;
          }
        },
      ])
      .then((data) => {
        db.query(
          "INSERT INTO departments(names)VALUES(?)," [data.department],
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
        } else if (data.choices  === "Add a role") {
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
                          console.log("role added!");
                          main();
                        }
                      }
                    );
                  });
              });    
        } else if (data.choices  === "Add an employee") {
            db.query("SELECT * FROM employees", (err, data) => {
                if (err) {
                    throw err;
                }
                
                inquirer
                .prompt([
                    {
                        type: "input",
                        name: "first_name",
                        message: "What is their first name?",
                    },
                    {
                        type: "input",
                        name: "last_name",
                        message: "What is their last name?",
                    },
                    {
                        type: "list",
                        name: "roles",
                        message: "What is the employees's role ID?",
                        choices: function () {
                            const newEmployee = data.map(({ role_id, title }) => ({
                            name: title,
                            value: role_id,
                        }));
                            return newEmployee;
                        },
                        },
                        {
                            type: "list",
                            name: "manager",
                            message: "Which manager oversees this employee?",
                            choices: function () {
                                const employeeManager = data.map(({ id, first_name, last_name }) => ({
                                name: `${first_name} ${last_name}`, 
                                value: id,
                            }));
                                return employeeManager;
                            }
                        }
                    ]).then((data) => {
                        db.query(
                            "INSERT INTO employees (first_name, last_name, role_id, manager_id)VALUES (?,?,?,?)",
                            [data.first_name, data.last_name, data.role, data.manager],
                            (err, data) => {
                            if (err) {
                                throw err;
                            } else {
                                console.log("employee added!");
                                main();
                            }
                        }
                    );
                });
            });    
        } else if (data.choices === "Update an employee role") {
            db.query("SELECT * FROM employees", (err, data1) => {
                if (err) {
                    throw err;
                }
            db.query("SELECT * FROM roles", (err, data)=> {
                if (err) {
                    throw err;
                }
            })

                inquirer.prompt([
                    {
                        type: "list",
                        name: "name",
                        message: "Which employee's role would you like to update?",
                        choices: function () {
                            const updateEmployee = data1.map(({ id, first_name, last_name}) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }))
                            return updateEmployee;
                        }
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "What new role would you like to assign to this employee?",
                        choices: function () {
                            const updateRole = data1.map(({ id, title}) => ({
                                name: title, 
                                value: id
                            }))
                            return updateRole;
                        }
                    }
                ]).then((data) => {
                    db.query("UPDATE employees SET role_id=? WHERE employees.id=?", [data.role, data.name], (err, data) => {
                        if (err) {
                            throw err;
                        } else {
                            console.log("employee has been updated!")
                        }
                        main();
                    })
                })
            })
        }
    })
}
main();