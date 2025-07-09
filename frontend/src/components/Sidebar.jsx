import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Menu, X } from "lucide-react";

const Sidebar = () => {
  const { getFriends, friends, selectedUser, setSelectedUser, isUsersLoading, latestMessages, latestMessage } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getFriends();
    latestMessage();
  }, [getFriends, latestMessage]);

  const filteredUsers = showOnlineOnly
    ? friends.filter((user) => onlineUsers.includes(user._id))
    : friends;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Hamburger menu for mobile */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-base-100 pt-14 p-2 rounded-full shadow"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6 text-primary" />
      </button>

      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-base-100  z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 bottom-0 w-72 bg-base-200 border-r pt-14 border-base-300 z-50 flex flex-col
        transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:block
      `}
        style={{ transitionProperty: "transform" }}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-base-200 border-b border-base-300 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-semibold text-lg">Contacts</span>
          </div>
          {/* Close button for mobile */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-base-300 transition"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* ...rest of your sidebar content (filter, user list, etc)... */}
        <div className="mt-3 hidden lg:flex items-center gap-2 px-5">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                setSelectedUser(user);
                setOpen(false); // close sidebar on mobile after selecting
              }}
              className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>
              <div className="block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-xs text-zinc-500 truncate max-w-[10rem]">
                  {latestMessages[user._id]?.text
                    ? latestMessages[user._id].text
                    : latestMessages[user._id]?.image
                      ? "📷 Image"
                      : ""}
                </div>
              </div>
            </button>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No online users</div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
