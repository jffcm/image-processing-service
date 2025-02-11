import { DatabaseSync } from 'node:sqlite';

export const database = new DatabaseSync(':memory:');

function runSeed() {
    database.exec(`
        CREATE TABLE users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        ) STRICT`
    );
}

runSeed();
