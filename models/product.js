import connectDB from "../utils/database.js";
import mongodb from 'mongodb';

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    async save() {
        try {
          const db = await connectDB(); 
          const result = await db.collection("products").insertOne(this);
          console.log("✅ Product Saved:", result);
        } catch (err) {
          console.error("❌ Error saving product:", err);
        }
      }

      static async fetchAll() {
        try {
            const db = await connectDB(); 
            const result = await db.collection('products').find().toArray();
            return result;
        } catch (err) {
            console.error('No products found')
        }
      }

      static async getOneProduct(prodId) {
        try {
            const db = await connectDB();
            const result = db.collection('products').find({ 
                _id: new mongodb.ObjectId(`${prodId}`) 
            }).next();
            return result;
        } catch {
            console.error('No products found')
        }
      }
}

export default Product;