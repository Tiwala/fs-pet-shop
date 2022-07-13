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
        case 'update':
        case 'destroy':
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
            console.error('error');
        } else {
            console.log(newPet)
        }
    })
}