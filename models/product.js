import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default mongoose.model('Product', productSchema);

// import connectDB from "../utils/database.js";
// import mongodb from 'mongodb';

// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id ? new mongodb.ObjectId(id) : null;
//         this.userId = userId;
//     }

//     async save() {
//         try {
//             const db = await connectDB(); 
//             let result;
//             if (this._id) {
//                 result = db.collection('products').updateOne({
//                     _id : new mongodb.ObjectId(`${this._id}`)
//                 }, {$set: this});
//             } else {
//                 result = await db.collection("products").insertOne(this);
//             }
//           return result;
//         } catch (err) {
//           console.error("❌ Error saving product:", err);
//         }
//       }

//       static async fetchAll() {
//         try {
//             const db = await connectDB(); 
//             const result = await db.collection('products').find().toArray();
//             return result;
//         } catch (err) {
//             console.error('No products found')
//         }
//       }

//       static async getOneProduct(prodId) {
//         try {
//             const db = await connectDB();
//             const result = db.collection('products').find({ 
//                 _id: new mongodb.ObjectId(`${prodId}`) 
//             }).next();
//             return result;
//         } catch (err) {
//             console.error('No products found')
//         }
//       }

//       static async deleteById(prodId)
//       {
//         try {
//             const db = await connectDB();
//             db.collection('products').deleteOne({
//                 _id: new mongodb.ObjectId(prodId)
//             })
//         } catch (error) {
//             console.log(error)
//         }
         
//       }
// }

// export default Product;