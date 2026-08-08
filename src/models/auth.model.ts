import { Schema, model, Types, Document } from 'mongoose';
import type { PushSubscriptionObject } from '../types/notifications.ts';

interface IAuth extends Document {
  userId: Types.ObjectId;
  refreshToken: string;
  subscriptionObject?: PushSubscriptionObject;
  createdAt: Date;
  updatedAt: Date;
}

const authSchema = new Schema<IAuth>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    refreshToken: String,
    subscriptionObject: {
      endpoint: { type: String, required: false },
      keys: {
        p256dh: { type: String, required: false },
        auth: { type: String, required: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

const Auth = model<IAuth>('Auth', authSchema);

export default Auth;
