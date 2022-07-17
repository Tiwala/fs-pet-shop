import http from "http";
import fs from "fs";
import express from "express";

//idk how to use it logs undefined
import { readPetsFile } from "./shared.js"


const app = express();
const PORT = 6969;
const errorHandler = (err, req, res, next) => {
    if (err) {
    res.status(500).send('Error!');
    }
}


app.use(express.json());

// Just calling the full pets object
app.get("/pets", (req, res, next) => {
    getPets(req, res, next);
})

// calling specific index of pet
app.get("/pets/:index", (req, res, next) => {
    getPetsIndex(req, res, next);
})

app.post("/pets", (req, res, next) => {
    postNewPets(req, res, next);
})


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});






//functions

function getPets(req, res, next) {
    fs.readFile("pets.json", "utf-8", (err, str) => {
        if (err) {
            next(err);
        } else {
            res.send(str);
        }
    })
}

function getPetsIndex(req, res, next) {
    fs.readFile("pets.json", "utf-8", (err, str) => {
        const data = JSON.parse(str);
        const index = req.params.index;
        if (err) {
            next(err);
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
                next(err);
            } else {
                data.push(newPet);
                fs.writeFile("pets.json", JSON.stringify(data), (err) => {
                    if (err) {
                        next(err);
                    } else {
                        // JSON.stringify(newPet);
                        res.json(newPet);
                    }
                })
            }
        })
    }
}