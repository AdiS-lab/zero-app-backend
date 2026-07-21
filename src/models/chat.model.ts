import { Schema, model, Types } from 'mongoose';

interface IChat {
  userId: Types.ObjectId;
  chatroomId: Types.ObjectId;
  messages: Array<string>;
}

const chatSchema = new Schema<IChat>({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  chatroomId: { type: Schema.Types.ObjectId, ref: 'Chatroom' },
  messages: { type: [String] },
});

const Chat = model<IChat>('Chat', chatSchema);

export default Chat;
