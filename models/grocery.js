const mongoose=require("mongoose");
const GrocerySchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String,
    quantity: String,
    price: Number,
    image_url: String,
    category: String,
    unit: String 
});
const GroceryItemModel = mongoose.model("GroceryItem",GrocerySchema);
module.exports = GroceryItemModel;