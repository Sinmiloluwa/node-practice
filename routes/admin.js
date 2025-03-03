import path from 'path';

import { Router } from 'express';

import { getAddProduct, addProduct, getProducts, getEditProduct, postEditProduct, deleteProduct } from '../controllers/admin.js';

import { authenticated } from '../views/middleware/authenticated.js';

import { check } from 'express-validator';

const router = Router();

// /admin/add-product => GET
router.get('/add-product', authenticated, getAddProduct);

// /admin/add-product => POST
router.post('/add-product', [
    check('title').isString()
    .isLength({min: 3})
    .trim(),
    check('image'),
    check('price').isFloat().trim(),
    check('description').isLength({min :5, max: 400}).trim()
], authenticated, addProduct);

router.get('/products', authenticated, getProducts);

router.get('/edit-product/:productId', authenticated, getEditProduct);

router.post('/edit-product', [
    check('title').isString()
    .isLength({min: 3})
    .trim(),
    check('image').trim(),
    check('price').isFloat().trim(),
    check('description').isLength({min :5, max: 400}).trim()
], authenticated, postEditProduct);

router.delete('/product/:productId', authenticated, deleteProduct);

export default router;
