import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name?: string;
  image?: string;
  googleId?: string;
  orders: Types.ObjectId[];
  bids: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true },
    name: { type: String },
    image: { type: String },
    googleId: { type: String },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    bids: [{ type: String }],
  },
  { timestamps: true }
);

const User =
  (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);

export default User;
