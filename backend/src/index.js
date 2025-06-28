import express from "express"
import authRouter from "./routes/auth.route.js"
import messageRouter from "./routes/message.route.js"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import { connectDB } from "./lib/db.js"
import bodyParser from "body-parser"

//const bodyParser = require("body-parser")
const app = express()
dotenv.config()
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser())
app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }))
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

}))
app.use("/api/auth", authRouter)
app.use("/api/messages", messageRouter)

app.listen(5001, () => {
    console.log("Server is running on port 5001")
    connectDB()
})