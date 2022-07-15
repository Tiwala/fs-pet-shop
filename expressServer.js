import http from "http";
import fs from "fs";
import express from "express";

//idk how to use it logs undefined
import { readPetsFile } from "./shared.js"


const app = express();
const PORT = 6969;



const errorHandler = (err, req, res, next) => {
    if (err) {
    res.status(400).send('Error!');
    }
}


app.use(express.json());

// Just calling the full pets object
app.get("/pets", (req, res) => {
    fs.readFile("pets.json", "utf-8", (err, str) => {
        if (err) {
            next(err);
        } else {
            res.send(str);
        }
    })
})

// calling specific index of pet
app.get("/pets/:index", (req, res, next) => {
    fs.readFile("pets.json", "utf-8", (err, str) => {
        const data = JSON.parse(str);
        const index = req.params.index;
        if (err) {
            next(err);
        } else if (data[index] === undefined) {
            res.status(404);
            res.send(`Invalid index given: ${index}`);
        } else {
            res.send(data[index])
        }
    })
})

app.post("/pets", (req, res, next) => {
    res.json(req.body)
    const newPet = req.body;
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
                    JSON.stringify(newPet);
                }
            })
        }
    })
})


app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});