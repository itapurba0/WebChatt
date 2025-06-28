import express from "express"
import { login, logout, signup, updateProfile, checkAuth } from "../controller/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
const authRouter = express.Router()

authRouter.post("/signup", signup)
authRouter.post("/login", login)
authRouter.post("/logout", logout)
authRouter.put("/update-profile", protectRoute, updateProfile)
authRouter.get("/check", protectRoute, checkAuth)

export default authRouter