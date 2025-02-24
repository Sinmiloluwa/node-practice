import Product from '../models/product.js';
import mongodb from 'mongodb';
import { validationResult } from 'express-validator';
import { ValidationError } from 'sequelize';

const ObjectId = mongodb.ObjectId;

export function getAddProduct(req, res, next) {
    res.render('admin/edit-product', { 
      pageTitle: 'Add Product', 
      path: '/admin/add-product', 
      editing: false,
      hasError: false,
      errorMessage: null
    });
}

export function addProduct(req, res, next) {
    const title = req.body.title;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if(!image) {
        return res.status(422).render('admin/edit-product', { 
            pageTitle: 'Add Product', 
            path: '/admin/add-product', 
            editing: false,
            hasError: true,
            errorMessage: 'Attached file is not an image',
            product: {
                title: title,
                imageUrl: image,
                price: price,
                description: description
            }
        })
    }

    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('admin/edit-product', { 
            pageTitle: 'Add Product', 
            path: '/admin/add-product', 
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: title,
                imageUrl: image,
                price: price,
                description: description
            }
        });
    }

    const imageUrl = image.path;

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
    .catch(err => {
        res.redirect('/500');
        // return res.status(500).render('admin/edit-product', { 
        //     pageTitle: 'Add Product', 
        //     path: '/admin/add-product', 
        //     editing: false,
        //     hasError: true,
        //     errorMessage: 'Database operation failed',
        //     validationError: [],
        //     product: {
        //         title: title,
        //         imageUrl: imageUrl,
        //         price: price,
        //         description: description
        //     }
        // });
        const error = new Error('Product creation failed');
        error.httpStatusCode = 500;
        return next(error);
    });
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
            hasError: true,
            errorMessage: null,
        });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    })
}

export function postEditProduct(req, res, next) {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const image = req.file;
    const updatedDesc = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors.array())
        return res.status(422).render('admin/edit-product', { 
            pageTitle: 'Edit Product', 
            path: '/admin/edit-product', 
            editing: false,
            hasError: true,
            errorMessage: errors.array()[0].msg,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDesc,
                _id : prodId
            }
        });
    }

    Product.findById(prodId).then(product => {
        console.log(product);
        if(product.userId.toString() !== req.user._id.toString()) {
            req.flash('error', 'You are not authorized to edit this product');
            return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDesc;
        if(image) {
            product.imageUrl = image.path;
        }
        return product.save()
        .then(result => {
            console.log('UPDATED PRODUCT')
            res.redirect('/admin/products');
        })
    })
    .catch( err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
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
    Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(result => {
        console.log('DESTROYED')
    })
    .catch(err => console.log(err));
    res.redirect('/admin/products');
}