import { Schema, model, Document } from 'mongoose';

interface IEmail extends Document {
  to: string;
  subject: string;
  text: string;
  html?: string;
  sentAt: Date;
}

const emailSchema = new Schema<IEmail>({
  to: { type: String, required: true },
  subject: { type: String, required: true },
  text: { type: String, required: true },
  html: { type: String, default: null },
  sentAt: { type: Date, default: Date.now() },
});

emailSchema.index({ sentAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });

const Email = model<IEmail>('Email', emailSchema);

export default Email;
