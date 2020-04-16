const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");


// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)



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
        // console.log(employee)
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
        // console.log("inside app.js " + JSON.stringify(employee));



    } catch (err) {
        console.log(err);
    }
}



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

        const result = render(employeeObjects);
        console.log(result);

        fs.writeFile(outputPath, result, function (err) {

            if (err) {
                return console.log(err);
            }

        });
    }
)

// askQuestions().then(
//     async (employee) => {
//         const employeeObjects = [employee];
//         try {
//             const nextEmployee = await inquirer.prompt([
//                 {
//                     type: "list",
//                     message: "Would you like to add another employee?",
//                     name: "another",
//                     choices: [
//                         "yes",
//                         "no"
//                     ]
//                 },
//             ]);
//             if (nextEmployee.another == "yes") {
//                 employee = await askQuestions();
//                 employeeObjects.push(employee);
//             }
//         } catch (err) {
//             console.log(err);
//         }

//         const result = render(employeeObjects);
//         console.log(result);

//         fs.writeFile(outputPath, result, function (err) {

//             if (err) {
//                 return console.log(err);
//             }

//         });
//     }
// )



// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!



// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.



// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an 
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work!```
