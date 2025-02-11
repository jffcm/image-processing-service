import http from 'node:http';
import { AuthService } from '../services/authService.js'
import { once } from 'node:events';
import { ProblemDetails } from '../errors/error.js';
import { InvalidCredentialsError } from '../errors/invalidCredentialsError.js';
import { UserNotFoundError } from '../errors/UserNotFoundError.js';

/**
 * @author João Martins <jffranciscomartins@gmail.com>
 */
export class AuthController {
    /**
     * @param {http.IncomingMessage} request 
     * @param {http.ServerResponse} response 
     */
    async login(request, response) {
        try {
            const { username, password } = JSON.parse( await once(request, 'data') );

            const authService = new AuthService();
            const token = await authService.login(username, password);

            response.writeHead(200, { 'Content-Type': 'application/json', });
            response.end(JSON.stringify({ token, }));
        } catch (error) {
            console.error(error);
            if (error instanceof SyntaxError) {
                response.writeHead(400, { 'Content-Type': 'application/json', });

                const details = new ProblemDetails({ 
                    title: 'Invalid Request Format.',
                    status: response.statusCode,
                    detail: 'The request body is not valid JSON.',
                });

                return response.end(JSON.stringify(details));
            } 

            if (error instanceof UserNotFoundError) {
                response.writeHead(404, { 'Content-Type': 'application/json', });

                const details = new ProblemDetails({ 
                    title: 'User Not Found.',
                    status: response.statusCode,
                    detail: `The provided username does not exist in our system.`,
                });

                return response.end(JSON.stringify(details));
            } 

            if (error instanceof InvalidCredentialsError) {
                response.writeHead(401, { 'Content-Type': 'application/json', });

                const details = new ProblemDetails({ 
                    title: 'Authentication Failed.',
                    status: response.statusCode,
                    detail: 'Invalid username or password.',
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