import path, { join } from 'path';

import express from 'express';
import urlencoded from 'body-parser';
import expressHbs from 'express-handlebars';
import { getErrorPage, getServerError} from './controllers/error.js';
import { fileURLToPath } from 'url';
import User from './models/user.js';
import csrf from 'csurf';
import multer from 'multer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import fs from 'fs';
import https from 'https';

dotenv.config();


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
import flash from 'connect-flash';

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
  );

const privateKey = fs.readFileSync('server.key');
const certificate = fs.readFileSync('server.cert');

const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
    uri: 'mongodb+srv://mofeoluwae:eK6TL4wf1nvQq99M@cluster0.ac0yd.mongodb.net/simons',
    collection: 'sessions',
});
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

app.use(urlencoded({ extended: false }));
app.use(multer({storage : fileStorage, fileFilter: fileFilter}).single('image'));
app.use(express.static(join(__dirname, 'public')));
app.use('/images',express.static(join(__dirname, 'images')));
app.use(session({
    secret: 'my secret', 
    resave: false, 
    saveUninitialized: false,
    store: store
}))

app.use(helmet());
app.use(compression());
app.use(morgan('combined', {stream: accessLogStream}));  

const csrfProtection = csrf({});
app.use(csrfProtection);
app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session?.isLoggedIn || false;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
       return next();
    }
    User.findById(req.session.user._id).then(user => {
       req.user = user;
        next();
    }).catch(err => {
        console.log('err')
        next(new Error(err))
    });
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(getErrorPage)
app.get('/500', getServerError);

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).render('500', { 
        pageTitle: 'Server Error',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
      });
})
mongoose.connect(process.env.MONGO_DATABASE).then(result => {
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
    
    // https.createServer({key: privateKey, cert: certificate}, app).listen(process.env.PORT || 3000);
    app.listen(process.env.PORT || 3000)
}).catch(err => {
    console.log(err)
})
