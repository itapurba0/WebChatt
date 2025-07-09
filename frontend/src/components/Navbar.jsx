import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, Menu, Users } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-base-100 border-b border-base-300 shadow flex items-center justify-between px-4 py-2 fixed top-0 left-0 z-60">
      {/* Left: Logo or Home */}
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-primary" />
          <span className="font-bold text-lg hidden sm:inline">WebChatt</span>
        </Link>
      </div>

      {/* Center: Navigation Links (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-6">
        {authUser && (
          <>
            <Link to="/settings" className="hover:text-primary transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
            <Link to="/profile" className="flex items-center gap-2 hover:opacity-80 transition-all">
              <img
                src={authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="size-8 rounded-full object-cover border"
              />
            </Link>
            <Link to="/friends" className="hover:text-primary transition-colors">
              <Users className="w-5 h-5" />
            </Link>
            <button className="flex items-center gap-2 hover:text-red-500 transition-colors" onClick={logout}>
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </>
        )}
      </div>

      {/* Right: Hamburger for mobile */}
      <button
        className="md:hidden p-2 rounded-full hover:bg-base-200 transition"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-primary" />
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full right-4 mt-2 w-48 bg-base-100 border border-base-300 rounded shadow-lg flex flex-col z-50 animate-fade-in">
          {authUser && (
            <>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 hover:bg-base-200 transition"
                onClick={() => setMenuOpen(false)}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 hover:bg-base-200 transition"
                onClick={() => setMenuOpen(false)}
              >
                <img
                  src={authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="size-7 rounded-full object-cover border"
                />
                <span>Profile</span>
              </Link>
              <Link
                to="/friends"
                className="flex items-center gap-2 px-4 py-2 hover:bg-base-200 transition"
                onClick={() => setMenuOpen(false)}
              >
                <Users className="w-5 h-5" />
                <span>Friends</span>
              </Link>
              <button
                className="flex items-center gap-2 px-4 py-2 hover:bg-base-200 text-left transition"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;