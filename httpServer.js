// We import these modules to run their methods
import http from "http";
import fs from "fs";

// creates the server
const server = http.createServer((req, res) => {
    const url = new URL('http://localhost:6969' + req.url);
    console.log(url);
    let index = Number(url.pathname.substring(6));
    // If the request method is GET and the URL is /pets, shows them the data in pets.JSON
    // Else, sends a 404 Not Found status code
    console.log(index);
    // console.log(req.on('data', () => {
    //     console.log(data);
    // }))
    // console.log(req);
    if (req.method === 'GET' && req.url === '/pets') {
        accessPets(req, res);
    } else if (req.method === 'GET' && req.url === `/pets/${index}`) {
        accessPetIndex(req, res, index);
    } else if (req.method === 'POST' && req.url === '/pets') {
        postNewPets(req, res);
    } else {
        allElseFails(req, res);
    }
});






function accessPets(req, res) {
    fs.readFile('pets.JSON', 'utf-8', (err, data) => {
        // const data = JSON.parse(str);
        if (err) {
            console.error('Error')
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        }
    })
}

function accessPetIndex(req, res, index) {
    fs.readFile('pets.JSON', 'utf-8', (err, str) => {
        const parsedData = JSON.parse(str);
        const data = JSON.stringify(parsedData[index])
        if (err) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not found');
        } else if (parsedData[index] === undefined) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Not found');
        } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(data);
        }
    })
}

function postNewPets(req, res) {
    let body = '';
    // accesses the message on a post request
    req.on('data', (chunk) => {
    body += chunk;
    });
    req.on('end', () => {
        const newPet = JSON.parse(body);
        console.log(newPet);
        newPet.age = Number(newPet.age);
        console.log(newPet.age);
        fs.readFile('pets.JSON', 'utf-8', (err, str) => {
            if (err) {
                console.error('Error');
            } else {
                const existingPets = JSON.parse(str);
                existingPets.push(newPet);
                return fs.writeFile('pets.json', JSON.stringify(existingPets), (err) => {
                    if (err) {
                        console.error('Error');
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(newPet));
                    }
                })
            }
        })
    })
}

function allElseFails(req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not found');
}

server.listen(6969, () => {
    console.log('server started on port 6969');
});

// module.exports = server;