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
    }).then(data => {
        switch(data.question) {
            case "View all departments":
                viewDepartments();
            break; 

            case "View all roles":
            viewRoles();
            break;

            case "View all employees":
            viewEmployees();
            break;

            case "Add a role":
            addRole();
            break;

            case "Add an employee":
            addEmployee();
            break;

            case "Update an employee role":
            updateRoll();
            break;
        }
    });
}

function viewDepartments() {
    db.query("SELECT * FROM departments",(err, data)=>{
        if(err){
            throw err
        } else {
            console.table(data)
            main();
        }
    });
}

function viewRoles() {
    db.query("SELECT roles.title AS Title, roles.salary AS Salary, departments.name AS Department FROM roles JOIN departments ON roles.department_id = departments.id ;",(err, data)=>{
        if(err){
            throw err
        } else {
            console.table(data)
            main();
        }
    });
}

function viewEmployees() {
    db.query(`SELECT CONCAT(employees.first_name," ",employees.last_name) AS Employees, 
    roles.title AS Titles, 
    roles.salary AS Salary,
    departments.name AS Department, 
    employees.manager_id AS Manager`,(err, data)=>{
        if(err){
            throw err
        } else {
            console.table(data)
            main();
        }
    });
}

function addRole() {

}