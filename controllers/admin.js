import Product from '../models/product.js';
import mongodb from 'mongodb';

const ObjectId = mongodb.ObjectId;

export function getAddProduct(req, res, next) {
    res.render('admin/edit-product', { 
      pageTitle: 'Add Product', 
      path: '/admin/add-product', 
      formsCSS: true, 
      productCSS: true, 
      activeAddProduct: true,
      editing: false,
      });
}

export function addProduct(req, res, next) {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: description,
        userId: req.user
    });
    product.save()
    .then(result => {
        res.redirect('/admin/products')
    })
    .catch(err => console.log(err));
}

export function getEditProduct(req, res, next) {
    const editMode = req.query.edit;
    console.log(editMode);
    if (!editMode) {
        res.redirect('/')
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        if(!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', { 
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product', 
            editing: editMode,
            product: product,
        });
    }).catch(err => console.log(err))
}

export function postEditProduct(req, res, next) {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    console.log(updatedImageUrl);

    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        product.imageUrl = updatedImageUrl;
        return product.save()
    })
    .then(result => {
        console.log('UPDATED PRODUCT')
        res.redirect('/admin/products');
    })
    .catch( err => console.log(err));
}

export function getProducts(req, res, next) {
    Product.find({userId: req.user._id})
    .populate('userId')
    .then(products => {
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true,
          });
    })
    .catch(err => console.log(err));

}

export function postDeleteProduct(req, res, next) {
    const prodId = req.body.productId;
    Product.findOneAndDelete(prodId)
    .then(result => {
        console.log('DESTROYED')
    })
    .catch(err => console.log(err));
    res.redirect('/admin/products');
}