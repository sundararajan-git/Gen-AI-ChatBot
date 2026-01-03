import { model, Schema } from "mongoose"


const DocumentSchema = new Schema({
    title: { type: String, required: true },
    filename: { type: String, required: true },
    fileType: { type: String, enum: ['md', 'pdf'], required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ['processing', 'processed', 'error'], default: "processed" }
}, { timestamps: true })

export const Document = model("Document", DocumentSchema)