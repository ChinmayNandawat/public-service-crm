import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { ToastProvider } from './components/ToastNotifications';
import Navbar from './components/Navbar';
import OfflineBanner from './components/OfflineBanner';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitComplaint from './pages/SubmitComplaint';
import MyComplaints from './pages/MyComplaints';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import OfficerDashboard from './pages/OfficerDashboard';
import SocketTest from './pages/SocketTest';
import SimpleSocketTest from './pages/SimpleSocketTest';
import TransparencyPortal from './pages/TransparencyPortal';
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider navigate={navigate} location={location}>
        <ToastProvider>
          <div className="min-h-screen w-full bg-slate-950 text-slate-50 font-sans selection:bg-cyan-500/30 overflow-x-hidden flex flex-col transition-colors duration-300">
            <OfflineBanner />
            <Navbar />
            <main className="flex-1 flex flex-col">
              <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/transparency" element={<TransparencyPortal />} />
            <Route path="/socket-test" element={<SocketTest />} />
            <Route path="/simple-socket-test" element={<SimpleSocketTest />} />
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
                <ProtectedRoute allowedRoles={['citizen', 'officer', 'admin']}>
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
      </ToastProvider>
    </AuthProvider>
    </ThemeProvider>
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
