import { Link, useLocation } from 'react-router-dom';
import {
  FaBook,
  FaCalendarCheck,
  FaChartBar,
  FaCogs,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/sidebar.css';

const Sidebar = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <>
      {/* Overlay (mobile) */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
        <nav>
          {user.role === 'user' && (
            <>
              <Link
                to="/resources"
                className={location.pathname === '/resources' ? 'active' : ''}
                onClick={closeSidebar}
              >
                <FaBook />
                <span>Resources</span>
              </Link>

              <Link
                to="/my-bookings"
                className={location.pathname === '/my-bookings' ? 'active' : ''}
                onClick={closeSidebar}
              >
                <FaCalendarCheck />
                <span>My Bookings</span>
              </Link>
            </>
          )}

          {user.role === 'admin' && (
            <>
              <Link
                to="/admin/analytics"
                className={location.pathname === '/admin/analytics' ? 'active' : ''}
                onClick={closeSidebar}
              >
                <FaChartBar />
                <span>Analytics</span>
              </Link>

              <Link
                to="/admin/resources"
                className={location.pathname === '/admin/resources' ? 'active' : ''}
                onClick={closeSidebar}
              >
                <FaCogs />
                <span>Manage Resources</span>
              </Link>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
