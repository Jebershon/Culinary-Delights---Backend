const mongoose=require("mongoose");
const PurchaseSchema = new mongoose.Schema({
    purchaseid:{ type: mongoose.Schema.Types.ObjectId, auto: true },
    username: String,
    userEmail: String,
    address: String,
    recipeName: String,
    recipeExists: Boolean,
    groceryItems: [{
        name: String,
        quantity: String,
    }],
    totalPrice: String,
    purchaseDate: String,
    status: String,
    groceryId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroceryItem' },
    recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
});
const PurchaseModel = mongoose.model("Purchase",PurchaseSchema);
module.exports = PurchaseModel;