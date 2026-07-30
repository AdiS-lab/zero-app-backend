import { Schema, model, Types, Document } from 'mongoose';

interface IChatroom extends Document {
  chatter: Types.ObjectId;
  chattee: Types.ObjectId;
  participants: Types.ObjectId[];
}

const chatroomSchema = new Schema<IChatroom>(
  {
    chatter: { type: Schema.Types.ObjectId, ref: 'User' },
    chattee: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  },
  {
    timestamps: true,
  }
);

chatroomSchema.pre('save', async function () {
  // if (!this.isModified('participants')) return;
  this.participants = [this.chatter, this.chattee];
});

const Chatroom = model<IChatroom>('Chatroom', chatroomSchema);

export default Chatroom;
