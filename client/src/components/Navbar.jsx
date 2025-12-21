import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-logo">Campus Booking</div>

      <div className="nav-links">
        {/* USER NAVIGATION */}
        {user && user.role === 'user' && (
          <>
            <Link className="nav-link" to="/resources">Resources</Link>
            <Link className="nav-link" to="/my-bookings">My Bookings</Link>
          </>
        )}

        {/* ADMIN NAVIGATION */}
        {user && user.role === 'admin' && (
          <>
            <Link className="nav-link" to="/admin/analytics">Analytics</Link>
            <Link className="nav-link" to="/admin/resources">Manage Resources</Link>

          </>
        )}
      </div>

      <div className="nav-auth">
        {!user ? (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
