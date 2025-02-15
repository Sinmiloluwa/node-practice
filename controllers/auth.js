import { error } from 'console';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "9346151b04fe1b",
        pass: "069f4219ee242c"
    }
});

export function getLogin(req, res, next) {
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: req.flash('error'),
})
}

export function postLogin(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
     User.findOne({email : email}).then(user => {
        console.log(user);
        if (!user) {
            console.log('Invalid email or password');
            req.flash('error', 'Invalid email or password');
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
      errorMessage: req.flash('error'),
    })
}

export function postSignup(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    User.findOne({email: email})
    .then(userDoc => {
        if (userDoc) {
            req.flash('error', 'Email already exists');
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
        return transporter.sendMail({
            to: email,
            from: 'blvcksimons@gmail.com',
            subject: 'Signup succeeded!',
            html: '<h1>You successfully signed up!</h1>'
        });
    
    })
    .catch(err => console.log(err));
}

export function getReset(req, res, next) {
    let message = req.flash('error-reset');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null; 
    }
    res.render('auth/reset-password', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    });
}

export function postReset(req, res, next) {
    console.log(req.body.email);
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: req.body.email}).then(user => {
            if(!user) {
                req.flash('error-reset', 'No account with that email found');
                return res.redirect('/reset');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        }).then(result => {
            res.redirect('/');
            transporter.sendMail({
                to: req.body.email,
                from: 'blvcksimons@gmail.com',
                subject: 'Password reset',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3000/change-password/${token}">link</a> to set a new password</p>
                `
        })
        .catch(err => {
            console.log(err);
        });
    })
})
}

export function getChangePassword(req, res, next) {
    const token = req.params.token;

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}}).then(user => {
        if (!user) {
            req.flash('error-change', 'Invalid token');
            return res.redirect('/change-password');
        }

        let message = req.flash('error-change');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null; 
    }
    res.render('auth/change-password', {
        path: '/change-password',
        pageTitle: 'Change Password',
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token
    })

    }).catch(err => console.log(err));
}

export function postChangePassword(req, res, next) {
    const password = req.body.password;
    const userId = req.body.userId;
    const token = req.body.passwordToken;

    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}, _id: userId}).then(user => {
        if (!user) {
            req.flash('error-change', 'Invalid token');
            return res.redirect('/change-password');
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            return user.save();
        })
        .then(result => {
            res.redirect('/login');
        }).catch(err => console.log(err));
    })
}

