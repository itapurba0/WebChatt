import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { sendMessage, getUsers, getMessage } from "../controller/message.controller.js"
const router = express.Router()

router.get("/users", protectRoute, getUsers)
router.get("/:id", protectRoute, getMessage)
router.post("/send", protectRoute, sendMessage)



export default router;