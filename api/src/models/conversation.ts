import { Schema, model, Document } from 'mongoose'

interface IConversation extends Document {
  members: Schema.Types.ObjectId[]
}

const conversationSchema = new Schema<IConversation>({
  members: [{
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }]
})

const Conversation = model<IConversation>('Conversation', conversationSchema)

export default Conversation