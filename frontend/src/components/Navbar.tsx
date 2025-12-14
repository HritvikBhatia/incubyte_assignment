import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Candy } from 'lucide-react';

const Navbar = () => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <Candy />
          <span>SweetShop</span>
        </Link>
        <div className="flex items-center space-x-6">
          {isAdmin && <span className="bg-indigo-700 px-3 py-1 rounded text-sm">Admin View</span>}
          <button 
            onClick={handleLogout} 
            className="flex items-center space-x-1 hover:text-indigo-200 transition"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;