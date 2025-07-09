import User from "../models/user.model.js";
import Friend from "../models/friends.model.js";

export const acceptFriendRequest = async (req, res) => {

    const Id = req.body.id;
    console.log(Id);
    const receiverId = req.user._id;
    try {
        const friendRequest = await Friend.findOneAndUpdate(
            {
                _id: Id,
                receiverId: receiverId,
            },
            { status: "accepted" },
            { new: true }
        );

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }

        res.status(200).json(friendRequest);
    } catch (error) {
        console.log("Error in acceptFriendRequest controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const sendFriendRequest = async (req, res) => {
    const { receiverId } = req.body;
    const senderId = req.user._id;
    try {
        const isFriend = await Friend.findOne({ $or: [{ senderId, receiverId }, { receiverId: senderId, senderId }] });
        if (isFriend) {
            return res.status(400).json({ message: "Friend request already sent" });
        }

        const newFriend = new Friend({ senderId, receiverId });
        await newFriend.save();

        setTimeout(async () => {
            const friend = await Friend.findOneAndDelete({ senderId, receiverId, status: "pending" });
            if (friend) {
                console.log("Friend request deleted");
            }
        }, 24 * 60 * 60 * 1000);

        res.status(201).json(newFriend);
    } catch (error) {
        console.log("Error in addFriend controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const getFriendRequests = async (req, res) => {
    const userId = req.user._id;
    try {
        const friendRequests = await Friend.find({
            $or: [
                { receiverId: userId, status: "pending" }
            ],
        }).select("senderId receiverId");

        const friendRequestsWithUserDetails = await Promise.all(
            friendRequests.map(async (request) => {
                const sender = await User.findById(request.senderId).select("-password");
                const receiver = await User.findById(request.receiverId).select("-password");
                return {
                    ...request.toObject(),
                    sender,
                };
            })
        );
        res.status(200).json(friendRequestsWithUserDetails);
    } catch (error) {
        console.log("Error in getFriendRequests controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getFriends = async (req, res) => {
    const userId = req.user._id;
    try {
        const friends = await Friend.find({
            $or: [
                { senderId: userId, status: "accepted" },
                { receiverId: userId, status: "accepted" },
            ],
        }).select("senderId receiverId");

        const friendIds = friends.reduce((acc, curr) => {
            if (curr.senderId.toString() !== userId) {
                acc.push(curr.senderId);
            }
            if (curr.receiverId.toString() !== userId) {
                acc.push(curr.receiverId);
            }
            return acc;
        }, [])

        const friendsData = await User.find({ $and: [{ _id: { $in: friendIds } }, { _id: { $ne: userId } }] }).select("-password");
        res.status(200).json(friendsData);

    } catch (error) {
        console.log("Error in getFriends controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
