import fs from "fs"
import { PDFParse } from "pdf-parse"
import { Document } from "../../model/documentModel.js"
import { DocumentChunk } from "../../model/documentChunkModel.js"
import { splitTextIntoChunks } from "../../utils/textSplitter.js"


const parseFileContent = async (file) => {
    const { originalname, path, mimetype } = file;

    if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
        const dataBuffer = fs.readFileSync(path);
        const data = await PDFParse(dataBuffer);
        return data.text;
    }

    if (
        mimetype === 'text/markdown' ||
        mimetype === 'text/plain' ||
        originalname.endsWith('.md')
    ) {
        return fs.readFileSync(path, 'utf8');
    }

    throw new Error('Unsupported file type. Use PDF or Markdown.');
};


export const createDocumentWithChunks = async ({ file, title, userId }) => {
    const content = await parseFileContent(file);

    const doc = await Document.create({
        title: title || file.originalname,
        filename: file.originalname,
        fileType: file.originalname.split('.').pop(),
        uploadedBy: userId,
        status: 'processed'
    });

    const chunks = splitTextIntoChunks(content);

    const chunkDocs = chunks.map((text, index) => ({
        documentId: doc._id,
        content: text,
        index
    }));

    await DocumentChunk.insertMany(chunkDocs);

    return { doc, chunkCount: chunks.length };
};


export const getAllDocuments = async () => {
    return Document.find().populate('uploadedBy', 'username');
};


export const removeDocument = async (id) => {
    await Document.findByIdAndDelete(id);
    await DocumentChunk.deleteMany({ documentId: id });
};