import path from 'path';

import { Router } from 'express';

import { getAddProduct, addProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct } from '../controllers/admin.js';

import { authenticated } from '../views/middleware/authenticated.js';

const router = Router();

// /admin/add-product => GET
router.get('/add-product', authenticated, getAddProduct);

// /admin/add-product => POST
router.post('/add-product', authenticated, addProduct);

router.get('/products', authenticated, getProducts);

router.get('/edit-product/:productId', authenticated, getEditProduct);

router.post('/edit-product', authenticated, postEditProduct);

router.post('/delete-product', authenticated, postDeleteProduct);

export default router;
