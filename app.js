import path, { join } from 'path';

import express from 'express';
import urlencoded from 'body-parser';
import expressHbs from 'express-handlebars';
import getErrorPage from './controllers/error.js';
import { fileURLToPath } from 'url';
import connectDB from './utils/database.js';
import User from './models/user.js';


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
    User.findById("67a25164b47f5f5e7d91ecc6").then(user => {
        req.user = new User(user.name, user.email, user.cart, user._id);
        console.log(req.user);
        next();
    }).catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(getErrorPage)
app.use(async (req, res, next) => {
    req.db = connectDB();
    if (condition) {
      
    }
    next();
  });
app.listen(3000);  
