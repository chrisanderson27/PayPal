var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../models/user');
var Product = require('../models/product');

/* GET home page. */
router.get('/', function (req, res, next) {
  Product.find().sort({ date_added: -1 }).limit(4).exec(function (err, products) {
    if (err) return next(err);
    res.render('index', { listings: products });
  });
});

/* GET signup page. */
router.get('/signup', function (req, res, next) {
  if (req.user) {
    res.redirect('/dashboard');
  } else {
    res.render('signup');
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/signup'
}));

router.get('/connectWithPaypal', function (req, res, next) {
  console.log('connectWithPayPal...')
  console.log(req)
  console.log(res)
  // req.logout();
  // res.redirect('/dashboard');
  res.redirect('www.google.com');
})

router.get('/logout', function (req, res, next) {
  req.logout();
  res.redirect('/');
})

router.post('/signup', function (req, res, next) {
  User.create({
    business_name: req.body.business_name,
    business_address: req.body.business_address,
    city: req.body.city,
    state: req.body.state,
    zip_code: req.body.zip_code,
    email: req.body.email,
    password: req.body.password
  }, function (err, user) {
    if (err) return next(err);
    req.login(user, function (err) {
      if (err) return next(err);
      return res.redirect('/dashboard');
    });
  });
});

router.get('/dashboard', function (req, res, next) {
  if (req.user) {
    Product.find({ seller: req.user._id }, function (err, products) {
      if (err) return next(err);
      res.render('dashboard', {
        user: req.user,
        listings: products
      });
    });
  } else {
    res.render('signup');
  }
});

module.exports = router;
