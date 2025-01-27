import Product from '../models/product.js';

export function getProducts(req, res, next) {
  Product.findAll()
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
  Product.findAll()
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
  .then(cart => {
    return cart.getProducts()
    .then(products => {
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: products
      })
    })
    .catch(err => console.log(err))
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
  const product = Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        path: '/products',
        product: product[0],
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
  let fetchedCart;
  let newQuantity = 1;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts({where: {id : prodId}})
  }).then(products => {
    let product;
    if (products.length > 0) {
      product = products[0];
    }

    if (product) {
      const oldQuantity = product.cartItem.quantity;
      newQuantity = oldQuantity + 1;
      return product;
    }
    return Product.findByPk(prodId)
  }).then(product => {
    return fetchedCart.addProduct(product, {
      through: {quantity: newQuantity}
    })
  })
  .then(() => {
    res.redirect('/cart')
  })
 .catch(err => console.log(err))
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
  req.user.getCart()
  .then(cart => {
    return cart.getProducts()
  }).then(products => {
    return req.user.createOrder()
    .then(order => {
      return order.addProducts(products.map(product => {
        product.orderItem = {quantity: product.cartItem.quantity}
        return product;
      }));
    }).then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err))
    console.log(products)
  })
  .catch(err => console.log(err))
}