import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBidEntry {
  userId: string;
  userName: string;
  amount: number;
  time: Date;
}

export interface IAuctionWinner {
  userId: Types.ObjectId;
  finalBid: number;
  paidAt?: Date;
}

export interface IAuction extends Document {
  artworkId: Types.ObjectId;
  startingBid: number;
  currentBid: number;
  currentBidderId?: Types.ObjectId;
  bidIncrement: number;
  bidHistory: IBidEntry[];
  endTime: Date;
  status: 'upcoming' | 'live' | 'ended' | 'sold' | 'unsold';
  winner?: IAuctionWinner;
  serialNumber: string;
  certificateS3Url?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BidEntrySchema = new Schema<IBidEntry>(
  {
    userId: { type: String, required: true },
    userName: { type: String, default: 'Anonymous' },
    amount: { type: Number, required: true },
    time: { type: Date, default: Date.now },
  },
  { _id: false }
);

const AuctionSchema = new Schema<IAuction>(
  {
    artworkId: {
      type: Schema.Types.ObjectId,
      ref: 'Artwork',
      required: true,
    },
    startingBid: { type: Number, required: true },
    currentBid: { type: Number, default: 0 },
    currentBidderId: { type: Schema.Types.ObjectId, ref: 'User' },
    bidIncrement: { type: Number, required: true, default: 500 },
    bidHistory: [BidEntrySchema],
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['upcoming', 'live', 'ended', 'sold', 'unsold'],
      default: 'upcoming',
    },
    winner: {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      finalBid: { type: Number },
      paidAt: { type: Date },
    },
    serialNumber: { type: String, required: true, unique: true },
    certificateS3Url: { type: String },
  },
  { timestamps: true }
);

// One Piece Only enforcement
AuctionSchema.pre('save', async function () {
  if (this.isNew) {
    const existingSold = await mongoose
      .model<IAuction>('Auction')
      .findOne({ artworkId: this.artworkId, status: 'sold' });

    if (existingSold) {
      throw new Error(
        'This artwork has already been sold as a One Piece Only item. No new auctions can be created.'
      );
    }
  }
});

const Auction =
  (mongoose.models.Auction as mongoose.Model<IAuction>) ||
  mongoose.model<IAuction>('Auction', AuctionSchema);

export default Auction;
