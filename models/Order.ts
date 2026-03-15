import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrderItem {
  artworkId: Types.ObjectId;
  type: 'digital' | 'print';
  printSize?: string;
  frameOption?: string;
  price: number;
}

export interface IShippingAddress {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IDownloadLink {
  artworkId: Types.ObjectId;
  url: string;
  expiresAt: Date;
  downloadCount: number;
  maxDownloads: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'stripe' | 'razorpay';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress?: IShippingAddress;
  shippingStatus: 'na' | 'processing' | 'shipped' | 'delivered';
  downloadLinks: IDownloadLink[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    artworkId: { type: Schema.Types.ObjectId, ref: 'Artwork', required: true },
    type: { type: String, enum: ['digital', 'print'], required: true },
    printSize: { type: String },
    frameOption: { type: String },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  { _id: false }
);

const DownloadLinkSchema = new Schema<IDownloadLink>(
  {
    artworkId: { type: Schema.Types.ObjectId, ref: 'Artwork', required: true },
    url: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    downloadCount: { type: Number, default: 0 },
    maxDownloads: { type: Number, default: 5 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, unique: true, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['stripe', 'razorpay'],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    shippingAddress: ShippingAddressSchema,
    shippingStatus: {
      type: String,
      enum: ['na', 'processing', 'shipped', 'delivered'],
      default: 'na',
    },
    downloadLinks: [DownloadLinkSchema],
  },
  { timestamps: true }
);

const Order =
  (mongoose.models.Order as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
