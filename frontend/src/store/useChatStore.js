import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  friends: [],
  requests: [],
  latestMessages: {},
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  unreadUserIds: [],

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
      if (res.data.length > 0) {
        set((state) => ({
          latestMessages: {
            ...state.latestMessages,
            [userId]: res.data[res.data.length - 1],
          },
        }));
      }
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
      const { latestMessages } = get();
      set({
        messages: [...messages, res.data],
        latestMessages: {
          ...latestMessages,
          [selectedUser._id]: res.data,
        },
      });
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },
  latestMessage: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { latestMessages } = get();
      set({
        latestMessages: {
          ...latestMessages,
          [newMessage.senderId]: newMessage,
        },
      });
    });
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      const { selectedUser, unreadUserIds, messages } = get();
      // const authUserId = useAuthStore.getState().authUser._id;

      // Determine the other user's ID in this conversation
      // const otherUserId =
      //   newMessage.senderId === authUserId
      //     ? newMessage.receiverId
      //     : newMessage.senderId;
      // // Update latest message for the sender
      // set({
      //   latestMessages: {
      //     ...latestMessages,
      //     [otherUserId]: newMessage,
      //   },
      // });

      // ...existing unread logic...
      if (!selectedUser || newMessage.senderId !== selectedUser._id) {
        if (!unreadUserIds.includes(newMessage.senderId)) {
          set({
            unreadUserIds: [...unreadUserIds, newMessage.senderId],
          });
        }
      }
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        set({
          messages: [...messages, newMessage],
        });
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
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

  setSelectedUser: (selectedUser) => {
    set((state) => ({
      selectedUser,
      unreadUserIds: state.unreadUserIds.filter((id) => id !== selectedUser?._id),
    }));
  },
}));
