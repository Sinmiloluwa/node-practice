import User from '../models/user.js';
import bcrypt from 'bcryptjs';

export function getLogin(req, res, next) {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: req.session.isLoggedIn,
})
}

export function postLogin(req, res, next) {
     User.findById("67a71a76ebb85ec8a6bd4dd5").then(user => {
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save(err => {
                res.redirect('/');
                console.log(err);
            })
        }).catch(err => console.log(err));
}

export function logout(req, res, next) {
    req.session.destroy(err => {
        console.log(err);
        res.redirect('/')
    });
}

export function getSignup(req, res, next) {
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: req.session.isLoggedIn,
    })
}

export function postSignup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    User.findOne({email: email})
    .then(userDoc => {
        if (userDoc) {
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12)
    }).then(hashedPassword => {
        const user = new User({
            email: email,
            password: hashedPassword,
            name: username,
            cart: {items: []}
        });
        return user.save();
        res.redirect('/login');
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => console.log(err));
}
