import { Schema, model } from "mongoose";

interface IUser {
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  email: String,
  password: String,
});

const User = model<IUser>("User", userSchema);

export default User;
