import path from 'path';

import { Router } from 'express';

import { getIndex, getProducts, viewProduct, addToCart, getCart, getCheckout, deleteProductFromCart, postOrder, getOrders, getInvoice } from '../controllers/shop.js';

import { authenticated } from '../views/middleware/authenticated.js';

const router = Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/product/:productId', viewProduct);

router.post('/add-to-cart', authenticated, addToCart);

router.get('/cart', authenticated, getCart);

// router.get('/checkout', getCheckout);

router.post('/cart-delete-item', authenticated, deleteProductFromCart);

router.post('/create-order', authenticated, postOrder);

router.get('/orders', authenticated, getOrders);

router.get('/orders/:orderId', authenticated, getInvoice);

export default router;
