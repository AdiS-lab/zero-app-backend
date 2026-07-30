import { Schema, model, Types, Document } from 'mongoose';

import MODELS from '../constants/MODELS';

type MediaType = 'image' | 'video' | 'audio' | 'file';

interface IMessage {
  chatter: Types.ObjectId;
  content: string;
  media?: {
    mediaUrls: string[];
    mediaType: MediaType;
  };
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  chatter: { type: Schema.Types.ObjectId, ref: MODELS.USER },
  content: { type: String },
  media: {
    mediaUrls: [String],
    mediaType: { type: String, enum: ['image', 'video', 'audio', 'file'] },
  },
  timestamp: { type: Date, default: Date.now },
});

interface IChat extends Document {
  // userId: Types.ObjectId;
  chatroomId: Types.ObjectId;
  messages: (typeof messageSchema)[];
}

const chatSchema = new Schema<IChat>({
  chatroomId: { type: Schema.Types.ObjectId, ref: 'Chatroom' },
  messages: { type: [messageSchema], default: [] },
});

const Chat = model<IChat>('Chat', chatSchema);

export default Chat;
