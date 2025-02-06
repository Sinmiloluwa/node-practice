import connectDB from "../utils/database.js";
import mongodb, { ObjectId } from 'mongodb';

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

async getCart() 
{
    const db = await connectDB();
    const prodIds = this.cart.items.map(i => {
        return i.productId;
    })
    return db.collection('products').find({_id : {
        $in : prodIds
    }}).toArray().then(products => {
        return products.map(p => {
            return {...p, quantity : this.cart.items.find(i => {
                return i.productId.toString() === p._id.toString()
            }).quantity
        }
        })
    })
    return this.cart
}

async deleteItemFromCart(prodId)
{
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() === prodId.toString();
    })

    const db = await connectDB();
    return db.collection('users').updateOne(
        { _id : new ObjectId(this._id)},
        { $set: { cart: {items: updatedCartItems}}}
    )
}

async addOrder() {
    const db = await connectDB();
    return this.getCart().then(products => {
        const order = {
            items: products,
            user: {
                _id: new ObjectId(this._id),
                name: this.name,
                email: this.email
            }
        }

        return db.collection('orders').insertOne(order)
    }).then(result => {
        this.cart = {items: []};
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id)},
            { $set : {cart: {items : []}}}
        )
    })
}

async getOrders()
{
    const db = await connectDB();
    // db.collection('orders')
}

static async findById(userId) {
    const db = await connectDB();

    const result = db.collection('users').find({_id : new mongodb.ObjectId(userId)}).next()

    return result;
}
}

export default User;