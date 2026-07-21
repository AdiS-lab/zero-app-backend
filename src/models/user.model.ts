import { Schema, model } from 'mongoose';
import MODELS from '../constants/MODELS';

interface IUser {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', function () {
  if (!this.isModified('password')) return;

  this.password = 'SA' + this.password + 'LT';
  // pass through hashing functin like sha256 or bcrypt
});

const User = model<IUser>(MODELS.USER, userSchema);

export default User;
