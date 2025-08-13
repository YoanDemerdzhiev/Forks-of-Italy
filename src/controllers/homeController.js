import {Router} from 'express';
import recipeServices from '../services/recipeServices.js';
const homeController = Router();

homeController.get('/', async (req, res) => {
    const recipes = await recipeServices.getLastThree();
    
    res.render('home', { recipes });
});


export default homeController;
