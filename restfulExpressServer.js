import http from "http";
import fs from "fs";
// When initializing, after you have a package.json, do npm i express to install express
// Make sure to put in "type" : "module" in package.json to import stuff
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

//idk how to use it logs undefined
import { readPetsFile } from "./shared.js"

//express() is signifying that you will be using expressJS
const app = express();
const PORT = 6969;

const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
}

// Error handler that is called when you call next and the errors fall through the conditionals
const internalError = (err, req, res, next) => {
    // if (err) {
    res.status(500).send('Internal Server Error');
    // }
}

// Middleware; essentially a passive skill that is always active
// This middleware automatically parses req.body so when you call it, it won't be undefined
app.use(express.json());



// Just calling the full pets object
app.get("/pets", (req, res, next) => {
    getPets(req, res, next);
})

// For calling specific index of pet
app.get("/pets/:index", (req, res, next) => {
    getPetsIndex(req, res, next);
})

// Allows you to post new pets
app.post("/pets", (req, res, next) => {
    postNewPets(req, res, next);
})

// Not done; replaces the entire object instead of only replacing specific key/value pair
app.patch("/pets/:index", (req, res, next)=> {
    petPatch(req, res, next);
})

// Works
app.delete("/pets/:index", (req, res, next) => {
    deletePet(req, res, next);
})

app.use(unknownHTTP);

// Calls the errorhandler
app.use(internalError);

// Starts the server; listens for requests on said port
app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});






//functions

// Calls pets
function getPets(req, res, next) {
    fs.readFile("pets.json", "utf-8", (err, str) => {
        if (err) {
            return next(err);
        } else {
            res.send(str);
        }
    })
}

function getPetsIndex(req, res, next) {
    fs.readFile("pets.json", "utf-8", (err, str) => {
        const data = JSON.parse(str);
        // req.params calls an object that contains everything in the parameter that starts with :
        const index = req.params.index;
        if (err) {
            return next(err);
        } else if (data[index] === undefined) {
            res.status(404);
            res.send(`Invalid index given: ${index}`);
        } else {
            res.send(data[index]);
        }
    })
}

function postNewPets(req, res, next) {
    const newPet = req.body;
    newPet.age = Number(newPet.age);
    console.log(newPet);
    console.log(newPet.age);
    if (isNaN(newPet.age) || newPet.age === '' || newPet.kind === '' || newPet.name === '') {
        res.status(400)
        res.send("Bad Request");
    } 
    else {
        fs.readFile("pets.json", "utf-8", (err, str) => {
        const data = JSON.parse(str);
        if (err) {
                return next(err);
            } else {
                data.push(newPet);
                fs.writeFile("pets.json", JSON.stringify(data), (err) => {
                    if (err) {
                        return next(err);
                    } else {
                        // JSON.stringify(newPet);
                        res.json(newPet);
                    }
                })
            }
        })
    }
}

function petPatch(req, res, next) {
    const index = req.params.index;
    const newPet = req.body;
    const newAge = newPet.age;
    const newName = newPet.name;
    const newKind = newPet.kind;
    newPet.age = Number(newPet.age);
    if (isNaN(newPet.age) || newPet.age === '' || newPet.kind === '' || newPet.name === '') {
        res.status(400)
        res.send("Bad Request");
    } else {
        fs.readFile("pets.json", "utf-8", (err, str) => {
            const data = JSON.parse(str);
            const patchedPet = data[index];
            if (err) {
                next(err);
            } else {
                if (newAge) {
                    patchedPet.age = newAge;
                }
                if (newName) {
                    patchedPet.name = newName;
                }
                if (newKind) {
                    patchedPet.kind = newKind;
                }
                fs.writeFile("pets.json", JSON.stringify(data), (err) => {
                    if (err) {
                        return next(err);
                    } else {
                        res.send(patchedPet);
                    }
                })
            }
        })
    }
}

function deletePet(req, res, next) {
    const index = req.params.index;
    fs.readFile("pets.json", "utf-8", (err, str) => {
        const data = JSON.parse(str);
        if (err) {
            next(err);
        } else {
            const deletedPet = data[index];
            data.splice(index, 1);
            fs.writeFile("pets.json", JSON.stringify(data), (err) => {
                if (err) {
                    return next(err);
                } else {
                    res.send(deletedPet);
                }
            })
        }
    })
}

//scratch

// let scratch = {
//     "trash": 1,
//     "poop": poopie
// }

