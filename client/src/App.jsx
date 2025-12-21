import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Resources from './pages/Resources';
import MyBookings from './pages/MyBookings';
import Navbar from './components/Navbar';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminRoute from './components/AdminRoute';
import ManageResources from './pages/ManageResources';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resources"
          element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          }
        />
        <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />
        <Route
          path="/admin/resources"
          element={
            <AdminRoute>
              <ManageResources />
            </AdminRoute>
          }
        />

      </Routes>
            

    </Router>
  );
}

export default App;
