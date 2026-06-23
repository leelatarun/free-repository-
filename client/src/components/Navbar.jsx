import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ isAdmin, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate('/');
  }

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <div>
            <p className="font-bold text-gray-800 leading-tight">Lucky Reading Room</p>
            <p className="text-xs text-gray-500">Book your seat</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <Link
                to="/admin"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
