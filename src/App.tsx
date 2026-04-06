import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { getCurrentUser } from './lib/supabase';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSuccess = () => {
    checkUser();
  };

  const handleRegisterSuccess = () => {
    checkUser();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00ff88]/30 border-t-[#00ff88] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/dashboard" 
          element={
            user ? <Dashboard /> : <Navigate to="/login" />
          } 
        />
        <Route 
          path="/login" 
          element={
            user ? <Navigate to="/dashboard" /> : (
              authView === 'login' ? (
                <Login 
                  onSwitchToRegister={() => setAuthView('register')}
                  onLoginSuccess={handleLoginSuccess}
                />
              ) : (
                <Register
                  onSwitchToLogin={() => setAuthView('login')}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              )
            )
          } 
        />
        <Route 
          path="/register" 
          element={
            user ? <Navigate to="/dashboard" /> : (
              authView === 'register' ? (
                <Register
                  onSwitchToLogin={() => setAuthView('login')}
                  onRegisterSuccess={handleRegisterSuccess}
                />
              ) : (
                <Login 
                  onSwitchToRegister={() => setAuthView('register')}
                  onLoginSuccess={handleLoginSuccess}
                />
              )
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
