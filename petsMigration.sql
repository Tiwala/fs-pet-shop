DROP TABLE IF EXISTS pets;

CREATE TABLE pets (
    id SERIAL,
    name TEXT,
    kind TEXT,
    age INTEGER
);

-- [{"age":7,"kind":"rainbow","name":"fido"},{"age":5,"kind":"snake","name":"Buttons"},{"age":7,"kind":"Pokemon","name":"Umbreon"},{"age":4,"name":"Trubbish","kind":"Pokemon"}]

INSERT INTO pets (name, kind, age) VALUES ('fido', 'rainbow', 7);
INSERT INTO pets (name, kind, age) VALUES ('Buttons', 'snake', 5);
INSERT INTO pets (name, kind, age) VALUES ('Umbreon', 'Pokemon', 7);
INSERT INTO pets (name, kind, age) VALUES ('Trubbish', 'Pokemon', 4);