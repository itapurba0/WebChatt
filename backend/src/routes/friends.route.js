import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getFriends, sendFriendRequest, acceptFriendRequest,getFriendRequests } from "../controllers/friends.controller.js";

const router = express.Router();

router.get("/", protectRoute, getFriends);
router.post("/send-request", protectRoute, sendFriendRequest);
router.put("/accept-request", protectRoute, acceptFriendRequest);
//router.put("/reject-request/:id", protectRoute, rejectFriendRequest);
router.get("/requests", protectRoute, getFriendRequests);

export default router;
