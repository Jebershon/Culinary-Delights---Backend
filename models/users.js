const mongoose=require("mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role: String,
    id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: String,
    location: String,
    phoneNumber: String,
    profilePicture: String,
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purchase' }],
    cart: [{
      ingredientName: String,
      ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'GroceryItem' },
      ingredientPrice: Number,
      ingredientQuantity: Number,
      ingredientURL: String,
      ingredientCount : Number
    },],
});
const UserModel = mongoose.model("Users",userSchema);
module.exports = UserModel;