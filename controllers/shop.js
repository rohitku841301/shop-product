const Product = require('../models/product');
const User = require("../models/user")
const Order = require("../models/order");
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
  req.user.populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
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
  console.log("proreq", prodId);
  Product.findById(prodId)
    .then(product => {
      console.log("abhi", product);
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    });
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
  // req.user.populate('cart.items.productId')
  User.findOne(req.user._id)
  .then(async (user) => {
    console.log("user", user);
    const productsPromises = user.cart.items.map(async (i) => {
      let productDetail = await Product.findById(i.productId);
      console.log("productdet", productDetail);
      return { quantity: i.quantity, product: productDetail };
    });

    const products = await Promise.all(productsPromises);
    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },
      products: products,
    });

    return order.save();
  })
  .then((order) => {
    console.log("Order saved:", order);
  })

.then(result=>{
  return req.user.clearCart();
})
.then(()=>{
  res.redirect('/orders');
})
.catch(err=>{
  console.log(err)
})

};

exports.getOrders = async (req, res, next) => {
  Order.find({"user.userId": req.user._id})
    .then(orders => {
      console.log("o---",orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err));
};
