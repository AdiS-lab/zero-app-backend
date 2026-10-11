import { Schema, model, Types, Document } from 'mongoose';

interface IChatroom extends Document {
  createdBy: Types.ObjectId;
  participants: Types.ObjectId[];
  name: string;
  canonicalKey: string;
}

const chatroomSchema = new Schema<IChatroom>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    name: { type: String },
    canonicalKey: { type: String, unique: true, sparse: true },
  },
  {
    timestamps: true,
  }
);

chatroomSchema.pre('save', function () {
  if (!this.isNew) return;
  if (this.participants.length === 2) {
    this.canonicalKey = this.participants
      .map((id) => id.toString())
      .sort()
      .join('');
  }
});

const Chatroom = model<IChatroom>('Chatroom', chatroomSchema);

export default Chatroom;
