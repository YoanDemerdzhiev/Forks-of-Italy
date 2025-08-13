import mongoose, { Schema, model } from 'mongoose';
import { type } from 'os';

const recipeSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        minLength: [2, 'Title must be at least 2 characters long']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        minLength: [10, 'Description must be at least 10 characters long'],
        maxLength: [150, 'Description must be at most 500 characters long']
    },
    ingredients: {
        type: String,
        required: [true, 'Ingredients are required'],
        minLength: [10, 'Ingredients must be at least 10 characters long'],
        maxLength: [850, 'Ingredients must be at most 500 characters long']

    },
    instructions: {
        type: String,
        required: [true, 'Instructions are required'],
        minLength: [10, 'Instructions must be at least 10 characters long']
    },
    image: {
        type: String,
        required: [true, 'Image URL is required'],
        validate: [/^https?:\/\//i, 'Invalid image URL format' ]
            
        },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
        
    },
    recomends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
})

recipeSchema.method('getRecommends', async function() {
    return this.voted.map(x => x.id)
});

const Recipe = model('Recipe', recipeSchema);
export default Recipe;