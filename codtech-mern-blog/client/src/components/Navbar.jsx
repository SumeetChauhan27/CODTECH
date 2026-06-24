import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, PenSquare, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold tracking-tighter hover:text-emerald-400 transition-colors">
            CODTECH Blog
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <div className="flex items-center text-slate-300">
                  <UserIcon size={18} className="mr-2" />
                  <span className="font-medium">{user.name}</span>
                </div>
                {/* We will build the Create Post page in Phase 4 */}
                <Link to="/" className="flex items-center bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-md font-medium transition">
                  <PenSquare size={18} className="mr-2" />
                  Write
                </Link>
                <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut size={18} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-md font-medium transition-colors shadow-md shadow-emerald-500/20">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
