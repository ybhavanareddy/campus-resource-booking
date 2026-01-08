import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUserPlus,
} from 'react-icons/fa';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    general: '',
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  /* -------- Password Rules -------- */
  const passwordRules = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isStrongPassword =
    passwordRules.length &&
    passwordRules.uppercase &&
    passwordRules.number &&
    passwordRules.special;

  /* -------- Validation -------- */
  const validate = () => {
    let valid = true;
    const newErrors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

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
    } else if (!isStrongPassword) {
      newErrors.password =
        'Password must meet all requirements';
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        'Please confirm your password';
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword =
        'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  /* -------- Submit -------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    });

    if (!validate()) return;

    try {
      const res = await api.post('/auth/signup', {
        name,
        email,
        password,
        role,
      });

      login(res.data.user, res.data.token, true);
      navigate('/');
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general:
          err.response?.data?.message ||
          'Registration failed',
      }));
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>
          <FaUserPlus /> Register
        </h2>

        {errors.general && (
          <p className="error-text">{errors.general}</p>
        )}

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="input-group">
            <FaUser className="input-icon" />
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {errors.name && (
            <p className="field-error">{errors.name}</p>
          )}

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
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
            <span
              className="toggle-password"
              onClick={() =>
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* Password rules – REAL APP BEHAVIOR */}
          {isPasswordFocused && !isStrongPassword && (
            <div className="password-rules">
              <span
                className={
                  passwordRules.length
                    ? 'valid'
                    : 'invalid'
                }
              >
                - At least 8 characters
              </span>
              <span
                className={
                  passwordRules.uppercase
                    ? 'valid'
                    : 'invalid'
                }
              >
                - One uppercase letter (A–Z)
              </span>
              <span
                className={
                  passwordRules.number
                    ? 'valid'
                    : 'invalid'
                }
              >
                - One number (0–9)
              </span>
              <span
                className={
                  passwordRules.special
                    ? 'valid'
                    : 'invalid'
                }
              >
                - One special character (@#$%)
              </span>
            </div>
          )}

          {errors.password && (
            <p className="field-error">{errors.password}</p>
          )}

          {/* Confirm Password */}
          <div className="input-group">
            <FaLock className="input-icon" />
            <input
              type={
                showConfirmPassword ? 'text' : 'password'
              }
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />
            <span
              className="toggle-password"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >
              {showConfirmPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </span>
          </div>
          {errors.confirmPassword && (
            <p className="field-error">
              {errors.confirmPassword}
            </p>
          )}

          {/* Role */}
          <label className="role-label">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="auth-btn">
            Create Account
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{' '}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
