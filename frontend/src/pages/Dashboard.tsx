import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-6xl mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.fullName}!</h2>
        <p className="text-gray-700 mb-4">You are logged in as a <span className="font-medium">{user?.role}</span></p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user?.role === 'citizen' && (
            <>
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold mb-2">Submit Complaint</h3>
                <p className="text-gray-600 text-sm mb-3">File a new complaint with the city</p>
                <button
                  onClick={() => window.location.href = '/submit-complaint'}
                  className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                >
                  New Complaint
                </button>
              </div>
              
              <div className="bg-white p-4 rounded border">
                <h3 className="font-semibold mb-2">My Complaints</h3>
                <p className="text-gray-600 text-sm mb-3">View and track your complaints</p>
                <button
                  onClick={() => window.location.href = '/my-complaints'}
                  className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                >
                  View Complaints
                </button>
              </div>
            </>
          )}
          
          {user?.role === 'officer' && (
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-2">Assigned Complaints</h3>
              <p className="text-gray-600 text-sm mb-3">View complaints assigned to you</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                View Assigned
              </button>
            </div>
          )}
          
          {user?.role === 'admin' && (
            <div className="bg-white p-4 rounded border">
              <h3 className="font-semibold mb-2">Admin Panel</h3>
              <p className="text-gray-600 text-sm mb-3">Manage all complaints and users</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded text-sm hover:bg-purple-700">
                Admin Panel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
