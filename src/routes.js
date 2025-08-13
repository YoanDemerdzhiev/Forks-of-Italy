import { Router } from "express";
import homeController from './controllers/homeController.js';
import userController from './controllers/userController.js';
import recipesController from './controllers/recipesController.js';


const routes = Router();

routes.use(homeController);
routes.use('/users', userController);
routes.use('/recipes', recipesController);
routes.all('*url', (req, res) => {
    res.render('user/404');
});
export default routes;