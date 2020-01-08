var express = require('express');
var router = express.Router();

var Product = require('../models/product');

/* GET products page. */
router.get('/', function(req, res, next) {
  Product.find({}, function(err, products) {
    if (err) return next(err);
    res.render('products', { listings: products });
  });
});

/* GET product details. */
router.get('/:id', function(req, res, next) {
  Product.findById(req.params.id, function(err, product) {
    if (err) {
      // Handle the case where the id cannot be cast to an Object ID.
      res.render('products');
    } else {
      if (product) {
        res.render('product', { listing: product });
      } else {
        res.render('products');
      }
    }
  })
});

/* Create product. */
router.post('/', function(req, res, next) {
  Product.create({
    name: req.body.name,
    amount: req.body.amount,
    description: req.body.description,
    quantity: req.body.quantity,
    product_image_number: req.body.product_image_number,
    seller: req.body.seller
  }, function(err, product) {
    if (err) return next(err);
    return res.redirect('/dashboard');
  });
});

/* PUT a product by POST. */
router.post('/:id', function(req, res, next) {
  console.log('update listing');
  Product.updateOne(
    { _id: req.params.id },
    { $set: req.body },
  function(err, product) {
    if (err) return next(err);
    res.redirect('/dashboard');
  });
});

module.exports = router;