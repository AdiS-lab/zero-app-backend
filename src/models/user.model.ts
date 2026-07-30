import { Schema, model } from 'mongoose';
import MODELS from '../constants/MODELS';
import argon2 from 'argon2';

interface IUser {
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deletedAt: { type: Date, default: null },
    verified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  // this.password = 'SA' + this.password ;
  this.password = await argon2.hash(this.password);
  // pass through hashing functin like sha256 or bcrypt
});

const User = model<IUser>(MODELS.USER, userSchema);

export default User;
