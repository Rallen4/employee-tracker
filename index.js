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
            db.query("SELECT * FROM employees",(err, data)=>{
                if(err){
                    throw err
                } else {
                    console.table(data)
                    main();
                }
            });
        } else if (data.choices  === "Add a department") {
            db.query("INSERT INTO departments(name)VALUES(?)",[], (err, data)=>{
                if(err){
                    throw err
                } else {
                    console.table(data)
                    main();
                }
            });
        } else if (data.choices  === "Add a role") {
            inquirer.prompt(
                {
                    type: "list",
                    name: "title",
                    message: "What is the title of the role?",
                    choices: ["Manager", "Finance", "Technology"]
                },
                {
                    type: "input",
                    name: "salary",
                    message: "What is the salary of the role?"
                },
                {
                    type: "list",
                    name: "department",
                    message: "What is the department of the role?",
                    choices: ["Marketing", "Finance", "Technology"]
                }).then((data) => {
                    
                    db.query("INSERT INTO roles(role_title, salary, department_id)VALUES(?,?,?)",[data.title, data.salary, data.department], (err, data)=>{
                        if(err){
                            throw err
                        } else {
                            console.table(data)
                            main();
                        }
                    });
                });
                
            };
        });
}
main();
            
            //          else if (data.choices  === "Add an employee") {
    //         db.query("INSERT INTO employees(first_name, last_name, role_id, manager_id)VALUES(?,?,?,?)",[], (err, data)=>{
    //             if(err){
    //                 throw err
    //             } else {
    //                 console.table(data)
    //                 main();
    //             }
    //         });
    //     } else if (data.choices  === "Update an employee role") {
    //         db.query("SELECT *FROM employees WHERE role_id=?",[], (err, data)=>{
    //             if(err){
    //                 throw err
    //             } else {
    //                 console.table(data)
    //                 main();
    //             }
    //         });
    //     }
    // }
    