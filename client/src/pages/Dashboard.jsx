import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page">
      <h2>Dashboard</h2>

      <p>
        Welcome, <strong>{user.name}</strong> ({user.role})
      </p>

      {/* USER DASHBOARD */}
      {user.role === 'user' && (
        <div>
          <h3>User Actions</h3>

          <Link to="/resources">
            <button style={{ marginRight: 10 }}>View Resources</button>
          </Link>

          <Link to="/my-bookings">
            <button>My Bookings</button>
          </Link>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {user.role === 'admin' && (
        <div>
          <h3>Admin Actions</h3>

          <Link to="/admin/analytics">
            <button style={{ marginRight: 10 }}>View Analytics</button>
          </Link>

          <Link to="/resources">
            <button>Manage Resources</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
