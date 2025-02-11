import { UserService } from "../services/userService.js";
import { once } from 'node:events';
import { ProblemDetails } from '../errors/error.js';

/**
 * @author João Martins <jffranciscomartins@gmail.com>
 */
export class UserController {
    /**
     * @param {http.IncomingMessage} request 
     * @param {http.ServerResponse} response 
     */
    async create(request, response) {
        try {
            const { username, password } = JSON.parse( await once(request, 'data') );
        
            const userService = new UserService(); 
            const user =  await userService.create(username, password);

            response.writeHead(201, { 'Content-Type': 'application/json', });
            return response.end(JSON.stringify(user));
        } catch (error) {
            console.error(error)
            if (error instanceof SyntaxError) {
                response.writeHead(400, { 'Content-Type': 'application/json', });

                const details = new ProblemDetails({ 
                    title: 'Invalid Request Format.',
                    status: response.statusCode,
                    detail: 'The request body is not valid JSON.',
                });

                return response.end(JSON.stringify(details));
            } 

            response.writeHead(500, { 'Content-Type': 'application/json', });

            const details = new ProblemDetails({ 
                title: 'Internal Server Error.',
                status: response.statusCode,
                detail: 'An unexpected error occurred on the server.',
            });

            return response.end(JSON.stringify(details));
        }
    }
}