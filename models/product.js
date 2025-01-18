import db from '../utils/database.js';


export default class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        return db.execute('INSERT INTO products (title, price, image_url, description) VALUES (?, ?, ?, ?)', 
            [this.title, this.price, this.imageUrl, this.description]
        );
    }

    static fetchAll() {
        return db.execute(`SELECT * FROM products`);
    }

    static findById(id) {
        return db.execute('SELECT * FROM products WHERE products.id = ?',[id])
    }

    static deleteById(id) {
        
    }
}