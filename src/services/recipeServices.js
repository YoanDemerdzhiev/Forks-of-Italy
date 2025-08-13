import e from "express";
import Recipe from "../models/Recipes.js";

export default {
    async create (recipeData) {
        await Recipe.create(recipeData);
    },
    getAll() {
        return Recipe.find().lean();
    },
    getOne(recipeId) {
        return Recipe.findById(recipeId).populate('recomends','owner');

    }, 
    deleteOne(recipeId) {
        return Recipe.findByIdAndDelete(recipeId);
    }, 
    getMyRecipes(userId) {
        return Recipe.find({ creator: userId }).lean();
    },
    async updateOne(recipeId, recipeData) {
        return await Recipe.findByIdAndUpdate(recipeId, recipeData, { runValidators: true });
    },
    async getLastThree() {
        return await Recipe.find().sort({_id: -1}).limit(3)
    }
}