import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PlanTour from './pages/PlanTour';
import Explore from './pages/Explore';
import DestinationDetails from './pages/DestinationDetails';
import PlaceDetails from './pages/PlaceDetails';
import Favorites from './pages/Favorites';
import MyTrips from './pages/MyTrips';
import BookingHistory from './pages/BookingHistory';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import { useEffect } from 'react';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <AuthProvider>
      <FavoritesProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
            <Route path="/plan-tour" element={<ProtectedRoute><AppLayout><PlanTour /></AppLayout></ProtectedRoute>} />
            
            {/* Explore routes */}
            <Route path="/explore" element={<ProtectedRoute><AppLayout><Explore /></AppLayout></ProtectedRoute>} />
            <Route path="/explore/:id" element={<ProtectedRoute><AppLayout><DestinationDetails /></AppLayout></ProtectedRoute>} />
            <Route path="/places/:id" element={<ProtectedRoute><AppLayout><PlaceDetails /></AppLayout></ProtectedRoute>} />
            
            <Route path="/favorites" element={<ProtectedRoute><AppLayout><Favorites /></AppLayout></ProtectedRoute>} />
            <Route path="/my-trips" element={<ProtectedRoute><AppLayout><MyTrips /></AppLayout></ProtectedRoute>} />
            <Route path="/booking-history" element={<ProtectedRoute><AppLayout><BookingHistory /></AppLayout></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;
