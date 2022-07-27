import pg from 'pg'
import fs from 'fs'
import express from 'express'
import e from 'express';

const app = express()
const PORT = 6969;

// pools will use environment variables for connection information
const pool = new pg.Pool({
    // user: 'gerardsanjuan',
    // host: 'localhost',
    database: 'petshop'
});

const unknownHTTP = (req, res, next) => {
    res.sendStatus(404);
}

const internalError = (err, req, res, next) => {
    res.status(500).send('Internal Server Error');
}

app.use(express.json());

// Get all
app.get('/pets', (req, res, next) => {
    pool.query('SELECT * FROM pets').then((data) => {
        res.send(data.rows);
    }).catch(next)
})

// Get for specific ID
app.get('/pets/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query(`SELECT * FROM pets WHERE id = $1;`, [id]).then((data) => {
        const pet = data.rows[0];
        if (pet) {
            res.send(pet);
        } else {
            res.status(404);
            res.send(`Invalid ID given: ${id}`);
        }
    }).catch(next);
})

app.post('/pets', (req, res, next) => {
    const newPet = req.body;
    newPet.age = Number(newPet.age);
    if (isNaN(newPet.age) || newPet.age === '' || newPet.age === undefined || newPet.kind === '' || newPet.kind === undefined || newPet.name === '' || newPet.name === undefined) {
        res.status(400)
        res.send("Bad Request");
    } else {
        pool.query(`INSERT INTO pets (name, kind, age) VALUES ($1, $2, $3) RETURNING *;`, [newPet.name, newPet.kind, newPet.age]).then((data) => {
            res.send(data.rows[0]);
        }).catch(next);
    }
})

app.patch('/pets/:id', (req, res, next) => {
    const newPet = req.body;
    const id = req.params.id;
    if (isNaN(newPet.age) || newPet.age === '' || newPet.kind === '' || newPet.name === '') {
        res.status(400);
        res.send("Bad Request");
    } else {
        pool.query(`UPDATE pets
        SET name = COALESCE($1, name),
        age = COALESCE($2, age),
        kind = COALESCE($3, kind)
        WHERE id = $4
        RETURNING *;`, [newPet.name, newPet.age, newPet.kind, id]).then((data) => {
            if (data.rows.length === 0) {
                res.status(404)
                res.send(`Invalid ID given: ${id}`);
            } else {
                res.send(data.rows[0]);
            }
        })
        .catch(next);
    }
})

app.delete('/pets/:id', (req, res, next) => {
    const id = req.params.id;
    pool.query(`DELETE FROM pets WHERE id = $1 RETURNING *;`, [id]).then((data) => {
        if (data.rows[0] === undefined) {
            res.status(404);
            res.send(`Invalid ID given: ${id}`)
        } else {
            res.send(data.rows[0]);
        }
    }).catch(next);
})

// pool.query('SELECT * FROM pets').then((res) => {
//     console.log(res.rows);
//     pool.end();
// });

app.use(unknownHTTP);

app.use(internalError);

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})