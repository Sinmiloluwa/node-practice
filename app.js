import path, { join } from 'path';

import express from 'express';
import urlencoded from 'body-parser';
import expressHbs from 'express-handlebars';
import getErrorPage from './controllers/error.js';
import { fileURLToPath } from 'url';
import sequelize from './utils/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';

app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(getErrorPage)

sequelize.sync().then(result => {
    // console.log(result)
}).catch(err => {
    console.log(err);
});

app.listen(3000);
