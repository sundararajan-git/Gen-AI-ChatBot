import { Schema, model } from "mongoose"


const ChatSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    contextUsed: [{ type: Schema.Types.ObjectId, ref: 'DocumentChunk' }],
    feedback: { type: String, enum: ["thumbs_up", "thumbs_down"], default: null }
}, { timestamps: true })


export const Chat = model("Chat", ChatSchema)