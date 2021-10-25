INSERT INTO departments(name)
VALUES
("Finance"),
("Technology"),
("Marketing");

INSERT INTO roles(role_title, salary, department_id)
VALUES
("Trader", "65000", 1),
("Programmer", "75000", 2),
("Designer", "60000", 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
("Jerry", "Smith", 1, 1),
("Manfred", "Toz", 2, 2),
("Ryan", "Reynolds", 3, 3);

