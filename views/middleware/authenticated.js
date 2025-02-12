export function authenticated(req, res, next) {
    if (!req.session.isLoggedIn) {
        return res.redirect('/login');
    }
    next();
}