const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
// Initial questions to build employees with classes
async function askQuestions() {
    try {
        const employee = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the employee's name?"
            },
            {
                type: "input",
                name: "id",
                message: "What is the employee's id?"
            },
            {
                type: "input",
                name: "email",
                message: "What is the employee's email?"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "role",
                choices: [
                    "manager",
                    "engineer",
                    "intern"
                ]
            },
        ]);
        if (employee.role == "manager") {
            const managerInfo = await inquirer.prompt([
                {
                    type: "input",
                    name: "officeNumber",
                    message: "What is the manager's officeNumber?"
                },
            ]);
            return new Manager(employee.name, employee.id, employee.email, managerInfo.officeNumber);
        };
        if (employee.role == "engineer") {
            const engineerInfo = await inquirer.prompt([
                {
                    type: "input",
                    name: "github",
                    message: "What is the engineer's GitHub username?"
                },
            ]);
            return new Engineer(employee.name, employee.id, employee.email, engineerInfo.github);
        };
        if (employee.role == "intern") {
            const internInfo = await inquirer.prompt([
                {
                    type: "input",
                    name: "school",
                    message: "What is the intern's school?"
                },
            ]);
            return new Intern(employee.name, employee.id, employee.email, internInfo.school);
        };
    } catch (err) {
        console.log(err);
    }
}


//Begin looping functions for adding multiple employees
askQuestions().then(
    async (employee) => {
        const employeeObjects = [employee];
        try {
            let nextEmployee = await inquirer.prompt([
                {
                    type: "list",
                    message: "Would you like to add another employee?",
                    name: "another",
                    choices: [
                        "yes",
                        "no"
                    ]
                },
            ]);
            while (nextEmployee.another == "yes") {
                employee = await askQuestions();
                employeeObjects.push(employee);
                nextEmployee = await inquirer.prompt([
                    {
                        type: "list",
                        message: "Would you like to add another employee?",
                        name: "another",
                        choices: [
                            "yes",
                            "no"
                        ]
                    },
                ]);
            }
        } catch (err) {
            console.log(err);
        }
        // Generate file/html page of completed employee team
        const result = render(employeeObjects);

        fs.writeFile(outputPath, result, function (err) {

            if (err) {
                return console.log(err);
            }

        });
    }
)