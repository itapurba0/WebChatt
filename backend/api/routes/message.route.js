import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.get("/:id([0-9]+)", protectRoute, getMessages);

router.post("/send/:id([0-9]+)", protectRoute, sendMessage);

export default router;
