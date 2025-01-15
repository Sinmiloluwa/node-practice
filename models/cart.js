import fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);             
         


const p = join(__dirname, '..', 'data', 'cart.json');
console.log(p);

export default class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, 'utf-8', (err, fileContent) => {            
            let cart = {products: [], totalPrice: 0}
            if (!err && fileContent.trim() !== "") {
                try {
                    cart = JSON.parse(fileContent);  // Parse the file content to JSON
                } catch (parseError) {
                    console.log("Error parsing cart.json:", parseError);
                }
            }

            const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
            const existingProduct = cart.products[existingProductIndex]
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = {id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice = cart.totalPrice + +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err)
            });
        })
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, 'utf-8', (err, fileContent) => { 
            if (err) {
                return;
            }  
            const updatedCart = {...JSON.parse(fileContent)}
            const product = updatedCart.products.find(prod => prod.id === id);
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id === id);
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err);
            });

        })
    }
}