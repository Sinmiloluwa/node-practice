import Product from '../models/product.js';
import Cart from '../models/cart.js';

export function getProducts(req, res, next) {
   Product.fetchAll((products) => {
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
   });
    
} 

export function getIndex(req, res, next) {
  Product.fetchAll((products) => {
    res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
   });
}

export function getCart(req, res, next) {
  res.render('shop/cart', {
    pageTitle: 'Your Cart',
    path: '/cart'
  })
}

export function getCheckout(req, res, next) {
  res.render('/shop/checkout', {
    path: '/checkout',
    pageTitle: '/Checkout'
  })
}

export function viewProduct(req, res, next) {
  const prodId = req.params.productId;
  const product = Product.findById(prodId, product => {
    res.render('shop/product-detail', {
      path: '/products',
      product: product,
      pageTitle: product.title,
      imageUrl: product.imageUrl
    })
  })
  
}

export function addToCart(req, res, next) {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  })
  res.redirect('/cart');
}