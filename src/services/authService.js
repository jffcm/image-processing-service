import { UserModel } from "../models/userModel.js";
import { createRequire } from "module";
import { env } from 'process';
import { UserNotFoundError } from "../errors/UserNotFoundError.js";

const require = createRequire( import.meta.url );
const jwt = require('jsonwebtoken');

/**
 * @author João Martins <jffranciscomartins@gmail.com>
 */
export class AuthService {
    /**
     * @param {string} username 
     * @param {string} password
     */
    async login(username, password) {
        const user = await UserModel.findByUsername(username);
        if (!user) {
            throw new UserNotFoundError();
        } 

        const isPasswordValid = await UserModel.comparePassword(password, user.password);

        if (!isPasswordValid) {
            throw new InvalidCredentialsError();
        }

        const payload = { id: user.id, username: user.username, };
        const secretOrPrivateKey = env.JWT_SECRET;
        const options = { expiresIn: '1h', };

        return jwt.sign(payload, secretOrPrivateKey, options);
    }
}