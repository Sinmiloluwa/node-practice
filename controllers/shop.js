import Product from '../models/product.js';

export function getProducts(req, res, next) {
  Product.find()
  .then(products => {
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
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
      productCSS: true
    });
  }).catch(err => console.log(err));

}

export function getCart(req, res, next) {
  req.user.getCart()
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products
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
        imageUrl: product.imageUrl
      })
    })
    .catch(err => {
      console.log(err);
    }) 
}

export function addToCart(req, res, next) {
  const prodId = req.body.productId;
  Product.getOneProduct(prodId).then(product => {
    return req.user.addToCart(product)
  }).then(result => {
    res.redirect('/cart');
    console.log(result);
  })
}

export function deleteProductFromCart(req, res, next) {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({where : {id : prodId}})
  }).then(products => {
    const product = products[0];
    return product.cartItem.destroy();
  }).then(() => {
    res.redirect('/cart')
  })
  .catch(err => console.log(err))
}

export function postOrder(req, res, next) {
  let fetchedCart;
  req.user.addOrder()
  .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err))
}

export function getOrders(req, res, next) {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => {
      console.error('Error fetching orders:', err);
      next(err);
    });
}