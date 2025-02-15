import express from 'express';

import {getLogin, postLogin, logout, getSignup, postSignup, getReset, postReset, getChangePassword, postChangePassword} from '../controllers/auth.js';

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout', logout);

router.get('/signup', getSignup);

router.post('/signup', postSignup);

router.get('/reset', getReset);

router.post('/reset', postReset);

router.get('/change-password/:token', getChangePassword);

router.post('/change-password', postChangePassword);

export default router;