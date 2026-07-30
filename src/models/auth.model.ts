import { Schema, model, Types, Document } from 'mongoose';

interface IAuth extends Document {
  userId: Types.ObjectId;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const authSchema = new Schema<IAuth>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
);

const Auth = model<IAuth>('Auth', authSchema);

export default Auth;
