import connectDB from "../utils/database.js";
import mongodb from 'mongodb';

class User {
    constructor(username, email, cart = { items: [] }, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

async save() {
    try {
        const db = await connectDB(); 
       
        const result = await db.collection("users").insertOne(this);

    } catch(err) {
        console.log(err)
    }
}

async addToCart(product)
{

    const cartProductIndex = this.cart.items && Array.isArray(this.cart.items)
    ? this.cart.items.findIndex(cp => cp.productId.toString() === product._id.toString())
    : -1; 


    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    console.log(updatedCartItems);

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
        updatedCartItems.push({ productId : new mongodb.ObjectId(product._id), quantity: newQuantity})
    }


    const updatedCart = {
        items: updatedCartItems
    };
    const db = await connectDB();
    return db.collection('users').updateOne({ _id : new mongodb.ObjectId(this._id)}, {$set : {cart: updatedCart}})

}

static async findById(userId) {
    const db = await connectDB();

    const result = db.collection('users').find({_id : new mongodb.ObjectId(userId)}).next()

    return result;
}
}

export default User;