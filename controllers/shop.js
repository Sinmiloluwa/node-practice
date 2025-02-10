import Product from '../models/product.js';
import Order from '../models/order.js';
import { name } from 'ejs';

export function getProducts(req, res, next) {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      isAuthenticated: req.isLoggedIn
    });
  }).catch(err => console.log(err));
    
} 

export function getIndex(req, res, next) {
  Product.find()
  .then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      isAuthenticated: req.isLoggedIn
    });
  }).catch(err => console.log(err));

}

export async function getCart(req, res, next) {
  await req.user.populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products,
        isAuthenticated: req.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

export function getCheckout(req, res, next) {
  res.render('/shop/checkout', {
    path: '/checkout',
    pageTitle: '/Checkout'
  })
}

export function viewProduct(req, res, next) {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        path: '/products',
        product: product,
        pageTitle: product.title,
        imageUrl: product.imageUrl,
        isAuthenticated: req.isLoggedIn
      })
    })
    .catch(err => {
      console.log(err);
    }) 
}

export function addToCart(req, res, next) {
  const prodId = req.body.productId;
  Product.findById(prodId).then(product => {
    return req.user.addToCart(product)
  }).then(result => {
    res.redirect('/cart');
    console.log(result);
  })
}

export function deleteProductFromCart(req, res, next) {
  const prodId = req.body.productId;
  req.user.removeFromCart(prodId)
  .then(() => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))
}

export function postOrder(req, res, next) {
  req.user.populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items.map(i => {
      return {
        quantity: i.quantity,
        product: {...i.productId._doc}
      }
    })

    const order = new Order({
      user : {
        name: req.user.name,
        userId: req.user
      },
      products: products
    
    });

   return order.save();
  }).then(result => {
    return req.user.clearCart()
    }).then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err))
}

export function getOrders(req, res, next) {
  Order.find({"user.userId": req.user._id})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.isLoggedIn
      });
    })
    .catch((err) => {
      console.error('Error fetching orders:', err);
      next(err);
    });
}