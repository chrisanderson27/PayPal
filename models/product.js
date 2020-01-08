var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: String,
  amount: String,
  description: String,
  quantity: Number,
  product_image_number: String,
  seller: {
    type: String,
    required: true
  },
  date_added: {
    type: Date,
    default: Date.now
  }
});

var Product = mongoose.model('Product', ProductSchema);

module.exports = Product;