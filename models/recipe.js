const mongoose=require("mongoose");
const RecipeSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String,
    description: String,
    isVegetarian: Boolean,
    ingredients: [{
        name: String,
        quantity: String,
        measuringUnit:String
    }],
    steps: [String],
    servings: Number,
    prepTime: Number,
    cookTime: Number,
    totalTime: Number,
});
const RecipeModel = mongoose.model("Recipe",RecipeSchema);
module.exports = RecipeModel;