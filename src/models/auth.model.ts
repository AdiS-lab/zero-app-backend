import { Schema, model, Types } from "mongoose";

interface IAuth {
  userId: Types.ObjectId;
  refreshToken: String;
}

const authSchema = new Schema<IAuth>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  refreshToken: String,
});

export const Auth = model<IAuth>("Auth", authSchema);
