import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  friends: [],
  requests: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getFriends: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/friends/");
      set({ friends: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      set({ messages: [...messages, res.data] });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;
      toast.success("New message received");
      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  getLatestMessagesFromFriends: async () => {
    const { users } = get();
    const promises = users.map(async (user) => {
      const res = await axiosInstance.get(`/messages/${user._id}?limit=1`);
      return res.data[0];
    });
    const latestMessages = await Promise.all(promises);
    set({ messages: latestMessages });
  },

  addFriend: async (receiverId) => {
    try {
      await axiosInstance.post("/friends/send-request", { receiverId });
      toast.success("Friend request sent!");
      await get().getUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    }
  },

  acceptFriend: async (requestId) => {
    console.log(requestId);
    try {
      await axiosInstance.put("/friends/accept-request", { id: requestId });
      toast.success("Friend request accepted!");
      await get().getUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept friend request");
    }
  },
  /*************  ✨ Windsurf Command 🌟  *************/
  getFriendRequests: async () => {
    try {
      const res = await axiosInstance.get("/friends/requests");
      set({ requests: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to get friend requests");
    }
  },

  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
