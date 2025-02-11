import path, { join } from 'path';

import express from 'express';
import urlencoded from 'body-parser';
import expressHbs from 'express-handlebars';
import getErrorPage from './controllers/error.js';
import { fileURLToPath } from 'url';
import User from './models/user.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongoDBSession from "connect-mongodb-session";
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
    uri: 'mongodb+srv://mofeoluwae:eK6TL4wf1nvQq99M@cluster0.ac0yd.mongodb.net/simons',
    collection: 'sessions',
});

app.use(urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));
app.use(session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
}))

// app.use((req, res, next) => {
//     User.findById("67a71a76ebb85ec8a6bd4dd5").then(user => {
//         req.user = user;
//         next();
//     }).catch(err => console.log(err));
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(getErrorPage)
mongoose.connect('mongodb+srv://mofeoluwae:eK6TL4wf1nvQq99M@cluster0.ac0yd.mongodb.net/simons?retryWrites=true&w=majority&appName=Cluster0').then(result => {
    User.findOne().then(user => {
        if (!user) {
            const user = new User({
                name: "simons",
                email: "blvcksimons@gmail.com",
                cart: {
                    items: []
                }
            })
            user.save()
        }
    })
    
    app.listen(3000);
}).catch(err => {
    console.log(err)
})
