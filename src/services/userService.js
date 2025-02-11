import { UserModel } from "../models/userModel.js";

/**
 * @author João Martins <jffranciscomartins@gmail.com>
 */
export class UserService {
    /**
     * 
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<UserModel>}
     */
    async create(username, password) {
        return UserModel.create(username, password);
    }
    /**
     * 
     * @param {string} username 
     * @returns {Promise<UserModel | null>}
     */
    async findByUsername(username) {
        return UserModel.findByUsername(username);
    }
}