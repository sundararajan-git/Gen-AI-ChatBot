import fs from 'fs';
import {
    createDocumentWithChunks,
    getAllDocuments,
    removeDocument
} from './document.services.js';

export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await createDocumentWithChunks({
            file: req.file,
            title: req.body.title,
            userId: req.user.id
        });

        fs.unlinkSync(req.file.path);

        res.status(201).json({
            message: 'Document uploaded and processed',
            docId: result.doc._id,
            chunks: result.chunkCount
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }

        res.status(400).json({
            message: 'Upload failed',
            error: error.message
        });
    }
};

export const getDocuments = async (req, res) => {
    try {
        const docs = await getAllDocuments();
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        await removeDocument(req.params.id);
        res.json({ message: 'Document removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

