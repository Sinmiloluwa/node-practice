import express from 'express';

import {getLogin, postLogin, logout} from '../controllers/auth.js';

const router = express.Router();

router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout', logout);


export default router;