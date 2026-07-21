import { Schema, model, Types} from 'mongoose'    

interface IChat{
    userId: Types.ObjectId
    chatroomId: Types.ObjectId,
    messages: Array<String>
}

const chatSchema = new Schema<IChat>({
    userId: {type: Schema.Types.ObjectId, ref: "User"},
    chatroomId: {type: Schema.Types.ObjectId, ref: "Chatroom"},
    messages: Array<String>
})

const Chat = model<IChat>('Chat', chatSchema)