import path from 'path';

import { Router } from 'express';

import { getAddProduct, addProduct, getProducts, getEditProduct, postEditProduct } from '../controllers/admin.js';

const router = Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/add-product => POST
router.post('/add-product', addProduct);

router.get('/products', getProducts);

router.get('/edit-product/:productId', getEditProduct);

router.post('/edit-product', postEditProduct);

router.post('/delete-product');
export default router;
