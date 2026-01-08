import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-header">
        <h2>
          {user.role === 'admin'
            ? 'Admin Dashboard'
            : 'User Dashboard'}
        </h2>
        <p>
          Welcome back, <strong>{user.name}</strong>
        </p>
      </div>

      {/* USER DASHBOARD */}
      {user.role === 'user' && (
        <div className="dashboard-actions">
          <div className="action-card">
            <h3>Browse Resources</h3>
            <p>
              View available campus resources and make
              bookings.
            </p>
            <Link to="/resources">
              <button>View Resources</button>
            </Link>
          </div>

          <div className="action-card">
            <h3>My Bookings</h3>
            <p>
              View, update, or cancel your existing
              bookings.
            </p>
            <Link to="/my-bookings">
              <button>My Bookings</button>
            </Link>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD */}
      {user.role === 'admin' && (
        <div className="dashboard-actions">
          <div className="action-card">
            <h3>Analytics</h3>
            <p>
              View usage statistics and popular campus
              resources.
            </p>
            <Link to="/admin/analytics">
              <button>View Analytics</button>
            </Link>
          </div>

          <div className="action-card">
            <h3>Manage Resources</h3>
            <p>
              Add, update, or remove campus resources.
            </p>
            <Link to="/admin/resources">
  <button>Manage Resources</button>
</Link>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
