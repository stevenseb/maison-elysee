import mongoose, { Schema, Document, Model } from 'mongoose';
const { v4: uuidv4 } = require('uuid');

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
  username: string;
  hashedPassword: string;
}

const UserSchema: Schema<IUser> = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true, default: uuidv4 },
  username: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
