import path from 'path';

import { Router } from 'express';

import { getIndex, getProducts, viewProduct, addToCart, getCart, getCheckout, deleteProductFromCart, postOrder } from '../controllers/shop.js';

const router = Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/product/:productId', viewProduct);

router.post('/add-to-cart', addToCart);

router.get('/cart', getCart);

router.get('/checkout', getCheckout);

router.post('/cart-delete-item', deleteProductFromCart);

router.post('/create-order', postOrder)

export default router;
