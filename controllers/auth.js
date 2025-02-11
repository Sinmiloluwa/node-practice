import User from '../models/user.js';

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
