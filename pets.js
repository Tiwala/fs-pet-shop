import fs from 'fs';

const subcommand = process.argv[2];
const indexNumber = process.argv[3];




fs.readFile('pets.JSON', 'utf-8', (err, str) => {
    const data = JSON.parse(str);
    // for (var i = 0; i < data.length; i++) {
    //     if (subcommand === `read ${i}`) {
    //         console.log(data[i]);
    //     }
    // }
    // for (var i = 0; i < data.length; i++) {
    //     switch (indexNumber) {
    //         case i.toString(): {
    //             console.log(data[i]);
    //         }
    //     }
    // }
    switch(subcommand) {
        case 'read': {
            if (indexNumber != undefined) {
                for (var i = 0; i < data.length; i++) {
                    if (indexNumber === i.toString()) {
                        console.log(data[i], 'data');
                    }
                }
            } else {
                console.log(data, 'data')
            }
        }
        case 'create':
        case 'update':
        case 'destroy':
        default: {
            console.error('Usage: node pets.js [read | create | update | destroy]');
        }
    }
})