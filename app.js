import path, { join } from 'path';

import express from 'express';
import urlencoded from 'body-parser';
import expressHbs from 'express-handlebars';
import getErrorPage from './controllers/error.js';
import { fileURLToPath } from 'url';
import sequelize from './utils/database.js';
import Product from './models/product.js';
import User from './models/user.js';
import Cart from './models/cart.js';
import CartItem from './models/cart-item.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';

app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        req.user = user;
        next();
    }).catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(getErrorPage)

Product.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem });

sequelize.sync().then(result => {
    // console.log(result)
    return User.findByPk(1);
}).then(user => {
    if(!user) {
        User.create({
            name:"Max",
            "email": "test@gmail.com"
        })
    }
    return user;
}).then(user => {
    // console.log(user)
    return user.createCart();
}).then(user => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});

