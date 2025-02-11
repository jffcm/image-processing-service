import http from 'node:http';
import internal from 'node:stream';
import { pipeline } from 'node:stream/promises';
import Busboy from "busboy";
import { ImageService } from "../services/imageService.js";
import { ProblemDetails } from '../errors/error.js';

/**
 * @author João Martins <jffranciscomartins@gmail.com>
 */
export class ImageController {
    /**
     * @param {http.IncomingMessage} request 
     * @param {http.ServerResponse} response 
     */
    async uploadImage(request, response) {

        /**
         * @param {string} name 
         * @param {internal.Readable & { truncated?: boolean; }} stream 
         * @param {Busboy.FileInfo} info 
         */
        async function onFile(name, stream, info) {
            try {
                const imageService = new ImageService();

                const { filename, encoding, mimeType } = info;
                const { url } = await imageService.uploadImage(stream);
                
                response.writeHead(200, { 'Content-Type': 'application/json', });
                response.end(JSON.stringify({ url, filename, encoding, mimeType, }));
            } catch (error) {
                console.error(error);

                response.writeHead(500, { 'Content-Type': 'application/json', });

                const details = new ProblemDetails({ 
                    title: 'Image Upload Failed.',
                    status: response.statusCode,
                    detail: 'An error occurred while uploading the image.',
                });

                response.end(JSON.stringify(details));
            }
        }

        /**
         * @param {*} error 
         */
        function onError(error) {
            console.error(error);

            response.writeHead(500, { 'Content-Type': 'application/json', });

            const details = new ProblemDetails({ 
                title: 'File Processing Error.',
                status: response.statusCode,
                detail: 'An error occurred while processing the uploaded file.',
            });

            response.end(JSON.stringify(details));
        } 
    
        const busboy = Busboy({ headers: request.headers });

        busboy.on('file', onFile);
        busboy.on('error', onError);

        await pipeline(request, busboy);
    }
}

