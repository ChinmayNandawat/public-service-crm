import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AuthProvider navigate={navigate} location={location}>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/submit-complaint" 
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <SubmitComplaint />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/my-complaints" 
              element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <MyComplaints />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/officer" 
              element={
                <ProtectedRoute allowedRoles={['officer']}>
                  <OfficerDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
