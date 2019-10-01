const readline = require('readline');
const fs = require('fs');

const greeting = 'Welcome to Todo CLI!\n--------------------';
const options = '(v) View \u2022 (n) New \u2022 (cX) Complete \u2022 (dX) Delete \u2022 (s) Save \u2022 (q) Quit';
const checked = ' [\u2713] ';
const unchecked = ' [ ] ';

const scanner = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const tasks = [];

console.log(greeting);
console.log(options);

scanner.on('line', data => {

    switch (data[0]) {
        case 'v':

            console.log(printTasks());
            console.log(options);
            break;

        case 'n':

            scanner.question("What\n", task => {
                tasks.push(createTaskObj(task));
                console.log(options);
            });
            break;

        case 'c':

            completeTask(data[1]);
            console.log(options);
            break;

        case 'd':

            deleteTask(data[1]);
            console.log(options);
            break;

        case 'q':

            scanner.close();
            break;

        case 's':
            if (process.argv[3]) {
                saveFile(process.argv[3]);
            } else {
                scanner.question("Where\n", answer => {
                    saveFile(answer);
                });
            }
            break;

        case 'a':
            console.log(JSON.stringify(tasks));
            break;
    }
});

scanner.on('close', () => {
    console.log("See you soon 😁");
});

function createTaskObj(string) {
    return {
        completed: false,
        name: string
    };
}

function printTasks() {
    if (tasks.length === 0) {
        return 'List is empty...';
    }
    let message = "";
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            message += (i + checked + tasks[i].name);
        } else {
            message += (i + unchecked + tasks[i].name)
        }
        message += '\n';
    }
    return message;
}

function completeTask(code) {
    const index = parseInt(code);

    tasks[index].completed = true;

    console.log('Completed "' + tasks[index].name + '"');
}

function deleteTask(code) {
    const index = parseInt(code);
    const name = tasks[index].name;

    tasks.splice(index, 1);
    console.log("Deleted" + " \"" + name + "\"");
}

function saveFile(path) {
    fs.writeFile(path, JSON.stringify(tasks), (err) => {
        if (err) throw err;
        console.log(`Saved ${path}`);
    });
}

if (process.argv[2]) {
    fs.readFile(process.argv[2], {
        encoding: 'utf-8'
    }, (err, data) => {
        if (err) throw err;
        for (let i = 0; i < JSON.parse(data).length; i++) {
            tasks.push(JSON.parse(data)[i]);
        }
    });
}