import Product from '../models/product.js';
import Order from '../models/order.js';
import fs from 'fs';
import path from 'path';
import order from '../models/order.js';
import PDFDocument from 'pdfkit';
import https from 'https';

const ITEMS_PER_PAGE = 2;

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
  const page = req.query.page || 1;
  let totalItems;

  Product.find().countDocuments().then(numProducts => {
    totalItems = numProducts;
    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  }).then(products => {
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      totalProducts: totalItems,
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasProducts: products.length > 0,
      hasPreviousPage: page > 1,
      nextPage: +page + 1,
      previousPage: +page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
      activeShop: true,
      productCSS: true,
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
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => console.log(err))
}

export async function getCheckout(req, res, next) {
  try {
    await req.user.populate('cart.items.productId');

    const products = req.user.cart.items;
    let total = 0;

    products.forEach(p => {
      total += p.quantity * p.productId.price;
    });

    const params = JSON.stringify({
      email: req.user.email,
      amount: total * 100,
    });

    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: '/transaction/initialize',
      method: 'POST',
      headers: {
        Authorization: 'Bearer sk_test_4b2',
        'Content-Type': 'application/json'
      }
    };

  
    const getAccessCode = () => {
      return new Promise((resolve, reject) => {
        const paystackRequest = https.request(options, paystackResponse => {
          let data = '';

          paystackResponse.on('data', chunk => {
            data += chunk;
          });

          paystackResponse.on('end', () => {
            try {
              const response = JSON.parse(data);
              resolve(response.data.access_code);
            } catch (error) {
              reject('Invalid JSON response from Paystack');
            }
          });
        });

        paystackRequest.on('error', error => {
          reject(error);
        });

        paystackRequest.write(params);
        paystackRequest.end();
      });
    };

    const accessCode = await getAccessCode();
    console.log('Access Code:', accessCode);

    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
      products: products,
      totalSum: total,
      accessCode: accessCode,
      isAuthenticated: req.session.isLoggedIn
    });

  } catch (err) {
    console.error(err);
    next(err);
  }
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
        isAuthenticated: req.session.isLoggedIn
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
  Order.find({"user.userId": req.session.user._id})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch((err) => {
      console.error('Error fetching orders:', err);
      next(err);
    });
}

export function getInvoice(req, res, next) {
  const orderId = req.params.orderId;
  Order.findById(orderId).then(order => {
    if (!order) {
      return next(new Error('No order found'));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Unauthorized'));
    }
    const invoiceName = 'invoice-' + orderId + '.pdf';
  const invoicePath = path.join('data', 'invoices', invoiceName);

  const pdfDoc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
  pdfDoc.pipe(fs.createWriteStream(invoicePath));
  pdfDoc.pipe(res);

  pdfDoc.fontSize(26).text('Invoice');
  pdfDoc.text('----------------------');
  let totalPrice = 0;
  order.products.forEach(prod => {
    pdfDoc.fontSize(13);
    totalPrice += prod.quantity * prod.product.price;
    pdfDoc.text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price);
  });

  pdfDoc.text('total price: $' + totalPrice);

  pdfDoc.end();
//   fs.readFile(invoicePath, (err, data) => {
//     if (err) {
//       return next(err);
//     }
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');
//     res.send(data);
//   })
  // const file = fs.createReadStream(invoicePath);

  // file.pipe(res);
  }).catch(err => next(err));
  
}

export function paystackPay(req, res, next) {
  const orderId = req.body.orderId; 
  console.log('ok');
}