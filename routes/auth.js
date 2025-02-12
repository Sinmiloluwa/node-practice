import express from 'express';

import {getLogin, postLogin, logout, getSignup, postSignup} from '../controllers/auth.js';

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout', logout);

router.get('/signup', getSignup);

router.post('/signup', postSignup);


export default router;