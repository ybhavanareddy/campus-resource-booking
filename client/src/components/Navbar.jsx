import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  if (!user) return null;

  const dashboardTitle =
    user.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard';

  const avatarLetter = user.name?.charAt(0).toUpperCase() || 'U';

  return (
    <nav className="top-navbar">
      {/* LEFT */}
      <div className="nav-left">
        {/* Hamburger (mobile only) */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FaBars />
        </button>

        <span className="nav-logo">Campus Booking</span>
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <span className="dashboard-title">{dashboardTitle}</span>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <div className="profile-wrapper">
          <div
            className="avatar"
            onClick={() => setShowMenu(!showMenu)}
          >
            {avatarLetter}
          </div>

          {showMenu && (
            <div className="profile-menu">
              <p className="profile-name">{user.name}</p>
              <button onClick={logout}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
