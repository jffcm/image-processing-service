import { createServer, IncomingMessage } from 'node:http';
import { initializeRoutes } from './routes/index.js';

/**
 * @param {http.IncomingMessage} request 
 * @param {http.ServerResponse} response 
*/
async function handler(request, response) {
    initializeRoutes(request, response);
}

const server = createServer(handler);
server.listen(3000, () => {
    const { address, port } = server.address();
    console.log(`Server is running at http://${address}:${port}`);
});

