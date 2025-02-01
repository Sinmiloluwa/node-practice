import path, { join } from 'path';

import express from 'express';
import urlencoded from 'body-parser';
import expressHbs from 'express-handlebars';
import getErrorPage from './controllers/error.js';
import { fileURLToPath } from 'url';
import connectDB from './utils/database.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';

app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findByPk(1).then(user => {
//         req.user = user;
//         next();
//     }).catch(err => console.log(err));
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(getErrorPage)
app.use(async (req, res, next) => {
    req.db = connectDB;
    next();
  });
app.listen(3000);  
