import { Schema, model } from 'mongoose';
import MODELS from '../constants/MODELS';
import argon2 from 'argon2';

interface IUser {
  email: string;
  password: string;
  verified: boolean;
  avatar: {
    buffer: Buffer;
    mimetype: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: {
      buffer: { type: Buffer },
      mimetype: { type: String },
    },
    deletedAt: { type: Date, default: null },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await argon2.hash(this.password);
});

const User = model<IUser>(MODELS.USER, userSchema);

export default User;
