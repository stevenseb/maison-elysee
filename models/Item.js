const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [String],
    required: true,
  },
  mainColor: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['mens', 'womens', 'unisex'],
    required: true,
  },
  category: {
    type: String,
    enum: ['shirt', 'pants', 'dress', 'shorts', 't-shirt'],
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  saleDiscount: {
    type: Number,
    default: 0,
  },
  quantity: {
    type: Number,
    default: 1,
    required: true,
  },
});

module.exports = mongoose.models.Item || mongoose.model('Item', ItemSchema);
