import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  artworkId: string;
  slug: string;
  title: string;
  type: 'digital' | 'print';
  printSize?: string;
  frameOption?: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  address: string;
  city: string;
  country: string;
  zip: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  email: string;
  name: string;
  items: IOrderItem[];
  total: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  downloadToken?: string;
  shippingAddress?: IShippingAddress;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema(
  {
    artworkId: { type: String, required: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['digital', 'print'], required: true },
    printSize: { type: String },
    frameOption: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    name: { type: String, required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    currency: { type: String, default: 'INR' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    downloadToken: { type: String, index: true },
    shippingAddress: {
      address: String,
      city: String,
      country: String,
      zip: String,
    },
  },
  { timestamps: true }
);

const Order =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
