import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const isAdmin = localStorage.getItem('role') === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold">Communication Calendar</h1>
            </div>
            <div className="ml-6 flex space-x-8">
              {isAdmin ? (
                <>
                  <a href="/admin" className="nav-link">Dashboard</a>
                  <a href="/admin/companies" className="nav-link">Companies</a>
                  <a href="/admin/methods" className="nav-link">Communication Methods</a>
                </>
              ) : (
                <>
                  <a href="/user" className="nav-link">Dashboard</a>
                  <a href="/user/calendar" className="nav-link">Calendar</a>
                  <a href="/user/reports" className="nav-link">Reports</a>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;