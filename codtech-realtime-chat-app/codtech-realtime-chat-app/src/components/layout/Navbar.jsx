import { LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <div className="h-16 border-b border-zinc-100 bg-white flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
      <div className="flex items-center gap-3">
        <h1 className="font-semibold text-lg text-zinc-900 tracking-tight">ChatFlow</h1>
        <span className="px-2.5 py-1 bg-zinc-100 rounded-md text-xs font-medium text-zinc-600">
          Global Room
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-sm text-zinc-500">Online</span>
        </div>
        
        <div className="h-8 w-px bg-zinc-200 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-zinc-700 hidden sm:block">
            {currentUser?.displayName || currentUser?.email}
          </span>
          <button
            onClick={logout}
            className="p-2 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
