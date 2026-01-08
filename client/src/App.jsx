import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Resources from './pages/Resources';
import MyBookings from './pages/MyBookings';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminRoute from './components/AdminRoute';
import ManageResources from './pages/ManageResources';
import Layout from './layout/Layout';

function App() {
  return (
    <Routes>
      {/* Auth pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* App layout */}
      <Route element={<Layout />}>
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
      </Route>
    </Routes>
  );
}

export default App;
