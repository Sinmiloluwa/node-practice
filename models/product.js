import { readFile, writeFile } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Cart from './cart.js';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);  
console.log(__dirname);           

const p = join( 
    'data', 
    'products.json'
);

const getProductsFromFile = cb => {
    readFile(p, (err, data) => {
        if (err) {
            cb([]);
        } else {
            cb(JSON.parse(data));
        }
        
    })
    
}

export default class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if(this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), (err) => {
                    console.log(err);
                })
            }
        })
        
        
    }

    static fetchAll(cb) {
        getProductsFromFile(cb)
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product)
        });
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const product = product.find(prod => prod.id === id);
            const updatedProducts = products.filter(prod => prod.id !== id);
            fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                if(!err) {
                Cart.deleteProduct(id, product.price);
                }
            })
        });
    }
}