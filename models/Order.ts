import mongoose, { Schema, Document, Model } from 'mongoose';
const { v4: uuidv4 } = require('uuid');

interface OrderItem {
  itemId: string;
  name: string;
  size: string;
  mainColor: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  orderId: string;
  userId: string;
  orderDate: Date;
  shippingDate: Date;
  items: OrderItem[];
}

const OrderItemSchema: Schema<OrderItem> = new Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: String, required: true },
  mainColor: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
});

const OrderSchema: Schema<IOrder> = new Schema({
  orderId: { type: String, default: uuidv4, unique: true },
  userId: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  shippingDate: { type: Date, default: () => new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
  items: { type: [OrderItemSchema], required: true },
});

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
