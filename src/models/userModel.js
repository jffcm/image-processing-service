import sqlBricks from "sql-bricks";
import bcrypt from 'bcrypt';
import { TBL } from '../constants/index.js'
import { database } from "../config/sqlite.js";

/**
 * @author João Martins <jffranciscomartins@gmail.com>
 */
export class UserModel {

    constructor({ id, username, password }) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    /**
     * 
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<UserModel>}
     */
    static async create(username, password) {
        const salt = await this.genSalt();
        const hashedPassword = await this.hashPassword(password, salt); 

        const { text, values } = sqlBricks.insertInto(TBL, { username, password: hashedPassword })
            .toParams({ placeholder: '?' });
        
        const insert = database.prepare(text);
        const { lastInsertRowid } = insert.run(...values);

        return new UserModel({ id: lastInsertRowid, username, });
    }

    /**
     * @param {string | Buffer} password 
     * @param {string | number} salt
     * @returns {Promise<string>}
     */
    static async hashPassword(password, salt) {
        return bcrypt.hash(password, salt);
    }

    /**
     * @param {string | Buffer} password
     * @param {string} hash 
     * @returns {Promise<boolean>}
    */
    static async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }

    /**
     * @returns {Promise<string>}
    */
    static async genSalt() {
        return bcrypt.genSalt();
    }

    /**
     * @param {string} username
     * @returns {Promise<UserModel | null>}
    */
    static async findByUsername(username) {
        const sql = sqlBricks.select('*')
            .from(TBL)
            .where({ username })
            .toString();
        
        const select = database.prepare(sql);
        const user = select.get();
        return user ? new UserModel({ ...user }) : null;
    }
}