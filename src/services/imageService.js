// @ts-check

import { v2 } from 'cloudinary';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

/**
 * @author João Martins <jffranciscomartins@gmail.com>
 */
export class ImageService {
    /**
     * @param {Readable} readable
     * @param {import("cloudinary").UploadApiOptions | undefined} [options]
     * @returns {Promise<import('cloudinary').UploadApiResponse | undefined>}
     */
    async uploadImage(readable, options) {

        /**
         * 
         * @param {(value: import('cloudinary').UploadApiResponse | undefined) => void} resolve 
         * @param {(reason?: import('cloudinary').UploadApiErrorResponse) => void} reject 
         */
        async function executor(resolve, reject) {
          const uploadStream = v2.uploader.upload_stream(options, (err, result) => {
            if (err) {
              return reject(err);
            } 
            resolve(result);
          });

          await pipeline(readable, uploadStream);
        }

        return new Promise(executor); 
    }
}
