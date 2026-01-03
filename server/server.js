import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import AuthRoutes from "./modules/auth/auth.routes.js"
import ChatRoutes from "./modules/chat/chat.routes.js"
import DocsRoutes from "./modules/document/document.routes.js"


dotenv.config()
connectDB()
const app = express()
const PORT = process.env.PORT

// middlewares
app.use(cors())
app.use(express.json())


app.use('/api/auth', AuthRoutes)
app.use('/api/chat', ChatRoutes)
app.use('/api/docs', DocsRoutes)


app.get("/", (req, res) => {
    res.send("API is running...")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})