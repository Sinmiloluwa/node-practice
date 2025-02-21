import express from 'express';

import {check} from 'express-validator';

import User from '../models/user.js';

import {getLogin, postLogin, logout, getSignup, postSignup, getReset, postReset, getChangePassword, postChangePassword} from '../controllers/auth.js';

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', [
    check('email').isEmail().withMessage('Email is invalid')
    .normalizeEmail().trim()
    .custom((value, {req}) => {
        return User.findOne({email: value})
            .then(userDoc => {
                if (!userDoc) {
                    return Promise.reject('Email does not exist');
                }
            })
    }),
    check('password', 'Password has to be valid')
    .trim()
    .isLength({min: 5}).isAlphanumeric()
],postLogin);

router.post('/logout', logout);

router.get('/signup', getSignup);

router.post('/signup', [check('email')
                         .isEmail()
                         .withMessage('Email is invalid')
                         .normalizeEmail().trim()
                         .custom((value, { req }) => {
                            return User.findOne({email: value})
                                .then(userDoc => {
                                    if (userDoc) {
                                        return Promise.reject('Email already exists');
                                    }
                                })
                            // if (value === 'test@test.com') {
                            //     throw new Error('This email is forbidden');
                            // }
                         }),
                         check(
                            'password',
                            'Please enter a password with only numbers and text and at least 5 characters.'
                        ).isLength({min: 5}).isAlphanumeric(),
                        check('confirmPassword').custom((value, { req }) => {
                            if (value !== req.body.password) {
                                throw new Error('Passwords have to match!');
                            }
                            return true;
                        })
                        ], 
                         postSignup);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/change-password/:token', getChangePassword);

router.post('/change-password', postChangePassword);

export default router;