import express from "express"
import multer from "multer"
import { admin, protect } from "../../middlewares/authMiddleware.js"
import { uploadDocument, getDocuments, deleteDocument } from "./document.controller.js"

const router = express()
const upload = multer({ dest: "uploads/" })

router.post("/upload", protect, admin, upload.single("file"), uploadDocument)
router.get("/", protect, admin, getDocuments)
router.delete("/:id", protect, admin, deleteDocument)


export default router