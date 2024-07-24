import mongoose, { Schema, Document, Model } from 'mongoose';

interface Image {
  url: string;
  main: boolean;
}

export interface ItemDocument extends Document {
  name: string;
  size: string[];
  mainColor: string;
  price: number;
  description: string;
  gender: 'mens' | 'womens' | 'unisex';
  category: 'shirt' | 'pants' | 'dress' | 'shorts' | 't-shirt';
  style: string;
  images: Image[];
  saleDiscount?: number;
  quantity: number;
}

const ItemSchema: Schema<ItemDocument> = new Schema({
  name: { type: String, required: true },
  size: { type: [String], required: true },
  mainColor: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  gender: { type: String, required: true },
  category: { type: String, required: true },
  style: { type: String, required: true },
  images: [{ url: String, main: Boolean }],
  saleDiscount: { type: Number, default: 0 },
  quantity: { type: Number, required: true },
}, { timestamps: true });

const Item: Model<ItemDocument> = mongoose.models.Item || mongoose.model<ItemDocument>('Item', ItemSchema);

export default Item;
