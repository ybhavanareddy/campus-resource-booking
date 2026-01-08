import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  // Frontend validation
  const validate = () => {
    let valid = true;
    const newErrors = { email: '', password: '', general: '' };

    if (!email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '', general: '' });

    if (!validate()) return;

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.user, res.data.token, rememberMe);
      navigate('/');
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';

      if (message.toLowerCase().includes('email')) {
        setErrors({ email: message, password: '', general: '' });
      } else if (message.toLowerCase().includes('password')) {
        setErrors({ email: '', password: message, general: '' });
      } else {
        setErrors({ email: '', password: '', general: message });
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>
          <FaSignInAlt /> Login
        </h2>

        {errors.general && (
          <p className="error-text">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="input-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {errors.email && (
            <p className="field-error">{errors.email}</p>
          )}

          {/* Password */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && (
            <p className="field-error">{errors.password}</p>
          )}

          {/* Remember Me */}
          <div className="remember-row">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
          </div>

          <button type="submit" className="auth-btn">
            Login
          </button>
        </form>

        <p className="auth-link">
          New user? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
