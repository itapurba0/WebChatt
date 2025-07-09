import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const FriendsPage = () => {
    const [tab, setTab] = useState("friends");
    const { friends, users, addFriend, deleteFriend, getUsers, getFriends, requests, getFriendRequests, acceptFriend } = useChatStore();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const { onlineUsers } = useAuthStore();


    useEffect(() => {
        const searchUsers = users.filter((user) => {
            const fullName = user.fullName.toLowerCase();
            return !friends.some((friend) => friend._id === user._id) && fullName.includes(search.toLowerCase());
        });
        setSearchResult(searchUsers);
    }, [search, users, friends]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        if (tab === "friends") {
            getFriends();
        } else if (tab === "available-users") {
            getUsers();
        } else if (tab === "friend-requests") {
            getFriendRequests();
        } else {
            setTab("friends");
        }
    }, [tab, getFriends, getUsers, getFriendRequests]);

    const handleAcceptRequest = (requesterId) => {
        acceptFriend(requesterId);
    };

    // const handleRejectRequest = (requesterId) => {
    //     deleteFriend(requesterId);
    // };

    return (
        <div className="min-h-screen max-w-2xl mx-auto pt-14 p-4 py-8">
            <nav className="flex justify-center mb-4">
                <button onClick={() => setTab("friends")} className={`px-4 py-2 rounded-lg ${tab === "friends" ? "bg-base-300" : "bg-transparent"}`}>
                    Friends
                </button>
                <button onClick={() => setTab("available-users")} className={`px-4 py-2 rounded-lg ${tab === "available-users" ? "bg-base-300" : "bg-transparent"}`}>
                    Available Users
                </button>
                <button onClick={() => setTab("friend-requests")} className={`px-4 py-2 rounded-lg ${tab === "friend-requests" ? "bg-base-300" : "bg-transparent"}`}>
                    Friend Requests
                </button>
            </nav>
            {tab === "friends" && (
                <ul className="space-y-4">
                    {friends.map((user) => (
                        <li key={user._id} className="flex items-center bg-base-200 p-4 rounded-lg">
                            <div className="mr-4">
                                <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="w-12 h-12 rounded-full" />
                            </div>
                            <div className="flex-1">
                                <span className="block font-semibold">{user.fullName}</span>
                                <span className={`block text-xs ${onlineUsers.includes(user._id) ? "text-green-500" : "text-red-500"}`}>
                                    {user.isOnline ? "online" : "offline"}
                                </span>
                            </div>
                            <div className="space-x-2">
                                <button onClick={() => deleteFriend(user._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {tab === "available-users" && (
                <div>
                    <form className="mt-4">
                        <input type="text" value={search} onChange={handleSearch} placeholder="Search by name" className="input input-bordered w-full max-w-xs" />
                    </form>
                    <ul className="space-y-4 mt-4">
                        {searchResult.map((user) => (
                            <li key={user._id} className="flex items-center bg-base-200 p-4 rounded-lg">
                                <div className="mr-4">
                                    <img src={user.profilePic || "/avatar.png"} alt={user.fullName} className="w-12 h-12 rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <span className="block font-semibold">{user.fullName}</span>
                                    <span className={`block text-xs ${user.isOnline ? "text-green-500" : "text-red-500"}`}>
                                        {user.isOnline ? "online" : "offline"}
                                    </span>
                                </div>
                                <div className="space-x-2">
                                    <button onClick={() => addFriend(user._id)}>Send Request</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {tab === "friend-requests" && (
                <div>
                    <ul className="space-y-4">
                        {requests.map((request) => (
                            <li key={request._id} className="flex items-center bg-base-200 p-4 rounded-lg">
                                <div className="mr-4">
                                    <img src={request.sender.profilePic || "/avatar.png"} alt={request.sender.fullName} className="w-12 h-12 rounded-full" />
                                </div>
                                <div className="flex-1">
                                    <span className="block font-semibold">{request.sender.fullName}</span>
                                </div>
                                <div className="space-x-2">
                                    
                                    <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FriendsPage;

