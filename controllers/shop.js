const Product = require('../models/product');
const User = require("../models/user")
const mongoose = require("mongoose")

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log("prod", prodId);
  if (!mongoose.Types.ObjectId.isValid(prodId)) {
    return res.status(400).send('Invalid productId');
  }
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(products => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;

  console.log("user",req.user);

  const cartProductIndex = req.user.cart.items.findIndex((item)=>{
    return item==prodId;
  })

    const cartItems = req.user.cart.items;
  console.log("cartitem", cartItems);
  if(cartProductIndex===-1){
    cartItems.push({productId:prodId, quantity:1})
  }else{
    cartItems.push({productId:prodId, quantity:cartProductIndex+1})
  }

  console.log("cart",cartItems);
  // const updatedCart = {
  //   items
  // }

  User.findByIdAndUpdate(req.user._id, {$set: {"cart.items":cartItems}}).then((result)=>{
    console.log(result);
  }).catch(error=>{
    console.log(error);
  })







  // console.log("proreq", prodId);
  // Product.findById(prodId)
  //   .then(product => {
  //     console.log("abhi", product);
  //     return req.user.addToCart(product);
  //   })
  //   .then(result => {
  //     console.log(result);
  //     res.redirect('/cart');
  //   });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteItemFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .addOrder()
    .then(result => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
