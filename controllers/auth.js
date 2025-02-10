export function getLogin(req, res, next) {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: req.isLoggedIn
    });
}

export function postLogin(req, res, next) {
    req.isLoggedIn = true;
    res.redirect('/');
}
