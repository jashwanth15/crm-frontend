import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Landing from './views/Landing';
import Login from './views/Login';
import Signup from './views/Signup';
import Onboarding from './views/Onboarding';
import ResetPassword from './views/ResetPassword';
import AppLayout from './components/AppLayout';
import { Toaster } from 'react-hot-toast';

function App() {
  const [appState, setAppState] = useState('landing'); // landing, login, signup, onboarding, app, reset-password
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (window.location.pathname.startsWith('/reset-password') || window.location.search.includes('token=')) {
        setAppState('reset-password');
        setIsLoading(false);
        return;
      }

      if (localStorage.getItem('token')) {
        try {
          await axios.get('/api/workspace');
          setAppState('app');
        } catch (err) {
          if (err.response?.status === 404) {
            setAppState('onboarding');
          } else {
            localStorage.removeItem('token');
            setAppState('login');
          }
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLoginSuccess = async () => {
    try {
      await axios.get('/api/workspace');
      setAppState('app');
    } catch (err) {
      if (err.response?.status === 404) {
        setAppState('onboarding');
      } else {
        setAppState('login');
      }
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  const renderCurrentState = () => {
    switch (appState) {
      case 'landing':
        return <Landing onNavigate={setAppState} />;
      case 'login':
        return <Login onNavigate={setAppState} onLogin={handleLoginSuccess} />;
      case 'signup':
        return <Signup onNavigate={setAppState} onSignup={handleLoginSuccess} />;
      case 'onboarding':
        return <Onboarding onComplete={() => setAppState('app')} />;
      case 'reset-password':
        return <ResetPassword onNavigate={setAppState} />;
      case 'app':
        return <AppLayout onLogout={() => {
          localStorage.removeItem('token');
          setAppState('landing');
        }} />;
      default:
        return <Landing onNavigate={setAppState} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Toaster position="bottom-right" />
      {renderCurrentState()}
    </div>
  );
}

export default App;
