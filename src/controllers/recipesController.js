import {Router} from 'express';
import recipeServices from '../services/recipeServices.js';
import { isAuth } from '../middlewars/authMiddleware.js';
import { getErrorMessage } from '../utils/errorMessage.js';
import { AUTH_COOKIE_NAME } from '../config/index.js';
import userServices from '../services/userServices.js';
import Recipe from '../models/Recipes.js';

const recipesController = Router();

recipesController.get('/catalog', async (req, res) => {
    const recipes = await recipeServices.getAll();
    
    res.render('recipes/catalog', { recipes });
});

recipesController.get('/add', isAuth, (req, res) => {
    res.render('recipes/create');
});

recipesController.post('/add', isAuth, async (req, res) => {
    const recipeData = req.body;
    recipeData.owner = req.user.id;
    
    try {
        await recipeServices.create(recipeData);
        res.redirect('/recipes/catalog');
    } catch (error) {
        res.render('recipes/create', { error: getErrorMessage(error) });
    }
});

recipesController.get('/details/:id', async (req, res) => {
    const recipe = await recipeServices.getOne(req.params.id)
    const recipeData = await recipe.toObject();
   
    let isOwner = false
    let isRecomended = false
    if(req.isAuthenticated){
        
        isOwner = recipeData.owner.toString() === req.user.id
        isRecomended = recipeData.recomends.some(recommend => recommend._id.toString() === req.user.id)
        
    }

    res.render('recipes/details', {...recipeData, isOwner, isRecomended})

})

recipesController.get('/details/:id/recomended',isntOwner, isAuth , async (req,res) => {
    const recipe = await recipeServices.getOne(req.params.id)
    
    if (!recipe) {
            return res.redirect('/recipes/catalog'); 
        }

        
    try{
        recipe.recomends.push(req.user.id)
        await recipe.save()
    }catch(error){
        console.log(error)
    }

    res.redirect(`/recipes/details/${req.params.id}`)
})

recipesController.get('/edit/:id',isAuth,isOwner, async(req, res) => {
    let recipe = await recipeServices.getOne(req.params.id)

    res.render('recipes/edit', {...recipe.toObject()})
})

recipesController.post('/edit/:id', isAuth, isOwner, async(req,res) => {
    try{
        await recipeServices.updateOne(req.params.id,req.body)

        res.redirect(`/recipes/details/${req.params.id}`)
    }catch(error) {
        console.log(getErrorMessage(error))
        const recipe = await recipeServices.getOne(req.params.id)
        res.render(`recipes/edit`, {error: getErrorMessage(error), ...recipe.toObject()})
    }
})

recipesController.get('/delete/:id', isAuth, isOwner, async (req,res) => {
    try{
        await recipeServices.deleteOne(req.params.id);
        res.redirect('/recipes/catalog')
    }catch(error){
        res.render('/recipes/catalog', {error: getErrorMessage(error)})
    }
})


async function isOwner(req, res, next) {
    let recipe = await recipeServices.getOne(req.params.id);
    
    if (recipe.owner == req.user.id) {
        next();
    } else {
        res.redirect(`/recipes/details/${req.params.id}`);
    }
};

async function isntOwner(req, res, next) {
    let recipe = await recipeServices.getOne(req.params.id);

    if (recipe.owner !== req.user.id) {
        next();
    } else {
        res.redirect(`/recipes/details/${req.params.id}`);
        
    }
};


export default recipesController;
