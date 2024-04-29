const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('662da5d4baa408bddaf9fce0')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       console.log(req.user);
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://rohitku841301:IDaygZ2RllEwA0ha@shop-product.3iq5nui.mongodb.net/shop-product').then(()=>{
  app.listen(3000,()=>{
    console.log("server has started on 3000");
  })
}).catch(error=>{
  console.log(error);
})