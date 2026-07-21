import { Schema, model, Types } from "mongoose";

interface IChat {
  user1: Types.ObjectId;
  user2: Types.ObjectId;
}

const chatSchema = new Schema<IChat>({
  user1: { type: Schema.Types.ObjectId, ref: "User" },
  user2: { type: Schema.Types.ObjectId, ref: "User" },
});

export const Chat = model<IChat>("Chat", chatSchema);
