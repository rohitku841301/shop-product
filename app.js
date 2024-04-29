const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const errorController = require('./controllers/error');
const User = require("./models/user");

// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  
  User.findById('662f3c4c277b627818593810')
    .then(user => {
      req.user = user;
      console.log(req.user);
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://rohitku841301:IDaygZ2RllEwA0ha@shop-product.3iq5nui.mongodb.net/shop-product').then(()=>{
  User.findOne().then(result=>{
    if(!result){
      const user = new User({
        name:"Rohit Kumar",
        email:"rohit@gmail.com",
        cart: {
          items: []
        }
      })
      user.save();
    }
  })
 
  app.listen(3000,()=>{
    console.log("server has started on 3000");
  })
}).catch(error=>{
  console.log(error);
})