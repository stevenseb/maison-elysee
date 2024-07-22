import mongoose, { Document, Schema, Model } from 'mongoose';
const { v4: uuidv4 } = require('uuid');

export interface IItem extends Document {
  itemId: string;
  name: string;
  size: string[];
  mainColor: string;
  price: number;
  description: string;
  gender: 'mens' | 'womens' | 'unisex';
  category: 'shirt' | 'pants' | 'dress' | 'shorts' | 't-shirt';
  style: string;
  imageUrl: string;
  saleDiscount: number;
  quantity: number;
}

const ItemSchema: Schema<IItem> = new mongoose.Schema({
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

const Item: Model<IItem> = mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

export default Item;
