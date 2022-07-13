import fs from 'fs';

const subcommand = process.argv[2];





fs.readFile('pets.JSON', 'utf-8', (err, str) => {
    const data = JSON.parse(str);
    switch(subcommand) {
        case 'read': {
            read(data);
            break;
        }
        case 'create': {
            create(data);
            break;
        }
        case 'update': {
            update(data);
            break;
        }
        case 'destroy': {
            destroy(data);
            break;
        }
        default: {
            console.error('Usage: node pets.js [read | create | update | destroy]');
            //exits
            process.exit(1);
        }
    }
})

function read(data) {
    let indexNumber = process.argv[3];
        if (indexNumber != undefined) {
            if (data[indexNumber] != undefined) {
                console.log(data[indexNumber])
            } else {
                console.log('Usage: node pets.js read INDEX')
            }
        } else {
        console.log(data, 'data')
    }
}

function create(data) {
    let petAge = process.argv[3];
    let petKind = process.argv[4];
    let petName = process.argv[5];
    let newPet = {
        'age': Number(`${petAge}`),
        'kind': petKind,
        'name': petName
    }
    data.push(newPet);
    fs.writeFile('pets.json', JSON.stringify(data), (err) => {
        if (err) {
            console.error('Usage: node pets.js create AGE KIND NAME');
        } else {
            console.log(newPet)
        }
    })
}

function update(data) {
    let index = process.argv[3];
    let petAge = process.argv[4];
    let petKind = process.argv[5];
    let petName = process.argv[6];
    if (data[index] != undefined) {
        data[index].age = Number(petAge);
        data[index].kind = petKind;
        data[index].name = petName;
        fs.writeFile('pets.json', JSON.stringify(data), (err) => {
            if (err) {
                console.error('Usage: node pets.js update INDEX AGE KIND NAME')
            } else {
                console.log(data[index]);
            }
        })
    } else {
        console.error('Usage: node pets.js update INDEX AGE KIND NAME')
    }
}

function destroy(data) {
    let index = process.argv[3];
    if (data[index] != undefined) {
        data.splice(index, 1);
        fs.writeFile('pets.json', JSON.stringify(data), (err) => {
            if (err) {
                console.error('Usage: node pets.js destroy INDEX');
            } else {
                console.log(data);
            }
        })
    } else {
        console.error('Usage: node pets.js destroy INDEX');
    }
}