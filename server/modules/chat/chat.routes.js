import express from "express"
import { askQuestion, getAdminStats, getHistory, submitFeedback } from "./chat.controller.js"
import { admin, protect } from "../../middlewares/authMiddleware.js"

const router = express()

router.post("/ask", askQuestion)
router.post("/feedback", submitFeedback)
router.get('/history', protect, getHistory);
router.get('/stats', protect, admin, getAdminStats);


export default router