import { model, Schema } from "mongoose"


const DocumentChunkSchema = new Schema({
    documentId: { type: Schema.Types.ObjectId, ref: 'Document', required: true },
    content: { type: String, required: true },
    index: { type: Number, required: true }
})

// create index for search
DocumentChunkSchema.index({ content: 'text' });


export const DocumentChunk = model("DocumentChunk", DocumentChunkSchema)