import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Smart CRM
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {!user && (
              <>
                <Link to="/login" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                  Login
                </Link>
                <Link to="/register" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                  Register
                </Link>
              </>
            )}
            
            {user && (
              <>
                <Link to="/dashboard" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                  Dashboard
                </Link>
                
                {user.role === 'citizen' && (
                  <>
                    <Link to="/submit-complaint" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                      Submit Complaint
                    </Link>
                    <Link to="/my-complaints" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                      My Complaints
                    </Link>
                  </>
                )}
                
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                    Admin Dashboard
                  </Link>
                )}
                
                {user.role === 'officer' && (
                  <Link to="/officer" className="hover:bg-blue-700 px-3 py-2 rounded-md">
                    Officer Dashboard
                  </Link>
                )}
                
                <button
                  onClick={logout}
                  className="hover:bg-blue-700 px-3 py-2 rounded-md"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
