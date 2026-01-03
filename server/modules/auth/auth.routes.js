import express from "express"
import { loginUser, registerUser, checkUser } from "./auth.controller.js"
import { protect } from "../../middlewares/authMiddleware.js"

const router = express.Router()


router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/me", protect, checkUser)



export default router