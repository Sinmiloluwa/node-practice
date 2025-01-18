import Product from '../models/product.js';
import Cart from '../models/cart.js';

export function getProducts(req, res, next) {
   Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(err => {
        console.log(err)
    });
    
} 

export function getIndex(req, res, next) {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: rows.length > 0,
        activeShop: true,
        productCSS: true
      });
    })
    .catch(err => {
        console.log(err)
    });

}

export function getCart(req, res, next) {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for(const product of products) {
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if(cartProductData) {
          cartProducts.push({productData: product, qty: cartProductData.qty});
        }
      }
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products: cartProducts
      })
    })
  
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
  const product = Product.findById(prodId)
    .then(([product]) => {
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
  Product.findById(prodId, (product) => {
    Cart.addProduct(prodId, product.price);
  })
  res.redirect('/cart');
}

export function deleteProductFromCart(req, res, next) {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  })
}