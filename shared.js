import fs from "fs"

export const readPetsFile = fs.readFile("pets.json", "utf-8", (err, str) => {
    return JSON.parse(str);
});