const express = require("express");
const mongoose=require("mongoose");
const cors = require("cors");
const UserModel = require('./models/users');
const RecipeModel = require('./models/recipe');
const GroceryModel = require('./models/grocery');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app=express();

app.use(express.json({limit: '20mb'}));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));

app.use(cors({
    origin:["http://localhost:3000"],
    methods:["GET","PUT","POST","DELETE"],
    credentials:true
}));
app.use(express.json());
mongoose.connect("mongodb+srv://Jebershon:jeber2004@cluster-1.igphlbw.mongodb.net/Culinary?retryWrites=true&w=majority");
// ------------------------------------------------------------------user------------------------------------------------------------------
app.post("/Login",(req,res)=>{
    const {Login_email,Login_password}=req.body;
    UserModel.findOne({email:Login_email})
    .then(user=>{
        if(user){
                bcrypt.compare(Login_password,user.password,(err,response)=>{
                if(response){
                    const token = jwt.sign({email:user.email,role:user.role,id : user._id},"jwt-secret-key",{expiresIn:'1d'});
                    return res.json({status:"Success", role : user.role , token:token});
                }
                else{
                    return res.json("Sorry Password Incorrect");
                }
            })
        } else{
              return res.json("No Record found");
        }
    })
})
app.post("/CreateUser",(req,res)=>{
    const {name, email, password, role}=req.body;
    let profilePicture="pic-no";
    bcrypt.hash(password,10).then(hash=>{
        UserModel.create({name, email, password : hash, role,profilePicture})
        .then(users => res.json({status:"ok"}))
        .catch(err => res.json(err));
    }).catch(err => res.json(err));
})

app.get("/FindUser/:id", (req, res) => {
    const id = req.params.id;
    UserModel.findById({ _id: id })
        .then(user => {
            res.json(user);
        })
        .catch(err => res.json(err));
});



app.put("/UpdateUser/:id", (req, res) => {
    const id = req.params.id;
    const { name,location,phoneNumber,avatar,email} = req.body;
    const updatedUser = {
        name,
        email,
        phoneNumber,
        location,
        profilePicture:avatar
    };
    UserModel.findByIdAndUpdate({_id:id}, updatedUser)
        .then(user => res.json(user))
        .catch(err => res.json(err));
});

app.post("/addToCart/:userId", async (req, res) => {
    const userId = req.params.userId;
    const groceryItem = req.body.groceryItem;
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.cart.push(groceryItem);
        await user.save();
        res.json(user.cart);
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/getCartDetails/:userId", (req, res) => {
    const userId = req.params.userId;
    UserModel.findById(userId)
        .then(user => {
            res.json(user.cart); // Return the cart details
        })
        .catch(error => {
            console.error("Error fetching cart details:", error);
            res.status(500).json({ error: "Failed to fetch cart details" });
        });
});


app.put("/updateCartItem/:userId/:itemId", (req, res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    const { count, quantity, price } = req.body;
    if (typeof count !== 'number' || typeof quantity !== 'number' || typeof price !== 'number') {
        return res.status(400).json({ error: "Invalid data format" });
    }

    UserModel.findOneAndUpdate(
        { _id: userId, "cart._id": itemId },
        {
            $set: {
                "cart.$.ingredientCount": count,
                "cart.$.ingredientQuantity": quantity,
                "cart.$.ingredientPrice": price
            }
        },
        { new: true } 
    )
    .then(updatedUser => {
        if (!updatedUser) {
            return res.status(404).json({ error: "User or cart item not found" });
        }
        res.json({ message: "Cart item updated successfully", updatedUser });
    })
    .catch(err => {
        console.error("Error updating cart item:", err);
        res.status(500).json({ error: "An error occurred while updating cart item" });
    });
});



app.delete("/removeCartItem/:userId/:itemId", (req, res) => {
    const userId = req.params.userId;
    const itemId = req.params.itemId;
    
    UserModel.findByIdAndUpdate(userId, { $pull: { cart: { _id: itemId } } })
        .then(() => {
            res.json({ message: "Cart item removed successfully" });
        })
        .catch(err => {
            console.error("Error removing cart item:", err);
            res.status(500).json({ error: "An error occurred while removing cart item" });
        });  
});
// ------------------------------------------------------------------Recipe------------------------------------------------------------------
app.post("/AddRecipe",(req,res)=>{
    RecipeModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})
app.get("/GetRecipe",(req,res)=>{
    RecipeModel.find({})
    .then(recipe => res.json(recipe))
    .catch(err => res.json(err))
})
app.get("/FindRecipe/:id",(req,res)=>{
    const id=req.params.id;
    RecipeModel.findById({_id:id})
    .then(recipe => res.json(recipe))
    .catch(err => res.json(err))
})
app.put("/UpdateRecipe/:id", (req, res) => {
    const id = req.params.id;
    const { name, description, isVegetarian, ingredients, steps, servings, prepTime, cookTime, totalTime, rating } = req.body;
    const updatedRecipe = {
        name,
        description,
        isVegetarian,
        ingredients,
        steps,
        servings,
        prepTime,
        cookTime,
        totalTime,
        rating
    };

    RecipeModel.findByIdAndUpdate({_id:id}, updatedRecipe)
        .then(recipe => res.json(recipe))
        .catch(err => res.json(err));
});
app.delete("/deleteRecipe/:id",(req,res)=>{
    const id=req.params.id;
    RecipeModel.findByIdAndDelete({_id:id})
    .then(recipe => res.json(recipe))
    .catch(err => res.json(err))
})
// ------------------------------------------------------------------Grocery------------------------------------------------------------------

app.post("/AddGrocery",(req,res)=>{
    GroceryModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.json(err))
})
app.get("/GetGrocery",(req,res)=>{
    GroceryModel.find({})
    .then(Grocery => res.json(Grocery))
    .catch(err => res.json(err))
})
app.get("/FindGrocery/:id",(req,res)=>{
    const id=req.params.id;
    GroceryModel.findById({_id:id})
    .then(Grocery => res.json(Grocery))
    .catch(err => res.json(err))
})
app.put("/UpdateGrocery/:id", (req, res) => {
    const id = req.params.id;
    const { name, quantity, price, image_url, category, unit } = req.body;
    const updatedGrocery = {
        name,
        quantity,
        price,
        image_url,
        category,
        unit
    };
    GroceryModel.findByIdAndUpdate({_id:id}, updatedGrocery)
        .then(grocery => res.json(grocery))
        .catch(err => res.json(err));
});
app.delete("/deleteGrocery/:id", (req, res) => {
    const id = req.params.id;
    GroceryModel.findByIdAndDelete(id)
        .then(Grocery => res.json(Grocery))
        .catch(err => res.json(err));
});

app.listen(3001,()=>{
    console.log("Running")
});