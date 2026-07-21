import { Schema, model, Types } from 'mongoose';

import MODELS from '../constants/MODELS';

interface IChat {
  userId: Types.ObjectId;
  chatroomId: Types.ObjectId;
  messages: Array<string>;
}

const chatSchema = new Schema<IChat>({
  userId: { type: Schema.Types.ObjectId, ref: MODELS.USER },
  chatroomId: { type: Schema.Types.ObjectId, ref: 'Chatroom' },
  messages: { type: [String] },
});

const Chat = model<IChat>('Chat', chatSchema);

export default Chat;
