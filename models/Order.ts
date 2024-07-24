// models/Order.ts
import mongoose, { Schema, Document, Model } from 'mongoose';
const { v4: uuidv4 } = require('uuid');

export interface IOrderItem extends Document {
  itemId: string;
  name: string;
  size: string;
  mainColor: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  userId: string;
  orderId: string;
  orderDate: Date;
  shippingDate: Date;
  items: IOrderItem[];
}

const OrderItemSchema: Schema = new Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  mainColor: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema: Schema<IOrder> = new Schema({
  userId: { type: String, required: true },
  orderId: { type: String, default: uuidv4, unique: true },
  orderDate: { type: Date, default: Date.now },
  shippingDate: { type: Date, required: true },
  items: [OrderItemSchema],
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
