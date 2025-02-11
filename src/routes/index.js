import { ImageController } from "../controllers/imageController.js";
import { UserController } from "../controllers/userController.js";
import { AuthController } from "../controllers/authController.js";

const imageController = new ImageController()
const userController = new UserController();
const authController = new AuthController();

export async function initializeRoutes(request, response) {
    const routes = {
        'POST /images': async () => await imageController.uploadImage(request, response),
        'POST /register': async () => await userController.create(request, response),
        'POST /login': async () => await authController.login(request, response), 
    };

    const routeKey = `${request.method} ${request.url}`;

    if (routes[routeKey]) {
        await routes[routeKey]();
    } 
}

