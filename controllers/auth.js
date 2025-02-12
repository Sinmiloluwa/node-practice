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
    const email = req.body.email;
    const password = req.body.password;
     User.findOne({email : email}).then(user => {
        if (!user) {
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then(result => {
            if (!result) {
                return res.redirect('/login');
            }
            req.session.user = user;
            req.session.isLoggedIn = true;
            req.session.save(err => {
                res.redirect('/');
                console.log(err);
            })
        })
        .catch(err => {
            res.redirect('/login');
            console.log(err);
        });
    })
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
        .then(hashedPassword => {
            const user = new User({
                email: email,
                password: hashedPassword,
                name: username,
                cart: {items: []}
            });
            return user.save();
        })
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => console.log(err));
}
